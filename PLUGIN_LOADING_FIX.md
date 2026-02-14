# Figma Plugin Loading - Troubleshooting Guide

## ✅ Issue Fixed!

The error "error occurred while loading the plugin environment" was caused by **missing code.js file** in one of the directories.

**Fix Applied:**
- ✅ Rebuilt the plugin from TypeScript
- ✅ Synced all files to both directories
- ✅ Verified all required files are present

---

## 📁 Correct Directory Structure

```
/Users/Santosh/Code to Figma/
├── code.js          ✅ 32 KB (compiled JavaScript)
├── code.ts          ✅ Source TypeScript
├── manifest.json    ✅ Plugin manifest
├── ui.html          ✅ Plugin UI
├── package.json     ✅ Node dependencies
└── tsconfig.json    ✅ TypeScript config
```

---

## 🔧 How to Load the Plugin

### Step 1: Enable Developer Mode
1. Open **Figma Desktop** (not browser!)
2. Go to **Figma → Preferences** (or Settings)
3. Scroll down and enable **"Show Developer Menu"** or similar option

### Step 2: Import Plugin
1. In Figma Desktop, go to: **Plugins → Development → Import plugin from manifest...**
2. Navigate to: `/Users/Santosh/Code to Figma/`
3. Select **manifest.json**
4. Click **Open**

### Step 3: Verify Plugin Loaded
- Plugin should appear in: **Plugins → Development → Code to Figma**
- If you see it in the menu, it loaded successfully! ✅

### Step 4: Test It
1. Run: **Plugins → Development → Code to Figma**
2. Copy JSON from `examples/web-simple-test.json`
3. Paste into plugin and click "Import to Figma"

---

## 🐛 If You Still Get Errors

### "Error occurred while loading the plugin environment"

**Causes:**
1. Wrong directory selected
2. Missing code.js file
3. Figma Desktop not in developer mode
4. Corrupted plugin cache

**Solutions:**

✅ **Solution 1: Use the Correct Directory**
```
/Users/Santosh/Code to Figma/  ← Use this one!

NOT:
/Users/Santosh/Code to Figma/Code-to-Figma/  ← Don't use this
```

✅ **Solution 2: Verify Files Exist**
```bash
cd "/Users/Santosh/Code to Figma"
ls -lh code.js manifest.json ui.html
```
All three files should be listed.

✅ **Solution 3: Rebuild Plugin**
```bash
cd "/Users/Santosh/Code to Figma"
npm run build
```

✅ **Solution 4: Restart Figma**
- Completely quit Figma Desktop (Cmd+Q)
- Reopen Figma Desktop
- Try loading the plugin again

✅ **Solution 5: Remove and Re-add Plugin**
1. In Figma: **Plugins → Development → Remove plugin** (if it's there)
2. Restart Figma
3. Re-import using manifest.json

✅ **Solution 6: Check Console for Errors**
In Figma Desktop:
1. Go to: **Plugins → Development → Open Console**
2. Try loading the plugin
3. Look for error messages in console
4. Share these errors if problem persists

---

## 🎯 Common Issues & Fixes

### Issue: "Cannot find module"
**Fix:** Make sure you're in the main directory, not the subdirectory.

### Issue: "Invalid manifest"
**Fix:** 
```bash
cat manifest.json | python3 -m json.tool
```
This will show if JSON is valid.

### Issue: "Network error"
**Fix:** The plugin doesn't need network access. Ignore this if manifests shows:
```json
"networkAccess": {
  "allowedDomains": ["none"]
}
```

### Issue: Plugin appears but crashes immediately
**Fix:** Check DevTools Console (Plugins → Development → Open Console)

---

## ✅ Verification Checklist

Before loading in Figma, verify:

- [ ] Using **Figma Desktop** (not browser)
- [ ] Developer mode is enabled
- [ ] In correct directory: `/Users/Santosh/Code to Figma/`
- [ ] `code.js` file exists (32 KB)
- [ ] `manifest.json` is valid JSON
- [ ] `ui.html` file exists (11 KB)
- [ ] Figma has been restarted recently

---

## 🚀 Quick Test Command

Run this to verify everything is ready:

```bash
cd "/Users/Santosh/Code to Figma"
echo "Checking files..." && \
ls -lh code.js manifest.json ui.html && \
echo "" && \
echo "Validating manifest..." && \
cat manifest.json | python3 -m json.tool > /dev/null && \
echo "✅ All checks passed! Ready to load in Figma."
```

---

## 📞 Still Having Issues?

If you still get "error occurred while loading the plugin environment":

1. **Check the exact error message** in Figma's Developer Console
2. **Try loading a different plugin** to verify Figma's plugin system works
3. **Update Figma Desktop** to the latest version
4. **Check file permissions** - all files should be readable

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Plugin appears in dev menu without errors
- ✅ Plugin UI opens showing the textarea and buttons
- ✅ Test JSON imports successfully
- ✅ Components appear in Figma canvas

---

**Last Updated:** February 14, 2026
**Status:** Build complete, all files synced, ready to load
