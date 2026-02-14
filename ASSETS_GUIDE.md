# Creating Plugin Assets for Publishing

This guide helps you create the required assets for publishing your plugin to Figma Community.

## 📋 Required Assets Checklist

- [ ] Cover Image (1920x960px, PNG/JPG)
- [ ] Plugin Icon (128x128px, PNG)
- [ ] Screenshots (minimum 1, recommended 3-5)
- [ ] Demo Video (optional but highly recommended)

---

## 🖼️ Cover Image (1920x960px)

### Design in Figma

1. **Create Frame**
   ```
   Frame name: Plugin Cover
   Width: 1920px
   Height: 960px
   ```

2. **Add Background**
   - Gradient from `#667eea` to `#764ba2` (135° angle)
   - OR solid color `#5865F2` (Figma brand color)

3. **Add Title**
   ```
   Text: "Code to Figma"
   Font: Inter Bold
   Size: 96px
   Color: White
   Position: Top-left area
   ```

4. **Add Subtitle**
   ```
   Text: "Import Your Code into Figma Designs"
   Font: Inter Medium
   Size: 48px
   Color: White (80% opacity)
   Position: Below title
   ```

5. **Add Visual Example**
   - Left side: Screenshot of code snippet
   - Arrow in middle: →
   - Right side: Screenshot of imported Figma design

6. **Add Feature Badges** (Bottom)
   ```
   ✓ All Components
   ✓ Full Styles
   ✓ SVG Icons
   ✓ Auto-Layout
   ```

7. **Export**
   - Format: PNG
   - Scale: 2x
   - Optimize for web

### Quick Template

Use this pre-made Figma template:
```
1. Go to Figma Community
2. Search "Plugin Cover Template"
3. Duplicate and customize
```

---

## 🎨 Plugin Icon (128x128px)

### Design Concept

**Option 1: Combined Logos**
- React logo (left half)
- Figma logo (right half)
- Gradient overlay

**Option 2: Symbol Design**
- Code brackets `{ }` in React blue (#61DAFB)
- Frame/artboard icon in Figma purple (#A259FF)
- Combine them creatively

**Option 3: Initials**
- "RN" in modern sans-serif
- Gradient background
- Rounded square container

### Create in Figma

1. **Frame Setup**
   ```
   Size: 128x128px
   Corner radius: 24px (for modern look)
   ```

2. **Background**
   ```
   Gradient: #667eea → #764ba2
   OR: Solid #A259FF
   ```

3. **Icon/Symbol**
   ```
   Size: 64x64px (centered)
   Color: White
   Style: Simple, recognizable at small sizes
   ```

4. **Export**
   ```
   Format: PNG
   Scale: 2x
   Remove background: No (keep background)
   ```

### Icon Design Services

If you're not a designer, use these:
- **Fiverr**: $5-25 for custom icon
- **99designs**: Icon contest $99+
- **Icon8**: Customize existing icons
- **Canva**: Icon templates (free)

---

## 📸 Screenshots

### Screenshot 1: Plugin Interface

**What to Show:**
- Full plugin UI with sample JSON in textarea
- Buttons visible
- Clean, professional look

**How to Capture:**
1. Open plugin in Figma Desktop
2. Paste sample JSON (formatted nicely)
3. Take screenshot (Cmd+Shift+4 on Mac)
4. Resize to 1200px wide
5. Add subtle shadow/border

**Annotations (optional):**
- Arrow pointing to textarea: "Paste your component JSON"
- Arrow pointing to button: "Click to import"

### Screenshot 2: Import Process

**What to Show:**
- Split view: JSON on left, imported design on right
- OR: Before/after comparison

**How to Create:**
1. Create 2-column frame in Figma
2. Left: Code snippet screenshot
3. Right: Imported design screenshot
4. Add arrow between them
5. Export as PNG

### Screenshot 3: Final Result

**What to Show:**
- Beautiful imported component in Figma
- Show layer structure (expanded)
- Show how styles are preserved

**Tips:**
- Use a complex, impressive example
- Show multiple component types
- Include auto-layout indicators

### Screenshot 4: Multiple Components (optional)

**What to Show:**
- Several imported components together
- Component library created from code
- Demonstrates versatility

### Screenshot 5: Features Highlight (optional)

**What to Show:**
- Grid of features with visual examples
- Icons, gradients, shadows, etc.
- Each feature with small screenshot

---

## 🎬 Demo Video

### Why Make a Video?

- **10x more engagement** than screenshots alone
- Shows the plugin in action
- Easier for users to understand
- Increases conversion rate

### Video Structure (30-60 seconds)

```
0:00-0:05  Title screen: "Code to Figma"
0:05-0:10  Open Figma, run plugin
0:10-0:20  Paste JSON data
0:20-0:25  Click Import button
0:25-0:40  Show result appearing, explore layers
0:40-0:50  Show another example (optional)
0:50-0:60  Call to action: "Try it now!"
```

### Recording Tools

**Easy (Recommended):**
- **Loom**: Free, browser-based, 5 min limit
- **QuickTime** (Mac): Built-in, simple
- **Xbox Game Bar** (Windows): Built-in

**Advanced:**
- **OBS Studio**: Free, professional
- **ScreenFlow** (Mac): $149, worth it
- **Camtasia**: $250, easy editing

### Recording Tips

1. **Prepare Everything**
   - Have JSON ready to paste
   - Clean up Figma file
   - Close unnecessary windows
   - Full screen mode

2. **Quality Settings**
   - 1080p minimum
   - 60fps if possible
   - No background noise
   - Clear cursor visibility

3. **Narration (optional)**
   - Script it out first
   - Use good microphone
   - Speak clearly and slowly
   - OR use text overlays instead

4. **Editing**
   - Speed up slow parts (1.5x-2x)
   - Add transitions
   - Include text overlays
   - Background music (optional, quiet)

### Video Hosting

- **YouTube**: Unlisted or public
- **Vimeo**: Professional
- **Figma Community**: Upload directly
- **Loom**: Easiest, free

---

## 🎨 Color Palette to Use

Use these consistent colors across all assets:

```css
/* Primary Colors */
Primary Purple: #667eea
Primary Blue: #764ba2
Accent: #61DAFB
Figma Purple: #A259FF

/* Neutrals */
Dark: #1a1a1a
Medium: #666666
Light: #f5f5f5
White: #ffffff

/* Accent */
Success: #10B981
Warning: #F59E0B
Error: #EF4444
```

---

## 📐 Dimensions Reference

```
Cover Image:     1920 x 960 px  (2:1 ratio)
Plugin Icon:     128 x 128 px   (1:1 ratio, rounded square)
Screenshots:     1200 x variable (maintain aspect ratio)
Video:           1920 x 1080 px (16:9 ratio)
```

---

## ✅ Quality Checklist

Before submitting assets:

**Cover Image:**
- [ ] Correct dimensions (1920x960px)
- [ ] High quality, no pixelation
- [ ] Text is readable
- [ ] Shows what plugin does
- [ ] Looks professional
- [ ] File size < 2MB

**Icon:**
- [ ] Correct dimensions (128x128px)
- [ ] Looks good at small sizes
- [ ] Recognizable
- [ ] Matches brand colors
- [ ] No text (or minimal)

**Screenshots:**
- [ ] At least 1 screenshot
- [ ] High quality, clear
- [ ] Shows actual plugin functionality
- [ ] No placeholder/lorem ipsum
- [ ] Proper aspect ratios
- [ ] Each < 1MB

**Video (if included):**
- [ ] Under 2 minutes
- [ ] 1080p quality
- [ ] Shows complete workflow
- [ ] No audio issues
- [ ] Proper pacing
- [ ] File size < 100MB

---

## 🎁 Asset Templates (Coming Soon)

We'll create Figma templates for:
1. Cover image with customizable text
2. Icon design variations
3. Screenshot annotation templates
4. Video storyboard template

**For now:** Use the guidelines above or hire a designer on Fiverr ($5-25).

---

## 💡 Pro Tips

1. **Consistency is Key**
   - Use same colors across all assets
   - Same fonts (Inter is safe)
   - Same visual style

2. **Show Real Examples**
   - Don't use fake/placeholder data
   - Use actual code components
   - Make it look impressive

3. **Test at Small Sizes**
   - Icon should work at 32px
   - Cover should work as thumbnail
   - Screenshots should be readable when small

4. **Get Feedback**
   - Show to colleagues
   - Post in design communities
   - Iterate based on feedback

5. **Look at Successful Plugins**
   - Browse top plugins in Figma Community
   - See what makes their assets work
   - Don't copy, but learn from them

---

## 🚀 Ready to Create?

1. Start with icon (quickest)
2. Then screenshots (need working plugin)
3. Then cover image (use screenshots)
4. Finally video (optional but powerful)

**Time estimate:**
- Icon: 30 min - 2 hours
- Screenshots: 30 min
- Cover: 1-2 hours
- Video: 2-4 hours

**OR hire someone:**
- Full asset package on Fiverr: $50-150
- Worth it if design isn't your strength!

---

Need help? Check out successful plugins in Figma Community for inspiration!
