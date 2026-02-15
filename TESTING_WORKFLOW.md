# Code to Figma - Testing Workflow

## ✅ Fixes Completed

All critical errors have been resolved:

1. **Fixed JavaScript syntax error in ui.html** - Missing closing parenthesis (line 699)
2. **Removed duplicate `showVSCodeStatus()` function** - Kept detailed version, removed simple version
3. **Fixed ESLint violation in controlPanel.ts** - Changed `child_process` to `childProcess`
4. **Corrected dependency versions** in package.json files:
   - body-parser: 2.2.2 → 1.20.2
   - express: 5.2.1 → 4.18.2 (stable)
   - cors: 2.8.6 → 2.8.5
   - ws: 8.19.0 → 8.18.0
   - typescript: 5.9.2 → 5.3.3
5. **Cleaned up obsolete files** - Moved to `archive/` folder
6. **Both components compiled successfully** - No errors

---

## 🧪 Testing Guide

### Step 1: Verify Installation

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"

# Verify bridge server exists
ls -lh figma-bridge-server.js

# Verify compiled extension exists
ls -lh dist/extension.js

# Check for compilation errors
npm run compile
```

Expected: No TypeScript errors, dist/ folder contains .js files

---

### Step 2: Test Bridge Server Standalone

```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
node figma-bridge-server.js
```

**Expected output:**
```
Bridge server listening on port 3333
WebSocket server listening on port 3334
```

**What to verify:**
- No errors or crashes
- Both port 3333 (HTTP) and 3334 (WebSocket) are listening
- Press Ctrl+C to stop when verified

---

### Step 3: Test VS Code Extension

1. **Open Extension Development Host:**
   - Open `/Users/Santosh/Code to Figma/vscode-extension` folder in VS Code
   - Press `F5` to launch Extension Development Host
   - A new VS Code window will open with the extension loaded

2. **Verify Extension Activation:**
   - Check **Debug Console** (View → Debug Console) in the original window
   - Look for: "Code to Figma extension activated"
   - No errors should appear

3. **Test Commands:**
   - Press `Cmd+Shift+P` to open Command Palette
   - Type "Code to Figma"
   - Verify these commands appear:
     - `Code to Figma: Open Control Panel`
     - `Code to Figma: Start Bridge Server`
     - `Code to Figma: Stop Bridge Server`
     - `Code to Figma: Export Component`

4. **Test Control Panel:**
   - Run `Code to Figma: Open Control Panel`
   - A webview panel should open showing server status
   - Click "Start Server" button
   - Status should change to "Running" (green)
   - Verify ports 3333 and 3334 are shown as active

---

### Step 4: Test Figma Plugin

1. **Import Plugin to Figma:**
   - Open **Figma Desktop** app (not browser - required for local plugins)
   - Go to **Plugins** → **Development** → **Import plugin from manifest**
   - Navigate to `/Users/Santosh/Code to Figma/`
   - Select `manifest.json`

2. **Run Plugin:**
   - In Figma, go to **Plugins** → **Development** → **Code to Figma**
   - Plugin UI should open without errors

3. **Verify UI Elements:**
   - Large textarea for JSON input visible
   - Device selection dropdown (iPhone 14 Pro, iPad, Custom, etc.)
   - "Import to Figma" button at bottom
   - Footer shows "Code to Figma v1.2"

4. **Check Console (Important):**
   - In Figma, go to **Plugins** → **Development** → **Open Console**
   - Look for JavaScript errors (should be none)
   - Verify WebSocket connection attempts show in console

---

### Step 5: Test End-to-End Workflow

#### Prerequisites:
- VS Code Extension Development Host is running (F5)
- Bridge Server is started via Control Panel
- Figma Plugin is open

#### Test with Sample Component:

1. **In Extension Development Host VS Code:**
   - Create a test file: `test-component.jsx`
   - Paste this sample React Native component:
   ```jsx
   const SignInScreen = () => {
     return (
       <View style={{
         flex: 1,
         backgroundColor: '#ffffff',
         padding: 20,
         alignItems: 'center',
         justifyContent: 'center'
       }}>
         <Text style={{
           fontSize: 24,
           fontWeight: 'bold',
           color: '#000000',
           marginBottom: 20
         }}>
           Welcome Back
         </Text>
         <TextInput 
           placeholder="Email"
           style={{
             width: 300,
             height: 50,
             borderWidth: 1,
             borderColor: '#cccccc',
             borderRadius: 8,
             paddingHorizontal: 15,
             marginBottom: 10
           }}
         />
         <View style={{
           width: 300,
           height: 50,
           backgroundColor: '#007AFF',
           borderRadius: 8,
           alignItems: 'center',
           justifyContent: 'center'
         }}>
           <Text style={{
             color: '#ffffff',
             fontSize: 16,
             fontWeight: '600'
           }}>
             Sign In
           </Text>
         </View>
       </View>
     );
   };
   ```

2. **Export to Figma:**
   - Select the component code
   - Press `Cmd+Shift+P`
   - Run `Code to Figma: Export Component`
   - Check **Output** panel (View → Output, select "Code to Figma")

3. **In Figma Plugin:**
   - The JSON should appear automatically (if WebSocket connected)
   - OR: Manually paste JSON from `/Users/Santosh/Code to Figma/examples/simple-component.json`
   - Click "Import to Figma"

4. **Expected Results:**
   - Component appears on Figma canvas
   - Layout matches the code structure
   - Text is editable
   - Colors, fonts, and spacing are accurate
   - Auto-layout is applied to View components

---

### Step 6: Connection Status Verification

**In Figma Plugin UI Header:**

You should see one of these status indicators:

✅ **"VS Code: Connected"** (Green) - Everything working
- Bridge server is running
- WebSocket connection successful
- Ready to receive components

⚠️ **"VS Code: Connecting..."** (Yellow) - Attempting connection
- Bridge server might be loading
- Wait a few seconds

❌ **"VS Code: Disconnected"** (Red) - Not connected
- Bridge server not started
- Check Control Panel in VS Code
- Click "Reconnect Now" button in plugin

---

## 🐛 Troubleshooting

### Extension Won't Activate

**Check:**
```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm run compile
```

**Debug Console shows errors:**
- Look for specific file/line number
- Check if all dependencies installed: `npm install`

---

### Bridge Server Won't Start

**Error: "Port 3333 already in use"**
```bash
# Find and kill process
lsof -i :3333
kill -9 <PID>

# Or kill all node processes
pkill -f figma-bridge-server
```

**Error: "Cannot find module"**
```bash
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm install
```

---

### Figma Plugin Won't Load

**Error in Figma Console: "Unexpected token"**
- JavaScript syntax error (should be fixed now)
- Recompile: `cd "/Users/Santosh/Code to Figma" && npm run build`

**Plugin UI is blank:**
- Check Figma Console for errors
- Verify `ui.html` and `code.js` exist in root folder

**WebSocket won't connect:**
1. Verify bridge server is running (check Control Panel)
2. Check port 3334 is listening: `lsof -i :3334`
3. Look for connection attempts in Figma Console
4. Firewall might be blocking - check System Preferences → Security

---

### Component Export Fails

**"No component data found"**
- Select the entire component function, including the return statement
- Ensure code is valid JavaScript/JSX

**Component appears but styling is wrong:**
- Check console for font loading warnings
- Verify color format (hex, rgb, named colors)
- Some values might need units (e.g., `fontSize: 24` not `'24px'`)

---

## 📊 Success Metrics

After completing all tests, you should have:

- ✅ VS Code extension loads without errors
- ✅ Bridge server starts on ports 3333 and 3334
- ✅ Figma plugin UI displays correctly
- ✅ WebSocket connection shows "Connected" status
- ✅ Sample component exports to Figma
- ✅ Component styling matches code
- ✅ No console errors in either VS Code or Figma

---

## 🎯 Next Steps (After Testing)

### For Production Use:

1. **Security Hardening:**
   - Add input validation in bridge server
   - Implement request rate limiting
   - Encrypt Figma credentials in VS Code settings

2. **Error Handling:**
   - Add exponential backoff to WebSocket reconnection
   - Improve error messages shown to users
   - Add logging to bridge server (Winston, Pino)

3. **Testing:**
   - Add unit tests for parser (Jest)
   - Add integration tests for bridge server
   - Test with more complex component examples

4. **Documentation:**
   - Consolidate multiple README files into one
   - Add video walkthrough
   - Create troubleshooting FAQ

5. **Publishing:**
   - Follow `PUBLISHING_GUIDE.md` to publish extension to VS Code Marketplace
   - Publish Figma plugin to Figma Community
   - Set up CI/CD for automated builds

---

## 🔧 Quick Reference Commands

```bash
# Install dependencies
cd "/Users/Santosh/Code to Figma"
npm install
cd vscode-extension
npm install

# Compile both components
cd "/Users/Santosh/Code to Figma"
npm run build
cd vscode-extension
npm run compile

# Start bridge server standalone
cd "/Users/Santosh/Code to Figma/vscode-extension"
node figma-bridge-server.js

# Check for TypeScript errors
cd "/Users/Santosh/Code to Figma/vscode-extension"
npm run compile 2>&1 | grep -i error

# Test extension (in VS Code)
# Press F5 in /vscode-extension folder

# Clean and rebuild everything
cd "/Users/Santosh/Code to Figma"
rm -rf node_modules package-lock.json
npm install
npm run build
cd vscode-extension
rm -rf node_modules package-lock.json dist
npm install
npm run compile
```

---

## 📝 Report Issues

When testing, if you encounter issues, gather this info:

1. **VS Code Output Panel** (View → Output → "Code to Figma")
2. **VS Code Debug Console** (View → Debug Console)
3. **Figma Plugin Console** (Plugins → Development → Open Console)
4. **Bridge Server Terminal Output**
5. **Specific steps that caused the error**

This will help identify and fix any remaining issues quickly.
