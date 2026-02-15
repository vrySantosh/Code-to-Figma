import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as http from 'http';
import { ICONS, STATUS_COLORS, getColoredIcon } from './icons';

export class ControlPanelProvider {
    private panel: vscode.WebviewPanel | undefined;
    private serverProcess: childProcess.ChildProcess | null = null;
    private statusCheckInterval: NodeJS.Timeout | null = null;
    private isServerRunning = false;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public show() {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (this.panel) {
            this.panel.reveal(column);
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'codeToFigmaControl',
            'Code to Figma Control Panel',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this.context.extensionPath, 'resources'))
                ]
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        this.panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'startServer':
                        await this.startServer();
                        break;
                    case 'stopServer':
                        await this.stopServer();
                        break;
                    case 'restartServer':
                        await this.restartServer();
                        break;
                    case 'testConnection':
                        await this.testConnection();
                        break;
                    case 'checkStatus':
                        await this.updateStatus();
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );

        this.panel.onDidDispose(
            () => {
                if (this.statusCheckInterval) {
                    clearInterval(this.statusCheckInterval);
                }
                this.panel = undefined;
            },
            undefined,
            this.context.subscriptions
        );

        // Start status checking
        this.startStatusChecking();
        this.updateStatus();
    }

    private startStatusChecking() {
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
        }

        this.statusCheckInterval = setInterval(async () => {
            await this.updateStatus();
        }, 5000);
    }

    private async updateStatus() {
        const httpStatus = await this.checkHttpServer();
        const wsStatus = await this.checkWebSocketServer();

        this.panel?.webview.postMessage({
            command: 'statusUpdate',
            http: httpStatus,
            websocket: wsStatus,
            serverRunning: this.isServerRunning
        });
    }

    private async checkHttpServer(): Promise<boolean> {
        return new Promise(resolve => {
            const req = http.get('http://localhost:3333/health', { timeout: 1000 }, res => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
        });
    }

    private async checkWebSocketServer(): Promise<boolean> {
        // Check if port 3334 is in use (WebSocket server)
        return new Promise(resolve => {
            const net = require('net');
            const socket = new net.Socket();

            socket.setTimeout(1000);
            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });
            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });
            socket.on('error', () => resolve(false));

            socket.connect(3334, '127.0.0.1');
        });
    }

    public async startServer() {
        if (this.serverProcess) {
            this.panel?.webview.postMessage({
                command: 'notification',
                type: 'warning',
                message: 'Server is already running'
            });
            return;
        }

        try {
            const serverPath = path.join(this.context.extensionPath, 'figma-bridge-server.js');
            
            this.serverProcess = childProcess.spawn('node', [serverPath], {
                cwd: this.context.extensionPath,
                stdio: 'pipe'
            });

            this.isServerRunning = true;

            this.serverProcess.stdout?.on('data', (data) => {
                console.log(`Bridge Server: ${data}`);
                this.panel?.webview.postMessage({
                    command: 'serverLog',
                    message: data.toString()
                });
            });

            this.serverProcess.stderr?.on('data', (data) => {
                console.error(`Bridge Server Error: ${data}`);
                this.panel?.webview.postMessage({
                    command: 'serverLog',
                    message: `Error: ${data.toString()}`,
                    type: 'error'
                });
            });

            this.serverProcess.on('exit', (code) => {
                this.isServerRunning = false;
                this.serverProcess = null;
                this.panel?.webview.postMessage({
                    command: 'notification',
                    type: code === 0 ? 'info' : 'error',
                    message: `Server stopped (exit code: ${code})`
                });
                this.updateStatus();
            });

            // Wait a bit then check if it started successfully
            setTimeout(async () => {
                const started = await this.checkHttpServer();
                if (started) {
                    this.panel?.webview.postMessage({
                        command: 'notification',
                        type: 'success',
                        message: 'Server started successfully'
                    });
                } else {
                    this.panel?.webview.postMessage({
                        command: 'notification',
                        type: 'error',
                        message: 'Server failed to start. Check for port conflicts.'
                    });
                }
                this.updateStatus();
            }, 1500);

        } catch (error) {
            this.isServerRunning = false;
            this.panel?.webview.postMessage({
                command: 'notification',
                type: 'error',
                message: `Failed to start server: ${error}`
            });
        }
    }

    public async stopServer() {
        if (!this.serverProcess) {
            this.panel?.webview.postMessage({
                command: 'notification',
                type: 'warning',
                message: 'Server is not running'
            });
            return;
        }

        try {
            this.serverProcess.kill('SIGTERM');
            
            // Force kill after 5 seconds if not stopped
            setTimeout(() => {
                if (this.serverProcess) {
                    this.serverProcess.kill('SIGKILL');
                }
            }, 5000);

            this.panel?.webview.postMessage({
                command: 'notification',
                type: 'info',
                message: 'Stopping server...'
            });

        } catch (error) {
            this.panel?.webview.postMessage({
                command: 'notification',
                type: 'error',
                message: `Failed to stop server: ${error}`
            });
        }
    }

    public async restartServer() {
        this.panel?.webview.postMessage({
            command: 'notification',
            type: 'info',
            message: 'Restarting server...'
        });

        await this.stopServer();
        
        // Wait for server to stop
        setTimeout(async () => {
            await this.startServer();
        }, 2000);
    }

    public async testConnection() {
        this.panel?.webview.postMessage({
            command: 'testStart'
        });

        const startTime = Date.now();
        const httpOk = await this.checkHttpServer();
        const httpTime = Date.now() - startTime;

        const wsStartTime = Date.now();
        const wsOk = await this.checkWebSocketServer();
        const wsTime = Date.now() - wsStartTime;

        this.panel?.webview.postMessage({
            command: 'testResult',
            http: { ok: httpOk, latency: httpTime },
            websocket: { ok: wsOk, latency: wsTime }
        });
    }

    private getWebviewContent(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code to Figma Control Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #F5F0E8 0%, #ffffff 100%);
            padding: 20px;
            color: #222222;
        }

        .header {
            text-align: center;
            margin-bottom: 32px;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 600;
            color: #4B2C82;
            margin-bottom: 8px;
        }

        .header p {
            font-size: 14px;
            color: #666;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 12px rgba(75, 44, 130, 0.08);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(75, 44, 130, 0.12);
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .card-header .icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F5F0E8;
        }

        .card-header .icon svg {
            width: 20px;
            height: 20px;
        }

        .card-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #222;
        }

        .status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 12px;
        }

        .status .icon {
            width: 24px;
            height: 24px;
        }

        .status .label {
            flex: 1;
            font-size: 14px;
            color: #666;
        }

        .status .value {
            font-size: 14px;
            font-weight: 600;
        }

        .status.connected { background: #d4edda; }
        .status.connected .value { color: #28a745; }
        
        .status.connecting { background: #fff3cd; }
        .status.connecting .value { color: #ffc107; }
        
        .status.disconnected { background: #f8d7da; }
        .status.disconnected .value { color: #dc3545; }

        .button {
            width: 100%;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
            margin-top: 8px;
        }

        .button svg {
            width: 20px;
            height: 20px;
        }

        .button.primary {
            background: #4B2C82;
            color: white;
        }

        .button.primary:hover {
            background: #3a2264;
            transform: translateY(-1px);
        }

        .button.secondary {
            background: #f8f9fa;
            color: #4B2C82;
            border: 2px solid #4B2C82;
        }

        .button.secondary:hover {
            background: #4B2C82;
            color: white;
        }

        .button.danger {
            background: #dc3545;
            color: white;
        }

        .button.danger:hover {
            background: #c82333;
        }

        .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .button:disabled:hover {
            transform: none;
        }

        .latency {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .log-container {
            background: #1e1e1e;
            color: #d4d4d4;
            border-radius: 8px;
            padding: 16px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 16px;
        }

        .log-line {
            padding: 4px 0;
            border-bottom: 1px solid #333;
        }

        .log-line.error {
            color: #f48771;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
            z-index: 1000;
        }

        .notification.success { border-left: 4px solid #28a745; }
        .notification.error { border-left: 4px solid #dc3545; }
        .notification.warning { border-left: 4px solid #ffc107; }
        .notification.info { border-left: 4px solid #17a2b8; }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }

        .full-width {
            grid-column: 1 / -1;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Code to Figma Control Panel</h1>
        <p>Manage your bridge server and monitor connections</p>
    </div>

    <div class="grid">
        <!-- Server Status Card -->
        <div class="card">
            <div class="card-header">
                <div class="icon">
                    ${ICONS.server}
                </div>
                <h2>Server Status</h2>
            </div>

            <div class="status connecting" id="httpStatus">
                <div class="icon">${ICONS.spinner}</div>
                <span class="label">HTTP Server</span>
                <span class="value">Checking...</span>
            </div>

            <div class="status connecting" id="wsStatus">
                <div class="icon">${ICONS.spinner}</div>
                <span class="label">WebSocket Server</span>
                <span class="value">Checking...</span>
            </div>

            <button class="button primary" id="startBtn" onclick="sendCommand('startServer')">
                ${ICONS.playCircle}
                <span>Start Server</span>
            </button>

            <button class="button danger" id="stopBtn" onclick="sendCommand('stopServer')" disabled>
                ${ICONS.stopCircle}
                <span>Stop Server</span>
            </button>

            <button class="button secondary" id="restartBtn" onclick="sendCommand('restartServer')" disabled>
                ${ICONS.refreshCircle}
                <span>Restart Server</span>
            </button>
        </div>

        <!-- Connection Test Card -->
        <div class="card">
            <div class="card-header">
                <div class="icon">
                    ${ICONS.activity}
                </div>
                <h2>Connection Test</h2>
            </div>

            <div class="status connecting" id="testStatus">
                <div class="icon">${ICONS.link}</div>
                <span class="label">Status</span>
                <span class="value">Ready to test</span>
            </div>

            <div id="latencyInfo"></div>

            <button class="button primary" onclick="sendCommand('testConnection')">
                ${ICONS.zap}
                <span>Test Connection</span>
            </button>
        </div>

        <!-- Server Logs Card -->
        <div class="card full-width">
            <div class="card-header">
                <div class="icon">
                    ${ICONS.fileCode}
                </div>
                <h2>Server Logs</h2>
            </div>
            <div class="log-container" id="logs">
                <div class="log-line">Waiting for server to start...</div>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function sendCommand(command) {
            vscode.postMessage({ command });
        }

        // Request status update on load
        sendCommand('checkStatus');

        window.addEventListener('message', event => {
            const message = event.data;

            switch (message.command) {
                case 'statusUpdate':
                    updateServerStatus(message);
                    break;
                case 'notification':
                    showNotification(message.type, message.message);
                    break;
                case 'serverLog':
                    addLog(message.message, message.type);
                    break;
                case 'testStart':
                    document.getElementById('testStatus').className = 'status connecting';
                    document.getElementById('testStatus').querySelector('.value').textContent = 'Testing...';
                    break;
                case 'testResult':
                    updateTestResult(message);
                    break;
            }
        });

        function updateServerStatus(data) {
            const httpStatus = document.getElementById('httpStatus');
            const wsStatus = document.getElementById('wsStatus');
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            const restartBtn = document.getElementById('restartBtn');

            // Update HTTP status
            if (data.http) {
                httpStatus.className = 'status connected';
                httpStatus.querySelector('.icon').innerHTML = '${getColoredIcon('checkCircle', STATUS_COLORS.connected)}';
                httpStatus.querySelector('.value').textContent = 'Running';
            } else {
                httpStatus.className = 'status disconnected';
                httpStatus.querySelector('.icon').innerHTML = '${getColoredIcon('xCircle', STATUS_COLORS.disconnected)}';
                httpStatus.querySelector('.value').textContent = 'Offline';
            }

            // Update WebSocket status
            if (data.websocket) {
                wsStatus.className = 'status connected';
                wsStatus.querySelector('.icon').innerHTML = '${getColoredIcon('checkCircle', STATUS_COLORS.connected)}';
                wsStatus.querySelector('.value').textContent = 'Connected';
            } else {
                wsStatus.className = 'status disconnected';
                wsStatus.querySelector('.icon').innerHTML = '${getColoredIcon('xCircle', STATUS_COLORS.disconnected)}';
                wsStatus.querySelector('.value').textContent = 'Offline';
            }

            // Update buttons
            const isRunning = data.http || data.websocket;
            startBtn.disabled = isRunning;
            stopBtn.disabled = !isRunning;
            restartBtn.disabled = !isRunning;
        }

        function updateTestResult(data) {
            const testStatus = document.getElementById('testStatus');
            const latencyInfo = document.getElementById('latencyInfo');

            if (data.http.ok && data.websocket.ok) {
                testStatus.className = 'status connected';
                testStatus.querySelector('.icon').innerHTML = '${getColoredIcon('checkCircle', STATUS_COLORS.connected)}';
                testStatus.querySelector('.value').textContent = 'All systems operational';
                
                latencyInfo.innerHTML = \`
                    <div class="latency">HTTP: \${data.http.latency}ms</div>
                    <div class="latency">WebSocket: \${data.websocket.latency}ms</div>
                \`;
            } else {
                testStatus.className = 'status disconnected';
                testStatus.querySelector('.icon').innerHTML = '${getColoredIcon('xCircle', STATUS_COLORS.disconnected)}';
                testStatus.querySelector('.value').textContent = 'Connection failed';
                
                latencyInfo.innerHTML = \`
                    <div class="latency">HTTP: \${data.http.ok ? '✓' : '✗'}</div>
                    <div class="latency">WebSocket: \${data.websocket.ok ? '✓' : '✗'}</div>
                \`;
            }
        }

        function addLog(message, type = 'info') {
            const logs = document.getElementById('logs');
            const logLine = document.createElement('div');
            logLine.className = 'log-line' + (type === 'error' ? ' error' : '');
            logLine.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logs.appendChild(logLine);
            logs.scrollTop = logs.scrollHeight;

            // Keep only last 50 logs
            while (logs.children.length > 50) {
                logs.removeChild(logs.firstChild);
            }
        }

        function showNotification(type, message) {
            const notification = document.createElement('div');
            notification.className = \`notification \${type}\`;
            notification.innerHTML = \`
                <div class="icon">${ICONS.checkCircle}</div>
                <span>\${message}</span>
            \`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    </script>
</body>
</html>`;
    }

    public dispose() {
        if (this.serverProcess) {
            this.serverProcess.kill();
        }
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
        }
    }
}
