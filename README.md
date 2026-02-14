# Code to Figma - Plugin

> 🚀 The first plugin to import code INTO Figma designs

Import your existing components into Figma with full fidelity. Perfect for:
- 📚 **Documentation**: Create design specs from your codebase
- 🎨 **Design Handoff**: Show designers exactly what's implemented
- 🔄 **Reverse Engineering**: Convert code back to visual designs
- 👥 **Collaboration**: Share implementation details with your team

## ✨ Features

### Comprehensive Component Support
- ✅ **Core Components**: View, Text, Image, ScrollView, FlatList
- ✅ **Touchables**: Pressable, TouchableOpacity, TouchableHighlight
- ✅ **Forms**: TextInput, Switch, Slider, Picker
- ✅ **Indicators**: ActivityIndicator, ProgressBar
- ✅ **Containers**: SafeAreaView, KeyboardAvoidingView
- ✅ **Custom**: LinearGradient, Icons (SVG), Modal

### Full Style Fidelity
- 🎨 **Colors**: Background, text, tint, opacity
- 📏 **Layout**: Flexbox, positioning, sizing, spacing
- 🔤 **Typography**: All font weights, styles, transforms
- 🎭 **Effects**: Shadows (iOS), elevation (Android), gradients
- 🖼️ **Borders**: Radius (per-corner), width, colors, styles

### Smart Features
- 🧠 **Intelligent Font Loading**: Automatic fallbacks and weight variations
- 📦 **Auto-Layout**: React Native flex → Figma auto-layout
- 🎯 **Preserves Hierarchy**: Exact component structure maintained
- 🖼️ **SVG Icons**: Vector graphics imported and editable

## 🎯 What Makes This Unique?

**All other plugins go Figma → Code**. This plugin goes the opposite direction: **Code → Figma**.

This is the ONLY plugin that lets you:
1. Document existing apps in Figma
2. Create design specs from implementation
3. Sync implementation details with design team
4. Reverse-engineer designs from code

## 📦 Installation

### Option 1: From Figma Community (Recommended)
1. Open Figma Desktop
2. Go to **Plugins → Browse plugins in Community**
3. Search for "Code to Figma"
4. Click **Install**

### Option 2: Development Mode
1. Clone this repository
2. Install dependencies:
   ```bash
   cd figma-plugin
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma Desktop: **Plugins → Development → Import plugin from manifest**
5. Select `manifest.json` from the `figma-plugin` folder

## 🚀 Usage

### Step 1: Extract Component Data

Create an extraction script in your project (example shown for React Native):

```javascript
// scripts/extract-component-for-figma.js
const fs = require('fs');

// Your component extraction logic
const componentData = {
  component: {
    type: 'View',
    name: 'MyScreen',
    styles: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      flex: 1,
    },
    children: [
      {
        type: 'Text',
        name: 'Title',
        text: 'Hello World',
        styles: {
          fontSize: 24,
          fontWeight: '700',
          color: '#000000',
        },
      },
      // ... more children
    ],
  },
  metadata: {
    appName: 'MyApp',
    framework: 'React Native',
    version: '0.73',
  },
};

// Output JSON
fs.writeFileSync(
  'figma-plugin/component-data.json',
  JSON.stringify(componentData, null, 2)
);

console.log(JSON.stringify(componentData, null, 2));
```

Run your extraction:
```bash
node scripts/extract-component-for-figma.js
```

### Step 2: Import to Figma

1. Open Figma Desktop
2. Run the plugin: **Plugins → Code to Figma**
3. Copy the JSON from your extraction output
4. Paste into the plugin textarea
5. Click **"Import to Figma"**

🎉 Your component is now in Figma!

## 📋 Data Format

The plugin expects JSON in this format:

```typescript
{
  "component": {
    "type": "View" | "Text" | "Image" | "ScrollView" | ...,
    "name": "ComponentName",
    "styles": {
      // All React Native StyleSheet properties
      backgroundColor?: string,
      padding?: number,
      fontSize?: number,
      // ... 100+ supported properties
    },
    "children": [ /* nested components */ ],
    // Component-specific props
    "text"?: string,         // for Text
    "source"?: string,       // for Image
    "svgData"?: string,      // for Icons
    "placeholder"?: string,  // for TextInput
  },
  "metadata": {
    "appName": "MyApp",
    "framework": "React Native",
    "version": "0.73"
  }
}
```

## 🎨 Supported Style Properties

### Layout & Sizing
```typescript
width, height, minWidth, maxWidth, minHeight, maxHeight
flex, flexGrow, flexShrink, flexBasis
flexDirection, flexWrap, alignItems, alignSelf, justifyContent
```

### Spacing
```typescript
padding, paddingTop, paddingRight, paddingBottom, paddingLeft
paddingHorizontal, paddingVertical
margin, marginTop, marginRight, marginBottom, marginLeft
marginHorizontal, marginVertical
gap, rowGap, columnGap
```

### Typography
```typescript
fontFamily, fontSize, fontWeight, fontStyle
lineHeight, letterSpacing, textAlign
textDecorationLine, textTransform
```

### Colors & Effects
```typescript
backgroundColor, color, opacity, tintColor
shadowColor, shadowOffset, shadowOpacity, shadowRadius
elevation (Android)
```

### Borders
```typescript
borderRadius, borderTopLeftRadius, borderTopRightRadius, etc.
borderWidth, borderColor, borderStyle
```

### Position
```typescript
position, top, right, bottom, left, zIndex
```

### Overflow
```typescript
overflow: 'visible' | 'hidden' | 'scroll'
```

## 🔧 Advanced Usage

### Extracting Multiple Components

Create a batch extraction script:

```javascript
const components = [
  extractComponent('./src/screens/Home.tsx'),
  extractComponent('./src/screens/Profile.tsx'),
  extractComponent('./src/components/Card.tsx'),
];

components.forEach((data, i) => {
  fs.writeFileSync(
    `figma-plugin/component-${i + 1}.json`,
    JSON.stringify(data, null, 2)
  );
});
```

### Including Images

```javascript
{
  type: 'Image',
  name: 'Avatar',
  source: { uri: 'https://example.com/avatar.jpg' },
  styles: {
    width: 100,
    height: 100,
    borderRadius: 50,
  }
}
```

### Including SVG Icons

```javascript
const fs = require('fs');
const svgData = fs.readFileSync('./assets/icon.svg', 'utf-8');

{
  type: 'Icon',
  name: 'UserIcon',
  svgData: svgData,
  styles: {
    width: 24,
    height: 24,
    tintColor: '#FF0000',
  }
}
```

### Including Gradients

```javascript
{
  type: 'LinearGradient',
  name: 'Background',
  colors: ['#667eea', '#764ba2'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  styles: {
    width: 375,
    height: 200,
  }
}
```

## 🐛 Troubleshooting

### Fonts Not Loading
- The plugin automatically falls back to Inter if custom fonts aren't installed
- For exact font matching, install your custom fonts in Figma
- Check console for font loading warnings

### Layout Looks Different
- Flexbox and Figma auto-layout have slight differences
- Check `justifyContent` and `alignItems` mappings
- Use `flex: 1` for growing containers

### Icons Not Showing
- Verify SVG data is valid XML
- Check console for SVG parsing errors
- Ensure SVG doesn't use external dependencies

### Import Fails
- Validate JSON format (use a JSON validator)
- Check that all required fields are present
- Verify component `type` is supported

## 📚 Examples

See `/examples` folder for:
- ✅ Simple component extraction
- ✅ Complex screen with navigation
- ✅ Form with inputs and validation
- ✅ List with FlatList
- ✅ Card component with images
- ✅ Gradient backgrounds

## 🔮 Roadmap

- [ ] Batch import multiple components
- [ ] Live sync with app (watch mode)
- [ ] Export updated designs back to code
- [ ] Component variant support
- [ ] Animation preservation
- [ ] Responsive breakpoint handling

## 🤝 Contributing

Contributions welcome! This plugin is open source.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 💬 Support

- 📖 [Documentation](./QUICK_START.md)
- 🐛 [Report Issues](https://github.com/yourusername/react-native-to-figma/issues)
- 💡 [Feature Requests](https://github.com/yourusername/react-native-to-figma/discussions)

## 🙏 Acknowledgments

Built for the developer community with ❤️

Special thanks to:
- Figma Plugin API team
- React Native community
- All contributors and users

---

**Made with 💜 for developers who code first, design later**
