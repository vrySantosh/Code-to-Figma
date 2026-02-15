# Code to Figma - VS Code Extension

## 🎉 Implementation Complete!

Your VS Code extension for Code to Figma has been successfully created with all requested features!

## ✅ What's Been Built

### Core Features

1. **✨ Component to JSON Converter**
   - Parses React, React Native, Vue, and HTML components
   - Extracts styles and component structure
   - Generates JSON schema compatible with Figma plugin
   - Located in: `src/parser.ts`

2. **🚀 Seamless Figma Communication**
   - Bridge server for real-time communication
   - WebSocket connection between VS Code and Figma
   - HTTP fallback for API operations
   - Located in: `figma-bridge-server.js`, `src/figmaClient.ts`

3. **🔄 Single-Click Export & Auto-Sync**
   - One-click export to Figma
   - Automatic sync on file save (when enabled)
   - Node ID tracking for updates
   - Sync state management
   - Located in: `src/syncManager.ts`

4. **🎨 User Interface**
   - Command Palette integration
   - Right-click context menu
   - Status bar button
   - Sidebar tree view for synced components
   - Located in: `src/extension.ts`, `src/treeProvider.ts`

### File Structure

```
vscode-extension/
├── src/
│   ├── extension.ts          # Main entry point with all commands
│   ├── parser.ts              # Component parser (React, Vue, HTML)
│   ├── figmaClient.ts         # Figma API & bridge communication
│   ├── syncManager.ts         # Sync tracking & management
│   ├── treeProvider.ts        # Sidebar tree view
│   └── types.ts               # TypeScript type definitions
│
├── examples/
│   ├── ProfileCard.tsx        # React Native example
│   ├── HeroSection.html       # HTML example
│   └── StatsCard.vue          # Vue example
│
├── .vscode/
│   ├── launch.json            # Debug configuration
│   └── tasks.json             # Build tasks
│
├── resources/
│   └── icon.svg               # Extension icon
│
├── figma-bridge-server.js     # Bridge server
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript config
├── README.md                  # Full documentation
├── QUICK_START.html           # Quick start guide
├── DEVELOPMENT.md             # Development guide
└── .gitignore                 # Git ignore
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm install
npm run bridge:install
```

### 2. Compile TypeScript

```bash
npm run compile
```

### 3. Start Bridge Server

In a separate terminal:
```bash
npm run bridge:start
```

You should see:
```
Figma Bridge Server running on http://localhost:3333
WebSocket server running on ws://localhost:3334
Waiting for Figma plugin to connect...
```

### 4. Launch Extension

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` (or Run → Start Debugging)
3. A new VS Code window will open with the extension loaded

### 5. Test It Out

1. Open an example file: `examples/ProfileCard.tsx`
2. Right-click anywhere in the file
3. Select "Code to Figma: Convert Component to JSON"
4. Or try "Code to Figma: Export to Figma"

## 📚 Available Commands

| Command | Description | How to Use |
|---------|-------------|------------|
| **Convert Component to JSON** | Parse component and save as JSON | Right-click → "Code to Figma: Convert Component to JSON" |
| **Export to Figma** | Send component to Figma directly | Right-click → "Code to Figma: Export to Figma" or click status bar button |
| **Sync with Figma** | Update existing Figma node | Command Palette → "Code to Figma: Sync with Figma" |
| **Toggle Auto-Sync** | Enable/disable automatic syncing | Command Palette → "Code to Figma: Toggle Auto-Sync" |

## 🔧 Configuration

Open VS Code Settings (`Cmd/Ctrl + ,`) and search for "Code to Figma":

```json
{
  "codeToFigma.figmaFileId": "YOUR_FIGMA_FILE_ID",
  "codeToFigma.figmaAccessToken": "YOUR_FIGMA_TOKEN",
  "codeToFigma.autoSync": false,
  "codeToFigma.outputFolder": "./figma-exports"
}
```

### Get Figma Credentials

1. **File ID**: From your Figma URL
   ```
   https://www.figma.com/file/ABC123XYZ/My-File
                              ^^^ This part
   ```

2. **Access Token**: 
   - Go to Figma Settings → Personal Access Tokens
   - Generate new token
   - Copy and paste into VS Code settings

## 🎯 How It Works

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                   VS Code Extension                   │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Parser    │  │ FigmaClient  │  │ SyncManager│ │
│  │ (Parse Code)│  │ (API Calls)  │  │ (Track IDs)│ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└───────────────────────┬──────────────────────────────┘
                        │
                        │ HTTP POST
                        ▼
┌──────────────────────────────────────────────────────┐
│              Bridge Server (Express + WS)            │
│              localhost:3333 / localhost:3334          │
└───────────────────────┬──────────────────────────────┘
                        │
                        │ WebSocket
                        ▼
┌──────────────────────────────────────────────────────┐
│                  Figma Plugin (ui.html)              │
│                   WebSocket Client                    │
└───────────────────────┬──────────────────────────────┘
                        │
                        │ postMessage
                        ▼
┌──────────────────────────────────────────────────────┐
│               Figma Plugin Code (code.ts)            │
│              Creates nodes in Figma file              │
└──────────────────────────────────────────────────────┘
```

### Data Flow

1. **User selects component** in VS Code
2. **Parser extracts** structure and styles → JSON schema
3. **VS Code sends** to bridge server via HTTP
4. **Bridge forwards** to Figma plugin via WebSocket
5. **Figma plugin** receives and creates nodes
6. **Response flows back** with Node ID
7. **Sync Manager** stores mapping for future updates

## 🔄 Auto-Sync Feature

When enabled, the extension automatically updates Figma whenever you save a file that contains a synced component:

1. Enable: Command Palette → "Code to Figma: Toggle Auto-Sync"
2. Edit a synced component file
3. Save the file (`Cmd/Ctrl + S`)
4. Changes automatically sync to Figma!

## 📁 Sidebar Tree View

Click the "Code to Figma" icon in the Activity Bar to see:

- **All synced components**
- **Figma Node IDs**
- **Last sync timestamps**
- **Quick file navigation** (click to open)

## 🎨 Supported Component Types

### React Native
- View, Text, Image, TextInput
- ScrollView, FlatList, SafeAreaView
- TouchableOpacity, Pressable, Button
- All React Native style properties

### Web (HTML/React)
- div, span, p, h1-h6
- button, input, textarea, label
- section, header, footer, nav, article
- All CSS properties

### Vue
- Template-based components
- Scoped styles
- Component props

## 🐛 Troubleshooting

### Extension Not Loading
```bash
npm run compile
# Then reload VS Code window: Cmd/Ctrl + Shift + P → "Reload Window"
```

### Bridge Server Won't Start
```bash
# Check if port is in use
lsof -i :3333
# Kill process if needed
kill -9 <PID>
```

### Figma Plugin Shows "Disconnected"
1. Make sure bridge server is running
2. Restart Figma plugin
3. Check firewall settings

### Parse Errors
1. Ensure code is syntactically valid
2. Component must be exported
3. Try simplifying complex components first

## 📖 Documentation

- **[README.md](README.md)** - Full feature documentation
- **[QUICK_START.html](QUICK_START.html)** - Interactive quick start guide
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development and contribution guide

## 🎓 Examples

Try the included examples:

1. **ProfileCard.tsx** - React Native component with images and buttons
2. **HeroSection.html** - HTML landing page section
3. **StatsCard.vue** - Vue component with scoped styles

## 🚢 Next Steps

### For Local Use
1. Compile and run with `F5`
2. Start bridge server
3. Open Figma plugin
4. Start converting components!

### For Distribution
1. Update publisher info in `package.json`
2. Test thoroughly
3. Package: `vsce package`
4. Publish: `vsce publish`

## 🎉 Features Delivered

✅ Component to JSON converter with multi-framework support  
✅ Bridge server for real-time communication  
✅ One-click export to Figma  
✅ Auto-sync on file save  
✅ Node ID tracking and management  
✅ Sidebar tree view for synced components  
✅ Status bar integration  
✅ Context menu commands  
✅ Command Palette commands  
✅ Full TypeScript implementation  
✅ Complete documentation  
✅ Example components  
✅ Debug configuration  

## 💡 Tips

- Use auto-sync for rapid iteration
- Check the Output panel for logs
- Start with simple components first
- Keep bridge server running
- Store credentials in VS Code settings securely

## 🤝 Contributing

Feel free to extend and improve:
- Add support for more frameworks
- Enhance parsing capabilities
- Improve error handling
- Add more configuration options

---

**🎊 Your extension is ready to use! Press F5 to start!**
