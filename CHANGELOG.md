# Changelog

## Version 1.2.0 - Text Input & Font Weight Fixes

### 🎯 Major Fixes

**Text Input Fields**
- ✅ Now render as properly styled frames (not plain text)
- ✅ Include background color, borders, border radius
- ✅ Show placeholder text with correct styling
- ✅ Proper padding and sizing (327px width)
- ✅ Match React Native TextInput appearance exactly

**Font Weight Handling**
- ✅ Smart font loading tries multiple weight variations
- ✅ Handles "Semi Bold" vs "SemiBold" vs "Semibold"
- ✅ Title "Create your account" now displays correctly bold
- ✅ Better fallback chain to ensure fonts always load

### 🔧 Technical Changes

- Added `loadFontWithFallback()` function for robust font loading
- TextInput now creates Frame → Text hierarchy
- Input fields include proper width (327px) for consistent sizing
- Enhanced console logging for font debugging

### 📝 Updated Files

**Plugin:**
- `code.ts` - Complete rewrite of TextInput and font handling

**Extraction:**
- `extract-signup-for-figma.js` - Added width to all TextInput fields

**Documentation:**
- `FONT_INSTALL.md` - New step-by-step font installation guide
- `UPDATE_V1.2.md` - Update notes for this version

### 🐛 Bug Fixes

- Fixed TextInput rendering as plain text instead of styled input
- Fixed bold font weights (600) not loading correctly
- Fixed "Create your account" title not appearing bold
- Fixed input field borders and backgrounds missing
- Fixed font fallback failing silently

---

## Version 1.1.0 - Icon & Font Improvements

### ✨ New Features

**SVG Icon Import**
- ✅ Apple and Google icons now import as actual SVG graphics
- ✅ Icons maintain their original colors and shapes
- ✅ Vector graphics are editable in Figma
- ✅ Proper sizing (22px for Apple, 18px for Google)

**Smart Font Loading**
- ✅ Automatic fallback to Inter font if Signika not available
- ✅ Support for multiple font weights (Regular, Medium, Semi Bold)
- ✅ Graceful error handling with console warnings
- ✅ No more import failures due to missing fonts

### 🔧 Technical Improvements

- Added `createSvgNode()` function for SVG processing
- Enhanced `createFigmaNode()` with async/await for font loading
- Improved TypeScript types for Icon component
- Better error messages in console

### 📝 Updated Files

**Plugin:**
- `code.ts` - Enhanced icon and font handling
- `ui.html` - No changes (UI remains the same)

**Extraction:**
- `extract-signup-for-figma.js` - Now reads and includes SVG icon data

**Documentation:**
- `FONT_SETUP.md` - New guide for font installation
- `CHANGELOG.md` - This file

### 🎯 Breaking Changes

None - fully backward compatible

### 📋 Migration Guide

1. Rebuild the plugin: `cd figma-plugin && npm run build`
2. Re-extract data: `npm run extract-signup`
3. Re-import in Figma with the new JSON

### 🐛 Bug Fixes

- Fixed font loading failures causing import to crash
- Fixed missing icons in social buttons
- Fixed font weight mapping (600 → Semi Bold, 500 → Medium)

### 🔮 Next Steps

Planned for future versions:
- [ ] Support for more icon formats
- [ ] Batch import multiple components
- [ ] Live sync with app
- [ ] Shadow/elevation support
- [ ] Animation preservation

---

## Version 1.0.0 - Initial Release

- Basic component structure import
- Style conversion (colors, spacing, borders)
- Text element creation
- Frame hierarchy preservation
