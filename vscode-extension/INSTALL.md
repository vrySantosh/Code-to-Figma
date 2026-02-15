# Installing Code to Figma Extension

## ✅ Extension Package Created

**File:** `code-to-figma-vscode-1.0.0.vsix`  
**Size:** 1.8 MB  
**Location:** `/Users/Santosh/Code to Figma/vscode-extension/`

---

## 📦 Installation Methods

### Method 1: Direct Installation (Recommended)

The .vsix file should have opened in VS Code automatically. If you see an install prompt:

1. Click **"Install"** button
2. Wait for installation to complete
3. Click **"Reload Window"** or restart VS Code
4. Verify: Press `Cmd+Shift+P` and type "Code to Figma"

### Method 2: Manual Installation via VS Code UI

1. Open **Visual Studio Code**
2. Press `Cmd+Shift+X` to open Extensions panel
3. Click the **`...`** (three dots) menu at the top
4. Select **"Install from VSIX..."**
5. Navigate to: `/Users/Santosh/Code to Figma/vscode-extension/`
6. Select: `code-to-figma-vscode-1.0.0.vsix`
7. Click **"Install"**
8. Restart VS Code when prompted

### Method 3: Using Terminal (if `code` command is installed)

Install the Shell Command first:
- Open VS Code
- Press `Cmd+Shift+P`
- Type: "Shell Command: Install 'code' command in PATH"
- Run it

Then in terminal:
```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
code --install-extension code-to-figma-vscode-1.0.0.vsix
```

---

## ✅ Verify Installation

After installing:

1. **Check Extensions List:**
   - Press `Cmd+Shift+X`
   - Search for "Code to Figma"
   - Should show as installed

2. **Check Commands:**
   - Press `Cmd+Shift+P`
   - Type "Code to Figma"
   - Should see:
     - `Code to Figma: Open Control Panel`
     - `Code to Figma: Start Bridge Server`
     - `Code to Figma: Stop Bridge Server`
     - `Code to Figma: Export Component`

3. **Check Sidebar:**
   - Look for "Code to Figma" icon in Activity Bar (left sidebar)
   - Click it to see the tree view

---

## 🚀 First Time Setup

Once installed:

1. **Open Control Panel:**
   - Press `Cmd+Shift+P`
   - Run: `Code to Figma: Open Control Panel`

2. **Start Bridge Server:**
   - Click "Start Server" button in Control Panel
   - Wait for status to show "Running" (green)
   - Verify ports 3333 and 3334 are active

3. **Configure Figma (if needed):**
   - Go to VS Code Settings (`Cmd+,`)
   - Search for "Code to Figma"
   - Set your Figma File ID if using direct API

---

## 🔧 Troubleshooting

### Extension doesn't appear after installation

**Solution:**
- Restart VS Code completely
- Check Extensions panel (`Cmd+Shift+X`) for "Code to Figma"
- If still missing, try reinstalling

### Commands not showing up

**Solution:**
1. Press `Cmd+Shift+P`
2. Type: "Developer: Reload Window"
3. Check commands again

### Extension installed but not activated

**Solution:**
- Open any `.js`, `.jsx`, `.ts`, `.tsx` file
- Extension activates on startup or when working with code files

### Bridge server won't start from Control Panel

**Solution:**
```bash
# Start manually to check for errors
cd "/Users/Santosh/Code to Figma/vscode-extension"
node figma-bridge-server.js
```

Check console for error messages.

---

## 🎯 Next Steps

After successful installation:

1. **Import Figma Plugin:**
   - Open Figma Desktop app
   - Go to Plugins → Development → Import plugin from manifest
   - Select: `/Users/Santosh/Code to Figma/manifest.json`

2. **Test the Workflow:**
   - Follow steps in [TESTING_WORKFLOW.md](../TESTING_WORKFLOW.md)
   - Try exporting a sample component

3. **Use in Production:**
   - Open any React Native or HTML project
   - Select component code
   - Run: `Code to Figma: Export Component`
   - Check Figma plugin for imported design

---

## 📋 Extension Info

- **Name:** Code to Figma
- **Publisher:** code-to-figma
- **Version:** 1.0.0
- **License:** MIT
- **Description:** Convert UI components to Figma designs seamlessly with one-click server management

---

## 🔄 Updating the Extension

To update after making changes:

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"

# 1. Make your code changes
# 2. Compile
npm run compile

# 3. Update version in package.json (optional)
# 4. Re-package
npx @vscode/vsce package

# 5. Uninstall old version
# Extensions panel → Code to Figma → Uninstall

# 6. Install new version
# Follow Method 2 above to install the new .vsix file
```

---

## 📦 Package Contents

The .vsix includes:
- ✅ Compiled extension code (dist/)
- ✅ Bridge server (figma-bridge-server.js)
- ✅ All dependencies
- ✅ Resources and icons
- ✅ Documentation
- ✅ Examples

Total: 1081 files, 1.8 MB

---

## 🆘 Need Help?

If installation fails:
1. Check VS Code version (requires ≥1.85.0)
2. Check Output panel: View → Output → Select "Extensions"
3. Run verification: `./verify-setup.sh`
4. Check [TESTING_WORKFLOW.md](../TESTING_WORKFLOW.md) troubleshooting section

For other issues, see [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)
