# Testing VS Code ↔ Figma Connection

## What We Fixed

The connection was failing because message types didn't match:
- **VS Code Extension** sent: `'export'`, `'update'`
- **Figma Plugin** expected: `'import-from-vscode'`, `'update-from-vscode'`

### Changes Made:
1. **ui.html** - Added type mapping to convert VS Code message types to Figma plugin types
2. **code.ts** - Added `_vscodeMessageId` tracking for proper response routing
3. **Message Flow** - Fixed response handling to send back through WebSocket

---

## Testing Steps

### 1. Verify Bridge Server is Running ✅

The bridge server is now running on:
- HTTP: `http://localhost:3333`
- WebSocket: `ws://localhost:3334`

Test with:
```bash
curl http://localhost:3333/health
```

Expected: `{"status":"ok","message":"Figma Bridge Server is running"}`

---

### 2. Open Figma Plugin

1. Open Figma Desktop application
2. Right-click → Plugins → Development → "Code to Figma"
3. Check the **status indicator at the top** of the plugin:
   - Should show: **🟢 VS Code: Connected** (green badge)
   - If red: Check browser console (Plugins → Development → Open Console)

---

### 3. Test from VS Code Extension

#### A. Convert Component to JSON

1. Open a React/Vue/HTML file (e.g., `ProfileCard.tsx`)
2. Press `Cmd+Shift+P` → **"Code to Figma: Convert to JSON"**
3. Check Output panel for JSON schema

#### B. Export to Figma

1. With a component file open, press `Cmd+Shift+P`
2. Run **"Code to Figma: Export to Figma"**
3. Watch for:
   - VS Code notification: "Exporting to Figma..."
   - Figma notification: "✅ Imported from VS Code successfully!"
   - New frame appears in Figma with component layout

---

### 4. Verify Message Flow

#### In Figma Plugin Console:
```javascript
// Should see:
"Connected to VS Code bridge"
"Received from VS Code: export"
```

#### In Bridge Server Terminal:
```javascript
// Should see:
"Received export request from VS Code"
"Figma plugin connected"
```

#### In VS Code Output:
- Select "Code to Figma" from the dropdown
- Should show successful export with node ID

---

## Example Test

Create a simple test file:

**test-component.tsx**
```tsx
import React from 'react';

export default function SimpleCard() {
  return (
    <div style={{
      width: 300,
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>Test Card</h2>
      <p>This is a test component</p>
    </div>
  );
}
```

1. Open this file in VS Code
2. Run **"Code to Figma: Export to Figma"**
3. Check Figma - you should see a frame with:
   - 300px width
   - 20px padding
   - White background with shadow
   - Text elements for h2 and p

---

## Troubleshooting

### Status shows "🔴 Disconnected"
- Verify bridge server is running: `curl http://localhost:3333/health`
- Check Figma console for WebSocket errors
- Verify firewall isn't blocking localhost:3334

### "Figma plugin not connected" error in VS Code
- Make sure Figma plugin UI is open
- Restart bridge server: Kill port 3334 and restart
- Check manifest.json has correct networkAccess settings

### Export runs but nothing appears in Figma
- Check Figma plugin console for errors
- Verify fonts are installed (Inter family)
- Check code.ts compilation: `npm run build` in plugin folder

### WebSocket won't connect
- Verify manifest.json `networkAccess.allowedDomains`:
  ```json
  "networkAccess": {
    "allowedDomains": [
      "http://localhost",
      "ws://localhost"
    ]
  }
  ```
- Reload plugin in Figma after changing manifest

---

## Connection Architecture

```
┌─────────────────┐
│   VS Code       │
│   Extension     │
└────────┬────────┘
         │ HTTP POST
         │ localhost:3333/figma-plugin
         │ {type: 'export', data: schema}
         ▼
┌─────────────────┐
│  Bridge Server  │
│  Express + WS   │
└────────┬────────┘
         │ WebSocket
         │ localhost:3334
         │ {id, type: 'export', data}
         ▼
┌─────────────────┐        ┌─────────────────┐
│   ui.html       │───────▶│    code.ts      │
│  (WebSocket)    │  msg   │  (Figma Plugin) │
│                 │◀───────│                 │
└────────┬────────┘ response└─────────────────┘
         │
         │ WebSocket response
         │ {id, success, nodeId}
         ▼
┌─────────────────┐
│  Bridge Server  │
└────────┬────────┘
         │ HTTP response
         ▼
┌─────────────────┐
│   VS Code       │
│   Extension     │
└─────────────────┘
```

---

## Next Steps

Once connection is verified:

1. **Configure Figma Settings** in VS Code:
   - `Cmd+,` → Search "Code to Figma"
   - Set `figmaFileId` (from Figma file URL)
   - Set `figmaAccessToken` (from Figma account settings)

2. **Test Auto-Sync**:
   - Run **"Code to Figma: Enable Auto-Sync"**
   - Edit a synced component file
   - Should auto-update in Figma on save

3. **Try Complex Components**:
   - Test with nested layouts
   - Try various style properties
   - Test images and icons

---

## Success Indicators

✅ Bridge server responds to health check
✅ Figma plugin shows green "Connected" badge
✅ Export command completes without errors
✅ New frame appears in Figma with correct layout
✅ Node ID is returned to VS Code
✅ Auto-sync updates Figma on file save

If all these work, your connection is fully functional! 🎉
