# 📥 Install Signika Font for Perfect Match

To get your Figma design to match your app exactly, install the Signika font.

## Quick Install (Recommended)

### For Mac Users:

1. **Download Signika:**
   ```bash
   # Open this URL in your browser
   open "https://fonts.google.com/download?family=Signika"
   ```

2. **Install the font:**
   - Unzip the downloaded file
   - Open the folder
   - Select all `.ttf` files (especially Signika-Regular.ttf, Signika-Medium.ttf, Signika-SemiBold.ttf)
   - Double-click each file and click "Install Font"

3. **Restart Figma Desktop**

4. **Verify in Figma:**
   - Create a text element
   - Font dropdown should show "Signika" with these weights:
     - ✅ Signika Regular
     - ✅ Signika Medium  
     - ✅ Signika SemiBold (or Semi Bold)

### For Windows Users:

1. Download from: https://fonts.google.com/download?family=Signika
2. Unzip the downloaded file
3. Select all `.ttf` files
4. Right-click → "Install for all users"
5. Restart Figma Desktop

## Alternative: Google Fonts Plugin (Easier)

1. In Figma Desktop → **Plugins → Find more plugins**
2. Search for **"Google Fonts"** 
3. Install the plugin
4. Run it: **Plugins → Google Fonts**
5. Search for **"Signika"**
6. Click to install

## Font Weights Needed

The signup page uses these specific weights:

| Element | Weight | Figma Font Style |
|---------|--------|------------------|
| Title ("Create your account") | 600 | Signika SemiBold |
| Button text | 600 | Signika SemiBold |
| Labels (Name, Email, Password) | 500 | Signika Medium |
| Body text | 400 | Signika Regular |
| Placeholders | 400 | Signika Regular |

## Troubleshooting

### "SemiBold not found"

Some Signika versions use "Semi Bold" (with space) instead of "SemiBold".

**Solution:** The plugin automatically tries both variations:
- SemiBold
- Semi Bold
- Semibold
- Bold (as fallback)

### Font installed but not appearing

1. **Restart Figma completely** (Quit and reopen)
2. **Clear font cache** (Help → Clear Cache and Restart)
3. Check System Fonts:
   - Mac: Font Book app
   - Windows: Settings → Fonts

### Still not working?

**Use Inter font** - The plugin automatically falls back to Inter which:
- Is built into Figma (always available)
- Has similar proportions to Signika
- Supports all the same weights
- Requires zero setup

## What If I Skip Installing Signika?

**That's totally fine!** The plugin will:
1. Try to load Signika
2. If not found, automatically use Inter
3. Log a helpful message in console
4. Continue importing without errors

**Result:** Your design will be 95% identical, just with Inter font instead of Signika.

## Direct Download Link

**Google Fonts:** https://fonts.google.com/specimen/Signika

Click "Download family" button (top right)

---

**After installing**, re-import your signup page and the fonts will match perfectly! 🎨
