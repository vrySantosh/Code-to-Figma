const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const PORT = 3333;

// Store active connections
const connections = new Map();
let figmaPluginWs = null;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Figma Bridge Server is running' });
});

// Endpoint to receive data from VS Code extension
app.post('/figma-plugin', async (req, res) => {
    const { type, data, nodeId } = req.body;

    console.log(`Received ${type} request from VS Code`);

    if (!figmaPluginWs || figmaPluginWs.readyState !== WebSocket.OPEN) {
        return res.status(503).json({
            success: false,
            message: 'Figma plugin not connected. Please open the plugin in Figma.'
        });
    }

    try {
        // Forward to Figma plugin via WebSocket
        const messageId = Date.now().toString();
        
        figmaPluginWs.send(JSON.stringify({
            id: messageId,
            type,
            data,
            nodeId
        }));

        // Wait for response from Figma plugin
        const response = await waitForResponse(messageId, 10000);
        
        res.json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WebSocket server for Figma plugin connection
const wss = new WebSocket.Server({ port: 3334 });

wss.on('connection', (ws) => {
    console.log('Figma plugin connected');
    figmaPluginWs = ws;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received from Figma plugin:', data.type);

            // Handle response
            if (data.id && pendingRequests.has(data.id)) {
                const resolver = pendingRequests.get(data.id);
                resolver(data);
                pendingRequests.delete(data.id);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Figma plugin disconnected');
        figmaPluginWs = null;
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Track pending requests
const pendingRequests = new Map();

function waitForResponse(messageId, timeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            pendingRequests.delete(messageId);
            reject(new Error('Request timeout'));
        }, timeout);

        pendingRequests.set(messageId, (response) => {
            clearTimeout(timer);
            resolve(response);
        });
    });
}

app.listen(PORT, () => {
    console.log(`Figma Bridge Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:3334`);
    console.log('Waiting for Figma plugin to connect...');
});
