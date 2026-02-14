# 🔄 Quick Rebuild & Re-import Instructions

## One-Time: Rebuild Plugin

```bash
cd figma-plugin
npm run build
```

**Why?** The code has been updated to support icons and better font handling.

## Every Time: Re-extract & Import

### 1. Extract Updated Data

```bash
# From project root (not figma-plugin directory)
npm run extract-signup
```

This creates `figma-plugin/signup-data.json` with icons included.

### 2. Import to Figma

1. **Open Figma Desktop**
2. **Open your file** (or create new one)
3. **Run plugin:** Plugins → Development → Code to Figma
4. **Copy JSON:**
   ```bash
   cat figma-plugin/signup-data.json | pbcopy  # Mac
   # Or open the file and copy manually
   ```
5. **Paste** into plugin textarea
6. **Click** "Import to Figma"

## ✅ Expected Result

You should see:
- Complete signup page layout
- Apple icon (white, on black button)
- Google icon (colorful, with brand colors)
- All text properly formatted

## 🔧 If Something Goes Wrong

### Icons missing?
```bash
# Make sure you ran extract AFTER rebuilding plugin
npm run extract-signup
```

### Font errors?
Plugin now auto-falls back to Inter - should work without errors.
For Signika, see [FONT_SETUP.md](./FONT_SETUP.md)

### Plugin not found?
```bash
cd figma-plugin
npm run build
# Then re-import manifest in Figma
```

---

That's it! Your signup page should now import with icons and fonts working properly.
