import * as vscode from 'vscode';
import { SyncedNode } from './types';
import { SyncManager } from './syncManager';

export class ComponentsTreeProvider implements vscode.TreeDataProvider<ComponentItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ComponentItem | undefined | null | void> = new vscode.EventEmitter<ComponentItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ComponentItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ComponentItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ComponentItem): Promise<ComponentItem[]> {
        if (!element) {
            // Root level - show synced components
            const syncDataFile = this.getSyncDataFile();
            if (!syncDataFile) {
                return [];
            }

            const fs = require('fs');
            const path = require('path');
            
            try {
                const data = fs.readFileSync(syncDataFile, 'utf-8');
                const parsed = JSON.parse(data);
                const syncedNodes: SyncedNode[] = parsed.syncedNodes || [];

                return syncedNodes.map(node => new ComponentItem(
                    node.componentName,
                    node.figmaNodeId,
                    node.filePath,
                    node.lastSync,
                    vscode.TreeItemCollapsibleState.None
                ));
            } catch {
                return [];
            }
        }

        return [];
    }

    private getSyncDataFile(): string | null {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            const path = require('path');
            return path.join(workspaceFolder.uri.fsPath, '.vscode', 'code-to-figma-sync.json');
        }
        return null;
    }
}

class ComponentItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly figmaNodeId: string,
        public readonly filePath: string,
        public readonly lastSync: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        
        this.tooltip = `${this.label}\nNode ID: ${figmaNodeId}\nLast synced: ${new Date(lastSync).toLocaleString()}`;
        this.description = figmaNodeId.substring(0, 8);
        this.contextValue = 'component';
        
        this.command = {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [vscode.Uri.file(filePath)]
        };

        // Add icon
        this.iconPath = new vscode.ThemeIcon('symbol-class');
    }
}
