import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as http from 'http';

export class ServerTreeProvider implements vscode.TreeDataProvider<TreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined | null | void> = new vscode.EventEmitter<TreeNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined | null | void> = this._onDidChangeTreeData.event;

    private serverProcess: childProcess.ChildProcess | null = null;
    private serverStatus: 'stopped' | 'starting' | 'running' | 'error' = 'stopped';
    private httpStatus: boolean = false;
    private wsStatus: boolean = false;
    private logs: LogEntry[] = [];
    private maxLogs = 50;
    private statusCheckInterval: NodeJS.Timeout | null = null;

    constructor(private context: vscode.ExtensionContext) {
        this.startStatusMonitoring();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeNode): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        if (!element) {
            // Root level - show main sections
            return [
                new TreeNode(
                    'server-status',
                    `Server: ${this.getStatusText()}`,
                    this.getStatusIcon(),
                    vscode.TreeItemCollapsibleState.Expanded,
                    'status'
                ),
                new TreeNode(
                    'server-controls',
                    'Controls',
                    'tools',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'controls'
                ),
                new TreeNode(
                    'logs',
                    `Logs (${this.logs.length})`,
                    'output',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'logs'
                )
            ];
        }

        // Child nodes
        if (element.id === 'server-status') {
            return this.getStatusChildren();
        }

        if (element.id === 'server-controls') {
            return this.getControlChildren();
        }

        if (element.id === 'logs') {
            return this.getLogChildren();
        }

        return [];
    }

    private getStatusChildren(): TreeNode[] {
        const nodes: TreeNode[] = [];

        // HTTP Server Status
        nodes.push(new TreeNode(
            'http-status',
            `HTTP Server (3333): ${this.httpStatus ? 'Online' : 'Offline'}`,
            this.httpStatus ? 'pass-filled' : 'circle-slash',
            vscode.TreeItemCollapsibleState.None,
            'status-item',
            this.httpStatus ? 'Connected on port 3333' : 'Not running'
        ));

        // WebSocket Status
        nodes.push(new TreeNode(
            'ws-status',
            `WebSocket (3334): ${this.wsStatus ? 'Connected' : 'Offline'}`,
            this.wsStatus ? 'pass-filled' : 'circle-slash',
            vscode.TreeItemCollapsibleState.None,
            'status-item',
            this.wsStatus ? 'Connected on port 3334' : 'Not running'
        ));

        // System health
        if (this.serverStatus === 'running') {
            nodes.push(new TreeNode(
                'server-health',
                'System: Operational',
                'heart',
                vscode.TreeItemCollapsibleState.None,
                'status-item',
                'All systems running normally'
            ));
        } else if (this.serverStatus === 'error') {
            nodes.push(new TreeNode(
                'server-error',
                'System: Error',
                'error',
                vscode.TreeItemCollapsibleState.None,
                'status-item',
                'Check logs for details'
            ));
        }

        return nodes;
    }

    private getControlChildren(): TreeNode[] {
        const nodes: TreeNode[] = [];

        if (this.serverStatus === 'stopped' || this.serverStatus === 'error') {
            nodes.push(new TreeNode(
                'start-server',
                'Start Server',
                'play-circle',
                vscode.TreeItemCollapsibleState.None,
                'action',
                'Start the bridge server',
                {
                    command: 'codeToFigma.startServer',
                    title: 'Start Server'
                }
            ));
        }

        if (this.serverStatus === 'running') {
            nodes.push(new TreeNode(
                'stop-server',
                'Stop Server',
                'stop-circle',
                vscode.TreeItemCollapsibleState.None,
                'action',
                'Stop the bridge server',
                {
                    command: 'codeToFigma.stopServer',
                    title: 'Stop Server'
                }
            ));

            nodes.push(new TreeNode(
                'restart-server',
                'Restart Server',
                'refresh',
                vscode.TreeItemCollapsibleState.None,
                'action',
                'Restart the bridge server',
                {
                    command: 'codeToFigma.restartServer',
                    title: 'Restart Server'
                }
            ));
        }

        nodes.push(new TreeNode(
            'test-connection',
            'Test Connection',
            'debug-disconnect',
            vscode.TreeItemCollapsibleState.None,
            'action',
            'Test server connectivity',
            {
                command: 'codeToFigma.testConnection',
                title: 'Test Connection'
            }
        ));

        nodes.push(new TreeNode(
            'clear-logs',
            'Clear Logs',
            'clear-all',
            vscode.TreeItemCollapsibleState.None,
            'action',
            'Clear all log entries',
            {
                command: 'codeToFigma.clearLogs',
                title: 'Clear Logs'
            }
        ));

        return nodes;
    }

    private getLogChildren(): TreeNode[] {
        return this.logs.slice(-20).reverse().map((log, index) => 
            new TreeNode(
                `log-${index}`,
                `[${log.timestamp}] ${log.message}`,
                this.getLogIcon(log.level),
                vscode.TreeItemCollapsibleState.None,
                'log',
                log.message
            )
        );
    }

    private getStatusText(): string {
        switch (this.serverStatus) {
            case 'running': return 'Running';
            case 'starting': return 'Starting...';
            case 'error': return 'Error';
            default: return 'Stopped';
        }
    }

    private getStatusIcon(): string {
        switch (this.serverStatus) {
            case 'running': return 'check-all';
            case 'starting': return 'loading~spin';
            case 'error': return 'error';
            default: return 'circle-large-outline';
        }
    }

    private getLogIcon(level: 'info' | 'warn' | 'error'): string {
        switch (level) {
            case 'error': return 'error';
            case 'warn': return 'warning';
            default: return 'info';
        }
    }

    // Server Management
    async startServer(): Promise<void> {
        if (this.serverProcess) {
            vscode.window.showWarningMessage('Server is already running');
            return;
        }

        try {
            this.serverStatus = 'starting';
            this.addLog('info', 'Starting bridge server...');
            this.refresh();

            const serverPath = path.join(this.context.extensionPath, 'figma-bridge-server.js');
            
            this.serverProcess = childProcess.spawn('node', [serverPath], {
                cwd: this.context.extensionPath,
                stdio: 'pipe'
            });

            this.serverProcess.stdout?.on('data', (data) => {
                const message = data.toString().trim();
                this.addLog('info', message);
                this.refresh();
            });

            this.serverProcess.stderr?.on('data', (data) => {
                const message = data.toString().trim();
                this.addLog('error', message);
                this.refresh();
            });

            this.serverProcess.on('exit', (code) => {
                if (code !== 0 && code !== null) {
                    this.addLog('error', `Server exited with code ${code}`);
                    this.serverStatus = 'error';
                } else {
                    this.addLog('info', 'Server stopped');
                    this.serverStatus = 'stopped';
                }
                this.serverProcess = null;
                this.httpStatus = false;
                this.wsStatus = false;
                this.refresh();
            });

            // Wait for server to start
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if running
            await this.checkServerStatus();
            
            if (this.httpStatus && this.wsStatus) {
                this.serverStatus = 'running';
                this.addLog('info', '✓ Server started successfully on ports 3333/3334');
                vscode.window.showInformationMessage('Bridge server started successfully!');
            } else {
                this.serverStatus = 'error';
                this.addLog('error', 'Server started but ports are not responding');
                vscode.window.showErrorMessage('Server started but some services are offline');
            }

            this.refresh();
        } catch (error) {
            this.serverStatus = 'error';
            this.addLog('error', `Failed to start server: ${error}`);
            this.refresh();
            vscode.window.showErrorMessage(`Failed to start server: ${error}`);
        }
    }

    async stopServer(): Promise<void> {
        if (!this.serverProcess) {
            vscode.window.showWarningMessage('Server is not running');
            return;
        }

        this.addLog('info', 'Stopping server...');
        
        try {
            // Send SIGTERM for graceful shutdown
            this.serverProcess.kill('SIGTERM');
            
            // Set up fallback to force kill after 5 seconds
            const killTimeout = setTimeout(() => {
                if (this.serverProcess && !this.serverProcess.killed) {
                    this.addLog('warn', 'Server did not stop gracefully, forcing shutdown...');
                    this.serverProcess.kill('SIGKILL');
                }
            }, 5000);

            // Wait for the process to actually exit
            await new Promise<void>((resolve) => {
                if (!this.serverProcess) {
                    resolve();
                    return;
                }

                this.serverProcess.once('exit', () => {
                    clearTimeout(killTimeout);
                    resolve();
                });
            });

            this.serverProcess = null;
            this.serverStatus = 'stopped';
            this.httpStatus = false;
            this.wsStatus = false;
            this.refresh();
            this.addLog('info', 'Server stopped successfully');
            vscode.window.showInformationMessage('Bridge server stopped');
        } catch (error) {
            this.addLog('error', `Error stopping server: ${error}`);
            this.serverProcess = null;
            this.serverStatus = 'error';
            this.httpStatus = false;
            this.wsStatus = false;
            this.refresh();
            vscode.window.showErrorMessage(`Failed to stop server: ${error}`);
        }
    }

    async restartServer(): Promise<void> {
        this.addLog('info', 'Restarting server...');
        await this.stopServer();
        // Give extra time for ports to be released
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.startServer();
    }

    async testConnection(): Promise<void> {
        this.addLog('info', 'Testing connection...');
        this.refresh();

        await this.checkServerStatus();

        if (this.httpStatus && this.wsStatus) {
            this.addLog('info', '✓ Connection test passed');
            vscode.window.showInformationMessage('✓ All connections working!');
        } else {
            const issues: string[] = [];
            if (!this.httpStatus) { issues.push('HTTP (3333)'); }
            if (!this.wsStatus) { issues.push('WebSocket (3334)'); }
            this.addLog('warn', `Connection issues: ${issues.join(', ')}`);
            vscode.window.showWarningMessage(`Connection issues: ${issues.join(', ')}`);
        }

        this.refresh();
    }

    clearLogs(): void {
        this.logs = [];
        this.addLog('info', 'Logs cleared');
        this.refresh();
    }

    private addLog(level: 'info' | 'warn' | 'error', message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ timestamp, level, message });
        
        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    private async checkServerStatus(): Promise<void> {
        // Check HTTP
        try {
            await this.testPort(3333);
            this.httpStatus = true;
        } catch {
            this.httpStatus = false;
        }

        // Check WebSocket
        try {
            await this.testPort(3334);
            this.wsStatus = true;
        } catch {
            this.wsStatus = false;
        }
    }

    private testPort(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const req = http.get(`http://localhost:${port}`, (res) => {
                resolve();
            });

            req.on('error', reject);
            req.setTimeout(2000, () => {
                req.destroy();
                reject(new Error('Timeout'));
            });
        });
    }

    private startStatusMonitoring(): void {
        // Check status every 5 seconds if server is running
        this.statusCheckInterval = setInterval(async () => {
            if (this.serverStatus === 'running') {
                await this.checkServerStatus();
                this.refresh();
            }
        }, 5000);
    }

    dispose(): void {
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
        }
        if (this.serverProcess) {
            this.serverProcess.kill();
        }
    }
}

class TreeNode extends vscode.TreeItem {
    constructor(
        public readonly id: string,
        public readonly label: string,
        public readonly iconPath: string | vscode.ThemeIcon,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue?: string,
        public readonly tooltip?: string,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.id = id;
        this.tooltip = tooltip;
        this.iconPath = new vscode.ThemeIcon(iconPath as string);
        if (command) {
            this.command = command;
        }
    }
}

interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
}
