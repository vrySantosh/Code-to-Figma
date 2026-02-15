import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SyncedNode, ComponentSchema } from './types';
import { FigmaClient } from './figmaClient';
import { ComponentParser } from './parser';

export class SyncManager {
    private context: vscode.ExtensionContext;
    private figmaClient: FigmaClient;
    private syncDataFile: string;
    private parser: ComponentParser;

    constructor(context: vscode.ExtensionContext, figmaClient: FigmaClient) {
        this.context = context;
        this.figmaClient = figmaClient;
        this.parser = new ComponentParser();
        
        // Store sync data in workspace storage
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            this.syncDataFile = path.join(workspaceFolder.uri.fsPath, '.vscode', 'code-to-figma-sync.json');
        } else {
            this.syncDataFile = path.join(context.globalStorageUri.fsPath, 'sync-data.json');
        }

        this.ensureSyncDataFile();
    }

    private ensureSyncDataFile() {
        const dir = path.dirname(this.syncDataFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.syncDataFile)) {
            fs.writeFileSync(this.syncDataFile, JSON.stringify({ syncedNodes: [] }, null, 2));
        }
    }

    async getSyncedNodes(): Promise<SyncedNode[]> {
        try {
            const data = fs.readFileSync(this.syncDataFile, 'utf-8');
            const parsed = JSON.parse(data);
            return parsed.syncedNodes || [];
        } catch {
            return [];
        }
    }

    async addSyncedNode(node: SyncedNode): Promise<void> {
        const nodes = await this.getSyncedNodes();
        
        // Check if node already exists (same file and component)
        const existingIndex = nodes.findIndex(
            n => n.filePath === node.filePath && n.componentName === node.componentName
        );

        if (existingIndex >= 0) {
            // Update existing node
            nodes[existingIndex] = node;
        } else {
            // Add new node
            nodes.push(node);
        }

        await this.saveSyncedNodes(nodes);
    }

    async removeSyncedNode(id: string): Promise<void> {
        const nodes = await this.getSyncedNodes();
        const filtered = nodes.filter(n => n.id !== id);
        await this.saveSyncedNodes(filtered);
    }

    private async saveSyncedNodes(nodes: SyncedNode[]): Promise<void> {
        fs.writeFileSync(
            this.syncDataFile,
            JSON.stringify({ syncedNodes: nodes }, null, 2)
        );
    }

    async syncFile(filePath: string): Promise<void> {
        const nodes = await this.getSyncedNodes();
        const nodesToSync = nodes.filter(n => n.filePath === filePath);

        if (nodesToSync.length === 0) {
            vscode.window.showWarningMessage('No synced components found in this file');
            return;
        }

        // Read the current file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const languageId = this.getLanguageIdFromFilePath(filePath);

        for (const node of nodesToSync) {
            try {
                // Parse the current component
                const schema = await this.parser.parseToSchema(fileContent, languageId);
                
                // Update in Figma
                await this.figmaClient.updateNode(node.figmaNodeId, schema);
                
                // Update sync data
                node.lastSync = new Date().toISOString();
                node.schema = schema;
                await this.addSyncedNode(node);

                vscode.window.showInformationMessage(
                    `Synced ${node.componentName} with Figma`
                );
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to sync ${node.componentName}: ${error}`
                );
            }
        }
    }

    async syncAll(): Promise<void> {
        const nodes = await this.getSyncedNodes();
        
        for (const node of nodes) {
            if (fs.existsSync(node.filePath)) {
                await this.syncFile(node.filePath);
            }
        }
    }

    async saveSchema(schema: ComponentSchema, outputFolder: string): Promise<string> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const outputDir = path.join(workspaceFolder.uri.fsPath, outputFolder);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = `${schema.component.name || 'component'}-${Date.now()}.json`;
        const filePath = path.join(outputDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
        
        return filePath;
    }

    private getLanguageIdFromFilePath(filePath: string): string {
        const ext = path.extname(filePath);
        const map: Record<string, string> = {
            '.tsx': 'typescriptreact',
            '.jsx': 'javascriptreact',
            '.ts': 'typescript',
            '.js': 'javascript',
            '.html': 'html',
            '.vue': 'vue'
        };
        return map[ext] || 'javascript';
    }
}
