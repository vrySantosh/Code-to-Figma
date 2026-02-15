# 🚀 Complete Setup Guide - VS Code Extension + Figma Plugin

## Overview

This guide will walk you through setting up the complete Code to Figma system with:
1. ✅ VS Code Extension (already compiled)
2. ✅ Figma Plugin (already compiled)
3. ✅ Bridge Server (dependencies installed)

Everything is ready to use! Just follow these steps.

---

## 📋 Prerequisites

- [x] VS Code installed
- [x] Figma desktop app or Figma.com access
- [x] Node.js v16+ (already installed)
- [x] All dependencies installed ✅
- [x] TypeScript compiled ✅

---

## 🎯 Quick Start (5 Minutes)

### Step 1️⃣: Configure Figma Credentials

1. **Get your Figma Access Token:**
   - Visit: https://www.figma.com/settings
   - Scroll to "Personal Access Tokens"
   - Click "Generate new token"
   - Give it a name like "Code to Figma"
   - Copy the token (save it somewhere safe)

2. **Get your Figma File ID:**
   - Open your Figma file
   - Look at the URL: `https://www.figma.com/file/ABC123XYZ/My-File`
   - Copy the part after `/file/` and before the next `/` (ABC123XYZ)

3. **Add to VS Code Settings:**
   - Open VS Code
   - Press `Cmd + ,` (Mac) or `Ctrl + ,` (Windows)
   - Search for "Code to Figma"
   - Set:
     - `Figma File ID`: Your file ID
     - `Figma Access Token`: Your token

   Or directly edit `settings.json`:
   ```json
   {
     "codeToFigma.figmaFileId": "YOUR_FILE_ID",
     "codeToFigma.figmaAccessToken": "YOUR_TOKEN",
     "codeToFigma.outputFolder": "./figma-exports",
     "codeToFigma.autoSync": false
   }
   ```

### Step 2️⃣: Start the Bridge Server

Open a terminal and run:

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm run bridge:start
```

**Expected Output:**
```
Figma Bridge Server running on http://localhost:3333
WebSocket server running on ws://localhost:3334
Waiting for Figma plugin to connect...
```

⚠️ **Keep this terminal window open!** The bridge server must run continuously.

### Step 3️⃣: Launch VS Code Extension

**Option A: Development Mode (Recommended for first try)**

1. Open VS Code
2. Open the folder: `/Users/Santosh/Code to Figma/vscode-extension`
3. Press `F5` or click Run → Start Debugging
4. A new VS Code window will open with the extension loaded

**Option B: Install Locally**

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm install -g vsce
vsce package
code --install-extension code-to-figma-vscode-1.0.0.vsix
```

### Step 4️⃣: Open Figma Plugin

1. Open Figma (desktop or web)
2. Open your design file
3. Go to: **Plugins** → **Development** → **Code to Figma**
4. The plugin UI will open
5. Look for **"🟢 VS Code Connected"** at the bottom right

✅ If you see the green status, you're connected!

---

## 💡 Test Your Setup

### Test 1: Convert a Component

1. In the Extension Development Host window, open:
   ```
   /Users/Santosh/Code to Figma/vscode-extension/examples/ProfileCard.tsx
   ```

2. Right-click anywhere in the file

3. Select: **"Code to Figma: Convert Component to JSON"**

4. A new JSON file should open showing the parsed component

### Test 2: Export to Figma

1. With `ProfileCard.tsx` still open

2. Right-click and select: **"Code to Figma: Export to Figma"**

3. Or click the **"Export to Figma"** button in the status bar (bottom right)

4. Watch the progress notification

5. Check your Figma file - the ProfileCard should appear!

### Test 3: Auto-Sync

1. Open Command Palette: `Cmd/Ctrl + Shift + P`

2. Run: **"Code to Figma: Toggle Auto-Sync"**

3. Make a change to ProfileCard.tsx (change text, colors, etc.)

4. Save the file: `Cmd/Ctrl + S`

5. Check Figma - it should update automatically!

---

## 🎨 Using the Extension

### Available Commands

Access via Command Palette (`Cmd/Ctrl + Shift + P`):

| Command | Description |
|---------|-------------|
| `Code to Figma: Convert Component to JSON` | Parse and save as JSON |
| `Code to Figma: Export to Figma` | Send directly to Figma |
| `Code to Figma: Sync with Figma` | Update existing nodes |
| `Code to Figma: Toggle Auto-Sync` | Enable/disable auto-sync |

### Context Menu

Right-click in any code file:
- Convert Component to JSON
- Export to Figma

### Status Bar

Look for the **"Export to Figma"** button in the bottom right status bar.

### Sidebar

Click the **"Code to Figma"** icon in the Activity Bar to see:
- List of synced components
- Figma Node IDs
- Last sync times
- Quick file navigation

---

## 📁 Project Structure

```
Code to Figma/
├── vscode-extension/              ← VS Code Extension
│   ├── src/                       ← TypeScript source
│   │   ├── extension.ts           ← Main entry point
│   │   ├── parser.ts              ← Component parser
│   │   ├── figmaClient.ts         ← Figma communication
│   │   ├── syncManager.ts         ← Sync management
│   │   └── treeProvider.ts        ← Sidebar UI
│   ├── dist/                      ← Compiled JavaScript ✅
│   ├── examples/                  ← Test components
│   ├── figma-bridge-server.js     ← Bridge server
│   └── package.json               ← Extension manifest
│
├── code.ts                        ← Figma plugin code ✅
├── code.js                        ← Compiled plugin ✅
├── ui.html                        ← Plugin UI (with bridge)
├── manifest.json                  ← Figma manifest
└── package.json                   ← Plugin package
```

---

## 🔄 Workflow

### Typical Usage

1. **Start bridge server** (terminal)
   ```bash
   npm run bridge:start
   ```

2. **Launch VS Code extension** (press F5)

3. **Open Figma plugin** (Plugins → Development → Code to Figma)

4. **Open/create a component file** (React, Vue, HTML)

5. **Export to Figma** (right-click → Export to Figma)

6. **Component appears in Figma!**

### With Auto-Sync

1. Enable auto-sync (Command Palette → Toggle Auto-Sync)

2. Edit your component

3. Save file (`Cmd/Ctrl + S`)

4. Figma updates automatically!

---

## 🐛 Troubleshooting

### Bridge Server Won't Start

**Error: Port already in use**
```bash
# Find what's using ports 3333 and 3334
lsof -i :3333
lsof -i :3334

# Kill the processes
kill -9 <PID>

# Try starting again
npm run bridge:start
```

**Error: Module not found**
```bash
npm run bridge:install
```

### Figma Plugin Shows "Disconnected"

1. ✅ Check bridge server is running
2. ✅ Restart the Figma plugin
3. ✅ Check firewall isn't blocking ports 3333/3334
4. ✅ Try reloading Figma

### Extension Not Loading in VS Code

1. Compile TypeScript:
   ```bash
   cd "/Users/Santosh/Code to Figma/vscode-extension"
   npm run compile
   ```

2. Restart Extension Host:
   - In Extension Development Host window
   - Press `Cmd/Ctrl + R`

3. Check for errors:
   - View → Output
   - Select "Code to Figma" from dropdown

### Component Not Parsing

1. ✅ Check code is valid JavaScript/TypeScript/HTML
2. ✅ Ensure component is exported
3. ✅ Try with example files first
4. ✅ Simplify complex components

### Figma Import Fails

1. ✅ Check Figma credentials in settings
2. ✅ Verify file ID is correct
3. ✅ Check access token has not expired
4. ✅ Open browser console (if using web Figma)

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [IMPLEMENTATION_SUMMARY.md](vscode-extension/IMPLEMENTATION_SUMMARY.md) | Complete implementation details |
| [README.md](vscode-extension/README.md) | Full feature documentation |
| [QUICK_START.html](vscode-extension/QUICK_START.html) | Interactive quick start guide |
| [DEVELOPMENT.md](vscode-extension/DEVELOPMENT.md) | Development guide |

---

## 🎓 Examples to Try

All located in `/Users/Santosh/Code to Figma/vscode-extension/examples/`:

1. **ProfileCard.tsx** - React Native component
   - Image, text, button
   - Flexbox layout
   - Shadow effects

2. **HeroSection.html** - HTML landing page
   - Multiple buttons
   - Responsive layout
   - Typography

3. **StatsCard.vue** - Vue component
   - Scoped styles
   - Props handling
   - Grid layout

---

## ⚙️ Advanced Configuration

### Change Bridge Server Ports

Edit `figma-bridge-server.js`:

```javascript
const PORT = 3333;        // HTTP server
// Change to available port

// Also update WebSocket port in:
const wss = new WebSocket.Server({ port: 3334 });
```

### Custom Output Folder

In VS Code settings:
```json
{
  "codeToFigma.outputFolder": "./my-custom-folder"
}
```

### Auto-Sync By Default

```json
{
  "codeToFigma.autoSync": true
}
```

---

## 🚀 Next Steps

### Try These Features

- [ ] Convert a simple React component
- [ ] Export to Figma
- [ ] View synced components in sidebar
- [ ] Enable auto-sync
- [ ] Make changes and watch them sync
- [ ] Try with HTML and Vue components

### Customize

- [ ] Add your own component examples
- [ ] Adjust bridge server ports if needed
- [ ] Set up workspace-specific settings
- [ ] Create custom keybindings

### Extend

- [ ] Add support for more component types
- [ ] Enhance parsing for complex layouts
- [ ] Add custom style mappings
- [ ] Create reusable templates

---

## 📞 Need Help?

### Check Logs

**VS Code Extension:**
- View → Output → "Code to Figma"

**Bridge Server:**
- Check terminal output

**Figma Plugin:**
- Open browser console (web Figma)
- Or check Figma desktop logs

### Common Issues Resolved

✅ All dependencies installed
✅ TypeScript compiled successfully
✅ Bridge server dependencies ready
✅ Figma plugin updated with bridge support
✅ Example components provided

---

## ✨ You're All Set!

Everything is compiled and ready to use. Just follow the Quick Start steps above!

**Commands Summary:**

```bash
# Terminal 1: Start bridge server
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm run bridge:start

# Terminal 2: Launch extension (or press F5 in VS Code)
cd "/Users/Santosh/Code to Figma/vscode-extension"
code .
# Then press F5
```

**In Figma:**
- Plugins → Development → Code to Figma

**Happy Coding! 🎉**
