# 🔤 Font Setup Guide

The Figma plugin now has better font handling with automatic fallback to Inter font.

## How Font Loading Works

### 1. **Primary Font: Signika**
The signup page uses the **Signika** font family. The plugin will try to load it first.

### 2. **Fallback Font: Inter**
If Signika is not available in your Figma file, the plugin automatically falls back to **Inter** (which is built into Figma).

### 3. **Font Weights Supported**
- Regular (400)
- Medium (500)
- Semi Bold (600)

## ✅ Option 1: Use Inter (Recommended - No Setup)

The easiest option is to just use the default Inter font:

1. Run the import as normal
2. Plugin will automatically use Inter
3. Everything will work out of the box

**Pros:**
- No setup required
- Inter is always available in Figma
- Similar to Signika in appearance

## 🎨 Option 2: Install Signika Font (For Exact Match)

To match your app exactly, install Signika in Figma:

### Method 1: Google Fonts Plugin

1. In Figma, go to **Plugins → Find more plugins**
2. Search for **"Google Fonts"**
3. Install and run the plugin
4. Search for **"Signika"**
5. Click to install it in your Figma file

### Method 2: Manual Installation

1. Download Signika from [Google Fonts](https://fonts.google.com/specimen/Signika)
2. Install on your system:
   - **Mac**: Double-click the .ttf files → Install Font
   - **Windows**: Right-click .ttf files → Install
3. Restart Figma Desktop
4. The font will now be available

## 🔍 Verify Font Installation

After installing Signika:

1. Create a text element in Figma
2. Click on the font dropdown
3. Search for "Signika"
4. You should see:
   - Signika Regular
   - Signika Medium
   - Signika Semi Bold

## 🛠️ Troubleshooting

### "Font not available" warning in console

This is normal if Signika isn't installed. The plugin will use Inter instead.

### Text looks different from the app

**Cause:** Using Inter fallback instead of Signika
**Solution:** Install Signika using one of the methods above

### Semi Bold font not loading

**Cause:** Only Regular weight installed
**Solution:** Download the complete Signika family from Google Fonts

## 📊 Font Comparison

| Aspect | Signika | Inter |
|--------|---------|-------|
| **Availability** | Requires installation | Built into Figma |
| **Setup** | Manual | None |
| **Match to App** | Exact | Very close |
| **Recommended for** | Final designs | Quick mockups |

## 💡 Pro Tip

For team collaboration:
1. Install Signika once
2. Create a "Brand Kit" in Figma with Signika set as the default
3. Share the file with your team
4. Everyone can use the font without individual installation

## 🔄 What Changed

**Before:** Plugin would fail if Signika wasn't available
**Now:** Plugin automatically falls back to Inter for seamless imports

No action required - the plugin handles fonts intelligently!
