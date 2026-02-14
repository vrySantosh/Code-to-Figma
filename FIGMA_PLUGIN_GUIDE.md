# 🎨 Push Signup Page to Figma - Quick Start Guide

This guide shows you how to export your React Native signup page structure to Figma using a custom plugin.

## ✨ What You Get

A fully structured Figma representation of your signup page including:
- ✅ Complete component hierarchy
- ✅ All design tokens (colors, fonts, spacing)
- ✅ Exact styles from your React Native code
- ✅ Proper auto-layout frames
- ✅ Text elements with correct formatting

## 📦 Setup (One-Time)

### Step 1: Install Plugin Dependencies

```bash
cd figma-plugin
npm install
```

### Step 2: Build the Plugin

```bash
npm run build
```

### Step 3: Install Plugin in Figma

1. **Open Figma Desktop** (not browser - plugins require desktop app)
2. Go to **Menu → Plugins → Development → Import plugin from manifest...**
3. Navigate to the `figma-plugin/` folder in this project
4. Select `manifest.json`
5. Click **Open**

The plugin "Code to Figma" is now installed! ✅

## 🚀 Usage (Every Time You Want to Export)

### Step 1: Extract Your Signup Page

From your project root:

```bash
npm run extract-signup
```

This creates `figma-plugin/signup-data.json` containing your component structure.

### Step 2: Open the Plugin in Figma

1. Open Figma Desktop
2. Create a new file or open an existing one
3. Go to **Plugins → Development → Code to Figma**

### Step 3: Import Your Design

1. Open `figma-plugin/signup-data.json` in your code editor
2. **Copy all the JSON content** (Cmd+A, Cmd+C)
3. **Paste it** into the plugin's text area
4. Click **"Import to Figma"**

🎉 Your signup page structure is now in Figma!

## 📐 What Gets Created

The plugin creates this structure:

```
📱 Signup Page (from React Native)
   └── 📦 Container
       ├── 📋 Header
       │   ├── Create your account (Title)
       │   └── Join Provibe and start... (Subtitle)
       │
       ├── 📝 Content
       │   ├── Form
       │   │   ├── Name Input Group
       │   │   ├── Email Input Group
       │   │   └── Password Input Group
       │   │
       │   ├── Divider ("or continue with")
       │   │
       │   └── Social Buttons
       │       ├── 🍎 Apple Button
       │       └── 🔍 Google Button
       │
       └── 🔘 Footer
           ├── Create Account Button
           └── Sign In Link
```

## 🎨 Design Tokens Imported

All your design system values are preserved:

| Token Type | Example Values |
|------------|----------------|
| **Colors** | `#91C788` (accent), `#000000` (text), `#FAFAFA` (input bg) |
| **Typography** | Signika font, 14-32px sizes, 1.232 line height ratio |
| **Spacing** | 8px gaps, 16px padding, 24px horizontal padding |
| **Borders** | 12-16px border radius, 1px border width |
| **Heights** | 50px inputs, 56px buttons |

## 💡 Tips & Tricks

### Make Edits in Figma

Once imported, you can:
- Change colors and styles
- Rearrange elements
- Add images and icons
- Create variants
- Share with your team

### Re-import Updates

1. Make changes to your React Native code
2. Run `npm run extract-signup` again
3. Re-import the new JSON

**Note:** Each import creates a new frame (doesn't update existing ones)

### Export Other Components

To export different components:
1. Edit `scripts/extract-signup-for-figma.js`
2. Replace the component structure
3. Run the extraction script

## 🔧 Advanced: Customize the Plugin

### Add More Style Properties

Edit `figma-plugin/code.ts` to support:
- Shadows/elevation
- Gradients
- Opacity
- Transform properties

### Import Icons

Extend the plugin to:
1. Detect icon components
2. Import SVG files
3. Place as vector graphics

### Auto-screenshot

Add functionality to:
1. Launch your app
2. Take screenshots
3. Import as images

## 🐛 Troubleshooting

**"Plugin not found"**
- Make sure you're using Figma Desktop (not browser)
- Verify you ran `npm run build` in figma-plugin directory
- Re-import the manifest

**"Invalid JSON" error**
- Check that you copied the entire JSON output
- Use a JSON validator to verify format
- Make sure there are no trailing commas

**Fonts don't match**
- The plugin automatically falls back to Inter if Signika isn't installed
- For exact match, install Signika font (see [figma-plugin/FONT_SETUP.md](./figma-plugin/FONT_SETUP.md))
- Inter is very similar and works well for most cases

**Icons not showing**
- Make sure you re-extracted data after the update: `npm run extract-signup`
- Verify the JSON contains `"type":"Icon"` entries
- Check console for SVG parsing errors

**Layout looks different**
- React Native's flexbox and Figma's auto-layout differ slightly
- Manual adjustment may be needed for some layouts
- Check the `justifyContent` and `alignItems` mappings

## 📚 Learn More

- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Plugin Code](./figma-plugin/code.ts) - See how it works
- [Extraction Script](./scripts/extract-signup-for-figma.js) - Customize extraction

## 🎯 Next Steps

1. ✅ Complete setup (if not done)
2. ✅ Run extraction script
3. ✅ Import into Figma
4. 🎨 Customize and share your design!

---

**Need help?** Check [figma-plugin/README.md](./figma-plugin/README.md) for detailed documentation.
