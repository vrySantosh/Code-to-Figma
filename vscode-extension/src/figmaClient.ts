import * as vscode from 'vscode';
import axios from 'axios';
import { ComponentSchema, FigmaAPIResponse } from './types';

export class FigmaClient {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async exportToFigma(schema: ComponentSchema): Promise<FigmaAPIResponse> {
        const config = vscode.workspace.getConfiguration('codeToFigma');
        const fileId = config.get<string>('figmaFileId');
        const accessToken = config.get<string>('figmaAccessToken');

        if (!fileId || !accessToken) {
            throw new Error('Figma credentials not configured. Please set figmaFileId and figmaAccessToken in settings.');
        }

        try {
            // First, try to communicate with the Figma plugin via WebSocket or HTTP
            const pluginEndpoint = await this.getPluginEndpoint();
            
            if (pluginEndpoint) {
                // Send directly to plugin
                const response = await axios.post(pluginEndpoint, {
                    type: 'export',
                    data: schema
                });

                return {
                    nodeId: response.data.nodeId,
                    success: true,
                    message: 'Exported successfully'
                };
            } else {
                // Fallback: Use Figma REST API to create nodes
                return await this.createNodeViaAPI(fileId, accessToken, schema);
            }
        } catch (error) {
            throw new Error(`Failed to export to Figma: ${error}`);
        }
    }

    async updateNode(nodeId: string, schema: ComponentSchema): Promise<FigmaAPIResponse> {
        const config = vscode.workspace.getConfiguration('codeToFigma');
        const accessToken = config.get<string>('figmaAccessToken');

        if (!accessToken) {
            throw new Error('Figma access token not configured');
        }

        try {
            const pluginEndpoint = await this.getPluginEndpoint();
            
            if (pluginEndpoint) {
                const response = await axios.post(pluginEndpoint, {
                    type: 'update',
                    nodeId,
                    data: schema
                });

                return {
                    nodeId: response.data.nodeId,
                    success: true,
                    message: 'Updated successfully'
                };
            } else {
                throw new Error('Plugin endpoint not available');
            }
        } catch (error) {
            throw new Error(`Failed to update Figma node: ${error}`);
        }
    }

    private async getPluginEndpoint(): Promise<string | null> {
        // Check if local server is running for plugin communication
        try {
            const response = await axios.get('http://localhost:3333/health', { timeout: 1000 });
            if (response.status === 200) {
                return 'http://localhost:3333/figma-plugin';
            }
        } catch {
            // Server not available
        }
        return null;
    }

    private async createNodeViaAPI(fileId: string, accessToken: string, schema: ComponentSchema): Promise<FigmaAPIResponse> {
        // This is a simplified version - in production, you'd need to:
        // 1. Get the file structure
        // 2. Find or create a page for imported components
        // 3. Create the node structure using Figma's API
        
        const headers = {
            'X-Figma-Token': accessToken,
            'Content-Type': 'application/json'
        };

        // For now, we'll create a simple frame
        try {
            // Get file info
            const fileResponse = await axios.get(
                `https://api.figma.com/v1/files/${fileId}`,
                { headers }
            );

            // Generate a unique node ID (Figma will assign the real one)
            const tempNodeId = `imported-${Date.now()}`;

            return {
                nodeId: tempNodeId,
                success: true,
                message: 'Component data prepared. Open Figma plugin to complete import.'
            };
        } catch (error) {
            throw new Error(`Figma API error: ${error}`);
        }
    }

    async startPluginBridge(): Promise<void> {
        // Start a local server to communicate with Figma plugin
        // This would be implemented with Express or similar
        vscode.window.showInformationMessage(
            'To enable seamless export, please run the Figma plugin bridge server.',
            'Start Server'
        ).then(async (selection) => {
            if (selection === 'Start Server') {
                const terminal = vscode.window.createTerminal('Figma Bridge');
                terminal.show();
                terminal.sendText('node figma-bridge-server.js');
            }
        });
    }
}
