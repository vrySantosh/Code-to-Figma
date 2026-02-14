# ⚡️ Quick Start - 3 Steps

## 1️⃣ Build Plugin (One-Time Setup)

```bash
cd figma-plugin
npm install
npm run build
```

Then in Figma Desktop:
- Menu → Plugins → Development → Import plugin from manifest
- Select `figma-plugin/manifest.json`

## 2️⃣ Extract Component Data

```bash
# From project root
npm run extract-signup
```

This creates `figma-plugin/signup-data.json`

## 3️⃣ Import to Figma

1. Open Figma Desktop
2. Plugins → Development → Code to Figma
3. Copy content from `signup-data.json`
4. Paste into plugin and click "Import to Figma"

✅ Done!

---

📖 Full guide: See [../FIGMA_PLUGIN_GUIDE.md](../FIGMA_PLUGIN_GUIDE.md)
