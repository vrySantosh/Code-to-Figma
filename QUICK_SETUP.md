# Quick Setup & Testing Guide

Get your plugin running in under 5 minutes!

## 🚀 Quick Start

### 1. Build the Plugin

```bash
cd figma-plugin
npm install
npm run build
```

✅ This creates `code.js` from `code.ts`

### 2. Install in Figma

1. **Open Figma Desktop** (not browser!)
2. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to your `figma-plugin/` folder
4. Select **`manifest.json`**
5. Click **Open**

✅ Plugin "Code to Figma" is now installed!

### 3. Test It

1. **Open Figma** (or create new file)
2. Menu → **Plugins** → **Development** → **Code to Figma**
3. **Copy** the example JSON below
4. **Paste** into the plugin textarea
5. Click **"🚀 Import to Figma"**

### Example JSON (Copy This)

```json
{
  "component": {
    "type": "View",
    "name": "WelcomeCard",
    "styles": {
      "backgroundColor": "#FFFFFF",
      "padding": 24,
      "borderRadius": 16,
      "shadowColor": "#000000",
      "shadowOffset": { "width": 0, "height": 4 },
      "shadowOpacity": 0.1,
      "shadowRadius": 12,
      "width": 327
    },
    "children": [
      {
        "type": "Text",
        "name": "Title",
        "text": "Welcome to React Native",
        "styles": {
          "fontSize": 24,
          "fontWeight": "700",
          "color": "#000000",
          "marginBottom": 8
        }
      },
      {
        "type": "Text",
        "name": "Subtitle",
        "text": "Build amazing mobile apps with ease",
        "styles": {
          "fontSize": 16,
          "fontWeight": "400",
          "color": "#666666",
          "lineHeight": 24,
          "marginBottom": 20
        }
      },
      {
        "type": "Pressable",
        "name": "GetStartedButton",
        "styles": {
          "backgroundColor": "#667eea",
          "paddingVertical": 14,
          "paddingHorizontal": 32,
          "borderRadius": 10,
          "alignItems": "center"
        },
        "children": [
          {
            "type": "Text",
            "name": "ButtonText",
            "text": "Get Started",
            "styles": {
              "color": "#FFFFFF",
              "fontSize": 16,
              "fontWeight": "600"
            }
          }
        ]
      }
    ]
  },
  "metadata": {
    "appName": "TestApp",
    "framework": "React Native"
  }
}
```

🎉 You should see a beautiful card appear in Figma!

---

## 🔄 Making Changes

### Edit the Plugin

1. **Modify** `code.ts`
2. **Rebuild**: `npm run build`
3. **Reload** plugin in Figma (or restart Figma)
4. **Test** again

### Watch Mode (Auto-rebuild)

```bash
npm run watch
```

This automatically rebuilds when you save `code.ts`!

---

## 📁 More Examples

Try these examples from the `/examples` folder:

### Simple Component
```bash
cat figma-plugin/examples/simple-component.json
```

### Complex Screen
```bash
cat figma-plugin/examples/complex-screen.json
```

---

## 🐛 Troubleshooting

### Plugin doesn't appear
- ✅ Make sure you ran `npm run build`
- ✅ Use Figma **Desktop** (not browser)
- ✅ Check that `code.js` exists in `figma-plugin/`

### Import fails
- ✅ Validate JSON (use jsonlint.com)
- ✅ Check Figma console: **Help** → **Toggle Developer Tools**
- ✅ Rebuild: `npm run build`

### Fonts look wrong
- ✅ Plugin auto-falls back to Inter (always available)
- ✅ To use custom fonts, install them in Figma first

### Changes not showing
- ✅ Rebuild after changes: `npm run build`
- ✅ Restart Figma Desktop
- ✅ Re-import the plugin from manifest

---

## ✅ Next Steps

1. **Try extracting a real component** from your app
2. **Test with complex examples** (nested components, lists, etc.)
3. **Check the full README** for advanced features
4. **When ready to publish**, see [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md)

---

Happy importing! 🎨
