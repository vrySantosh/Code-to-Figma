# VS Code Extension for Code to Figma

This VS Code extension enables seamless conversion of UI components to Figma designs directly from your code editor.

## Features

### 🎨 Convert Components to JSON
- Parse React, React Native, Vue, and HTML components
- Automatically extract styles and structure
- Generate JSON schema compatible with the Figma plugin

### 🚀 One-Click Export to Figma
- Export selected components directly to Figma
- Automatic node creation with full styling
- Track exported components with Node IDs

### 🔄 Auto-Sync with Figma
- Real-time synchronization of code changes
- Update Figma designs when you save files
- Maintain component relationships

### 📁 Component Tree View
- View all synced components in the sidebar
- Quick navigation to component files
- See sync status and Figma Node IDs

## Installation

### Prerequisites
1. Install Node.js (v16 or higher)
2. Install the Figma desktop app or have access to Figma in browser
3. Install the "Code to Figma" Figma plugin

### Install the Extension

#### From Source
1. Clone the repository:
   ```bash
   cd "/Users/Santosh/Code to Figma/vscode-extension"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Open the extension folder in VS Code:
   ```bash
   code .
   ```

5. Press `F5` to launch a new VS Code window with the extension loaded

#### From VSIX (Coming Soon)
- Install from VS Code Marketplace (publishing in progress)
- Or download `.vsix` file and install manually

## Setup

### 1. Configure Figma Credentials

Open VS Code settings (`Cmd/Ctrl + ,`) and search for "Code to Figma":

- **Figma File ID**: Your Figma file ID (from the URL)
  ```
  https://www.figma.com/file/FILE_ID_HERE/...
  ```

- **Figma Access Token**: Generate from Figma Account Settings > Personal Access Tokens

### 2. Start the Bridge Server

The bridge server enables communication between VS Code and the Figma plugin:

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm install express cors ws body-parser
node figma-bridge-server.js
```

Keep this server running while using the extension.

### 3. Open Figma Plugin

1. Open your Figma file
2. Go to Plugins > Development > Code to Figma
3. The plugin will automatically connect to the bridge server

## Usage

### Convert Component to JSON

1. Select a component in your code (React, Vue, HTML, etc.)
2. Right-click and choose "Code to Figma: Convert Component to JSON"
3. Or use Command Palette: `Cmd/Ctrl + Shift + P` → "Code to Figma: Convert Component to JSON"
4. JSON will open in a new editor and save to your output folder

### Export to Figma

1. Select a component in your code
2. Right-click and choose "Code to Figma: Export to Figma"
3. Or click the "Export to Figma" button in the status bar
4. Component will be created in Figma and synced

### Enable Auto-Sync

1. Use Command Palette: `Cmd/Ctrl + Shift + P`
2. Run "Code to Figma: Toggle Auto-Sync"
3. Now your changes will sync to Figma automatically on save

### View Synced Components

1. Open the Code to Figma sidebar (Activity Bar icon)
2. See all synced components
3. Click on a component to open its file

## Supported Languages

- **React/React Native**: `.jsx`, `.tsx`, `.js`, `.ts`
- **Vue**: `.vue` files
- **HTML**: `.html` files
- **Angular**: Coming soon

## Component Support

### React Native
- View, Text, Image, ScrollView
- TextInput, Button, TouchableOpacity
- FlatList, SafeAreaView
- All styling properties

### Web (HTML/React)
- div, span, p, h1-h6
- button, input, textarea
- section, header, footer, nav
- All CSS properties

## Configuration

### Available Settings

```json
{
  "codeToFigma.figmaFileId": "",
  "codeToFigma.figmaAccessToken": "",
  "codeToFigma.autoSync": false,
  "codeToFigma.outputFolder": "./figma-exports"
}
```

### Bridge Server Port

Default: `http://localhost:3333` (HTTP) and `ws://localhost:3334` (WebSocket)

To change, edit `figma-bridge-server.js`:
```javascript
const PORT = 3333; // Change this
const WS_PORT = 3334; // And this
```

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| Convert Component to JSON | Parse and export component | - |
| Export to Figma | Create in Figma directly | - |
| Sync with Figma | Update existing node | - |
| Toggle Auto-Sync | Enable/disable auto-sync | - |

## Troubleshooting

### Extension Not Working

1. Check that TypeScript is compiled: `npm run compile`
2. Reload VS Code window: `Cmd/Ctrl + Shift + P` → "Reload Window"
3. Check Output panel: View → Output → "Code to Figma"

### Bridge Server Connection Failed

1. Verify server is running: `http://localhost:3333/health` should return `{"status":"ok"}`
2. Check firewall settings
3. Restart the bridge server

### Figma Plugin Not Connecting

1. Make sure bridge server is running first
2. Restart the Figma plugin
3. Check browser console for WebSocket errors

### Parse Errors

1. Ensure code is valid JavaScript/TypeScript/HTML
2. Check that all dependencies are imported
3. Try simplifying the component

## Development

### Build from Source

```bash
cd vscode-extension
npm install
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Debug

1. Open `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Set breakpoints in TypeScript files

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/code-to-figma)
- **Docs**: Check the `docs/` folder
- **Email**: support@codetofigma.dev

## Roadmap

- [ ] Publish to VS Code Marketplace
- [ ] Support for Angular components
- [ ] Support for Svelte components
- [ ] Bidirectional sync (Figma → Code)
- [ ] Component library management
- [ ] Design tokens extraction
- [ ] Batch export multiple components
- [ ] Custom style mapping rules
- [ ] Templates and presets
