# Screen Extraction Guide for Figma

Automated workflow to extract React Native screens and convert them to Figma-compatible JSON.

## Quick Start

### One Command Extraction

```bash
# Extract any screen to JSON
npm run extract-screen app/(auth)/sign-in.tsx

# Specify custom output path
npm run extract-screen app/(auth)/sign-up.tsx -- --output figma-plugin/my-custom-name.json

# Extract other screens
npm run extract-screen app/(tabs)/index.tsx
npm run extract-screen app/(auth)/onboarding-1.tsx
```

## What Gets Extracted

✅ **Layout Structure**
- SafeAreaView, View, ScrollView components
- Auto-layout properties (flexDirection, justifyContent, alignItems)
- Proper spacing (padding, margins, gaps)

✅ **Styling**
- Colors (including VibeColors constants)
- Typography (Signika font with proper weights)
- Border radius, borders, shadows
- Background colors and opacity

✅ **Components**
- Text labels and placeholders
- Input fields (email, password, etc.)
- Buttons (primary, secondary, social auth)
- SVG icons (Apple, Google, etc.)
- Dividers and separators

✅ **Mobile Dimensions**
- Standard iPhone size: 390x844
- Proper SafeAreaView constraints
- Auto-layout for responsive elements

## Manual Extraction (Advanced)

For complex screens or custom requirements:

```javascript
// scripts/extract-screen-for-figma.js
node scripts/extract-screen-for-figma.js <path-to-screen>
```

### Example Manual JSON Structure

```json
{
  "component": {
    "type": "SafeAreaView",
    "name": "ScreenName",
    "styles": {
      "width": 390,
      "height": 844,
      "backgroundColor": "#FFFFFF",
      "flexDirection": "column"
    },
    "children": [
      {
        "type": "View",
        "name": "Container",
        "styles": {
          "flex": 1,
          "paddingHorizontal": 28,
          "paddingTop": 60,
          "paddingBottom": 32,
          "flexDirection": "column",
          "justifyContent": "space-between"
        },
        "children": [
          // Your components here
        ]
      }
    ]
  },
  "metadata": {
    "appName": "Provibe",
    "framework": "React Native",
    "version": "1.0",
    "screen": "ScreenName",
    "date": "2026-02-14"
  }
}
```

## Import to Figma

1. **Build the plugin** (if not already built):
   ```bash
   cd figma-plugin && npm run build
   ```

2. **Open Figma Desktop**

3. **Run the plugin**:
   - Plugins → Development → Code to Figma
   - Or Plugins → Code to Figma (if published)

4. **Paste JSON**:
   - Copy contents of generated JSON file
   - Paste into plugin interface
   - Click "Import to Figma"

5. **Result**:
   - Frame sized at 390x844 (iPhone standard)
   - Auto-layout enabled
   - Editable text and vectors
   - Proper Signika fonts

## Best Practices

### ✅ Do's

- Use `flex: 1` for expandable containers
- Use `minHeight` instead of fixed `height` for inputs
- Use `flexDirection` and `gap` for spacing
- Include SVG data for icons
- Use proper font weights (400, 500, 600, 700)
- Match VibeColors constants

### ❌ Don'ts

- Avoid fixed heights on containers
- Don't use pixel-perfect positioning (use flex)
- Don't forget `justifyContent: "space-between"` for layouts
- Don't use `Signika_400Regular` format (use `fontWeight: "400"`)
- Don't omit `flexDirection` on containers with children

## Supported Component Types

### Core Components
- `SafeAreaView` - Root container with mobile dimensions
- `View` - Generic container (becomes Frame in Figma)
- `ScrollView` - Scrollable container
- `Text` - Text labels
- `Pressable` - Interactive buttons

### Form Components
- `TextInput` - Input fields (represented as Views with placeholder Text)

### Special Components
- `Icon` - SVG vector graphics (requires `svgData` property)
- `Image` - Raster images (becomes placeholder in Figma)
- `LinearGradient` - Gradient fills

## Troubleshooting

### Layout Issues
**Problem**: Elements overflow or don't fit in mobile frame

**Solution**: 
- Use `flex: 1` on main containers
- Use `minHeight` instead of `height`
- Add `flexDirection: "column"` explicitly
- Use `justifyContent: "space-between"` for spaced layouts

### Font Issues
**Problem**: Fonts don't match or fallback to Inter

**Solution**:
- Use `fontWeight` as string: "400", "500", "600", "700"
- Don't use `Signika_400Regular` syntax
- Install Signika font in Figma if needed

### Icon Issues
**Problem**: Icons show as placeholder text

**Solution**:
- Change `type: "View"` to `type: "Icon"`
- Add `svgData` property with full SVG string
- Ensure SVG is properly escaped in JSON

### Auto-layout Issues
**Problem**: Elements not using Figma auto-layout

**Solution**:
- Ensure `flexDirection` is set on parent Views
- Use `gap` for spacing between children
- Avoid fixed dimensions where possible
- Use `alignItems` and `justifyContent`

## Examples

### Sign In Screen
```bash
npm run extract-screen app/(auth)/sign-in.tsx
```
Generates: `figma-plugin/sign-in-screen.json`

### Sign Up Screen
```bash
npm run extract-screen app/(auth)/sign-up.tsx
```
Generates: `figma-plugin/sign-up-screen.json`

### Home Tab
```bash
npm run extract-screen app/(tabs)/index.tsx
```
Generates: `figma-plugin/index-screen.json`

## Advanced Customization

To customize the extraction for your specific needs, edit:
```
scripts/extract-screen-for-figma.js
```

Key functions:
- `parseStyles()` - Extract StyleSheet styles
- `extractComponentStructure()` - Analyze JSX structure
- `generateJSON()` - Build final JSON output
- `generateFormSection()` - Create form fields
- `generateSocialButtons()` - Add social auth buttons

## Support

For issues or questions:
1. Check the Figma plugin logs in Figma Desktop
2. Verify JSON structure matches examples
3. Ensure all required SVG assets exist
4. Review the plugin's `code.ts` for supported properties
