// Figma Plugin Bridge Client - connects to VS Code extension

let ws: WebSocket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function initializeBridge() {
    connectToVSCode();
}

function connectToVSCode() {
    try {
        ws = new WebSocket('ws://localhost:3334');

        ws.onopen = () => {
            console.log('Connected to VS Code bridge');
            isConnected = true;
            reconnectAttempts = 0;
            showConnectionStatus(true);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                handleVSCodeMessage(message);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from VS Code bridge');
            isConnected = false;
            showConnectionStatus(false);
            
            // Attempt to reconnect
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                setTimeout(() => connectToVSCode(), 2000 * reconnectAttempts);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('Failed to connect to VS Code bridge:', error);
    }
}

async function handleVSCodeMessage(message: any) {
    const { id, type, data, nodeId } = message;

    console.log('Received from VS Code:', type);

    try {
        let response;

        switch (type) {
            case 'export':
                response = await handleExport(data);
                break;
            case 'update':
                response = await handleUpdate(nodeId, data);
                break;
            case 'sync':
                response = await handleSync(nodeId);
                break;
            default:
                response = { success: false, message: `Unknown type: ${type}` };
        }

        // Send response back to VS Code
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                id,
                ...response
            }));
        }
    } catch (error) {
        // Send error response
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                id,
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            }));
        }
    }
}

async function handleExport(schema: any): Promise<any> {
    // Send message to plugin main thread
    parent.postMessage({
        pluginMessage: {
            type: 'import-from-vscode',
            data: schema
        }
    }, '*');

    // Wait for response from plugin
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            if (event.data.pluginMessage?.type === 'import-complete') {
                window.removeEventListener('message', handler);
                resolve({
                    success: true,
                    nodeId: event.data.pluginMessage.nodeId,
                    message: 'Component exported successfully'
                });
            }
        };
        window.addEventListener('message', handler);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve({
                success: false,
                message: 'Export timeout'
            });
        }, 10000);
    });
}

async function handleUpdate(nodeId: string, schema: any): Promise<any> {
    parent.postMessage({
        pluginMessage: {
            type: 'update-from-vscode',
            nodeId,
            data: schema
        }
    }, '*');

    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            if (event.data.pluginMessage?.type === 'update-complete') {
                window.removeEventListener('message', handler);
                resolve({
                    success: true,
                    nodeId: event.data.pluginMessage.nodeId,
                    message: 'Component updated successfully'
                });
            }
        };
        window.addEventListener('message', handler);
        
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve({
                success: false,
                message: 'Update timeout'
            });
        }, 10000);
    });
}

async function handleSync(nodeId: string): Promise<any> {
    // Request current node data from Figma
    parent.postMessage({
        pluginMessage: {
            type: 'get-node-data',
            nodeId
        }
    }, '*');

    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            if (event.data.pluginMessage?.type === 'node-data-response') {
                window.removeEventListener('message', handler);
                resolve({
                    success: true,
                    data: event.data.pluginMessage.data
                });
            }
        };
        window.addEventListener('message', handler);
        
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve({
                success: false,
                message: 'Sync timeout'
            });
        }, 5000);
    });
}

function showConnectionStatus(connected: boolean) {
    const statusElement = document.getElementById('vscode-status');
    if (statusElement) {
        statusElement.textContent = connected 
            ? '🟢 Connected to VS Code' 
            : '🔴 VS Code Disconnected';
        statusElement.style.color = connected ? '#00AA00' : '#FF0000';
    }
}

export function sendToVSCode(message: any) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn('Not connected to VS Code bridge');
    }
}

export function isVSCodeConnected(): boolean {
    return isConnected;
}
