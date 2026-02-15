import * as vscode from 'vscode';
import { ComponentParser } from './parser';
import { FigmaClient } from './figmaClient';
import { SyncManager } from './syncManager';
import { ComponentsTreeProvider } from './treeProvider';
import { ControlPanelProvider } from './controlPanel';

let controlPanel: ControlPanelProvider;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Code to Figma extension is now active!');

    const parser = new ComponentParser();
    const figmaClient = new FigmaClient(context);
    const syncManager = new SyncManager(context, figmaClient);
    const componentsTreeProvider = new ComponentsTreeProvider(context);
    controlPanel = new ControlPanelProvider(context);

    // Register tree view providers
    vscode.window.registerTreeDataProvider('codeToFigmaComponents', componentsTreeProvider);
    
    // Command: Open Control Panel
    const openControlPanel = vscode.commands.registerCommand('codeToFigma.openControlPanel', () => {
        controlPanel.show();
    });

    // Command: Start Server
    const startServer = vscode.commands.registerCommand('codeToFigma.startServer', async () => {
        await controlPanel.startServer();
    });

    // Command: Stop Server
    const stopServer = vscode.commands.registerCommand('codeToFigma.stopServer', async () => {
        await controlPanel.stopServer();
    });

    // Command: Test Connection
    const testConnection = vscode.commands.registerCommand('codeToFigma.testConnection', async () => {
        controlPanel.show();
        setTimeout(() => controlPanel.testConnection(), 500);
    });
    
    // Command: Convert Component to JSON
    const convertToJSON = vscode.commands.registerCommand('codeToFigma.convertToJSON', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

        try {
            const schema = await parser.parseToSchema(text, editor.document.languageId);
            
            // Show JSON in new editor
            const doc = await vscode.workspace.openTextDocument({
                content: JSON.stringify(schema, null, 2),
                language: 'json'
            });
            await vscode.window.showTextDocument(doc);

            // Save to output folder
            const config = vscode.workspace.getConfiguration('codeToFigma');
            const outputFolder = config.get<string>('outputFolder', './figma-exports');
            await syncManager.saveSchema(schema, outputFolder);

            vscode.window.showInformationMessage('Component converted to JSON successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Conversion failed: ${error}`);
        }
    });

    // Command: Export to Figma
    const exportToFigma = vscode.commands.registerCommand('codeToFigma.exportToFigma', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

        try {
            // Parse component
            const schema = await parser.parseToSchema(text, editor.document.languageId);
            
            // Export to Figma
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Exporting to Figma...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 30, message: "Converting component..." });
                
                const result = await figmaClient.exportToFigma(schema);
                
                progress.report({ increment: 70, message: "Creating Figma nodes..." });
                
                if (result.success && result.nodeId) {
                    // Save sync information
                    await syncManager.addSyncedNode({
                        id: Date.now().toString(),
                        figmaNodeId: result.nodeId,
                        filePath: editor.document.uri.fsPath,
                        componentName: schema.component.name || 'Component',
                        lastSync: new Date().toISOString(),
                        schema
                    });

                    vscode.window.showInformationMessage(
                        `Exported to Figma successfully! Node ID: ${result.nodeId}`,
                        'Open in Figma'
                    ).then(selection => {
                        if (selection === 'Open in Figma') {
                            const fileId = vscode.workspace.getConfiguration('codeToFigma').get<string>('figmaFileId');
                            if (fileId) {
                                vscode.env.openExternal(vscode.Uri.parse(
                                    `https://www.figma.com/file/${fileId}?node-id=${result.nodeId}`
                                ));
                            }
                        }
                    });

                    componentsTreeProvider.refresh();
                } else {
                    throw new Error(result.message || 'Export failed');
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Export failed: ${error}`);
        }
    });

    // Command: Sync with Figma
    const syncWithFigma = vscode.commands.registerCommand('codeToFigma.syncWithFigma', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        try {
            await syncManager.syncFile(editor.document.uri.fsPath);
            vscode.window.showInformationMessage('Synced with Figma successfully!');
            componentsTreeProvider.refresh();
        } catch (error) {
            vscode.window.showErrorMessage(`Sync failed: ${error}`);
        }
    });

    // Command: Toggle Auto-sync
    const autoSync = vscode.commands.registerCommand('codeToFigma.autoSync', async () => {
        const config = vscode.workspace.getConfiguration('codeToFigma');
        const currentValue = config.get<boolean>('autoSync', false);
        await config.update('autoSync', !currentValue, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(
            `Auto-sync ${!currentValue ? 'enabled' : 'disabled'}`
        );
    });

    // Watch for file changes if auto-sync is enabled
    const fileWatcher = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('codeToFigma');
        const autoSyncEnabled = config.get<boolean>('autoSync', false);
        
        if (autoSyncEnabled) {
            await syncManager.syncFile(document.uri.fsPath);
        }
    });

    // Enhanced status bar with connection status
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'codeToFigma.openControlPanel';
    updateStatusBar('disconnected');
    statusBarItem.show();

    // Check connection status every 10 seconds
    const statusInterval = setInterval(async () => {
        try {
            const http = require('http');
            const req = http.get('http://localhost:3333/health', { timeout: 1000 }, (res: any) => {
                updateStatusBar(res.statusCode === 200 ? 'connected' : 'disconnected');
            });
            req.on('error', () => updateStatusBar('disconnected'));
            req.on('timeout', () => {
                req.destroy();
                updateStatusBar('disconnected');
            });
        } catch {
            updateStatusBar('disconnected');
        }
    }, 10000);

    // Auto-start server if enabled
    const config = vscode.workspace.getConfiguration('codeToFigma');
    if (config.get<boolean>('autoStartServer', false)) {
        controlPanel.startServer();
    }

    context.subscriptions.push(
        openControlPanel,
        startServer,
        stopServer,
        testConnection,
        convertToJSON,
        exportToFigma,
        syncWithFigma,
        autoSync,
        fileWatcher,
        statusBarItem,
        { dispose: () => clearInterval(statusInterval) },
        { dispose: () => controlPanel.dispose() }
    );
}

function updateStatusBar(status: 'connected' | 'connecting' | 'disconnected') {
    if (!statusBarItem) return;

    switch (status) {
        case 'connected':
            statusBarItem.text = '$(check) Figma: Connected';
            statusBarItem.tooltip = 'Bridge server is running. Click to open control panel.';
            statusBarItem.backgroundColor = undefined;
            break;
        case 'connecting':
            statusBarItem.text = '$(loading~spin) Figma: Connecting...';
            statusBarItem.tooltip = 'Connecting to bridge server...';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            break;
        case 'disconnected':
            statusBarItem.text = '$(error) Figma: Disconnected';
            statusBarItem.tooltip = 'Bridge server not running. Click to open control panel and start server.';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            break;
    }
}

export function deactivate() {
    console.log('Code to Figma extension deactivated');
    if (controlPanel) {
        controlPanel.dispose();
    }
}
