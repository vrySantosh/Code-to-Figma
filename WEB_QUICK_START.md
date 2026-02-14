# Web Support Quick Start Guide

## 🌐 Extract Any Webpage to Figma in 3 Minutes

Your Code to Figma plugin now supports web pages! Here's how to use it.

---

## Method 1: Browser Console (Easiest)

### Step 1: Get the Extraction Code

Run this in your terminal:
```bash
node scripts/extract-web-page.js
```

This will display the extraction code. Copy everything between the code block.

### Step 2: Use It On Any Website

1. **Open any webpage** you want to extract (try this on your own site!)
2. **Press F12** (or Cmd+Option+I on Mac) to open Developer Tools
3. **Click on the "Console" tab**
4. **Paste the extraction code** and press Enter
5. **Enter a CSS selector** when prompted:
   - `.hero` for elements with class "hero"
   - `#main-card` for element with ID "main-card"
   - `article` for the first article element
   - `section.features` for section with class "features"

6. ✅ **JSON is automatically copied to clipboard!**

### Step 3: Import to Figma

1. Open **Figma Desktop**
2. Run **Plugins → Code to Figma**
3. **Paste** the JSON (Cmd+V / Ctrl+V)
4. Click **"Import to Figma"**
5. 🎉 **Done!** Your webpage is now in Figma!

---

## Method 2: Use Example Files

We've included two complete web examples you can try immediately:

### Example 1: Modern Landing Page

1. Open Figma Desktop
2. Run your plugin
3. Copy the entire contents of `examples/web-landing-page.json`
4. Paste and import

**What you'll get:**
- Hero section with heading
- 3-column feature grid
- CTA buttons
- Stats section
- Professional shadows and styling

### Example 2: Contact Form

1. Open Figma Desktop
2. Run your plugin
3. Copy the entire contents of `examples/web-contact-form.json`
4. Paste and import

**What you'll get:**
- Form with heading
- Name input field
- Email input field
- Message textarea
- Submit & cancel buttons
- Full form styling

---

## 🎯 Quick Tips

### Finding the Right Selector

**Don't know the CSS selector?**
1. Right-click the element on the webpage
2. Choose "Inspect" or "Inspect Element"
3. In the DevTools, right-click the highlighted HTML
4. Choose "Copy → Copy selector"
5. Paste that as your selector!

### Best Elements to Extract

✅ **Good choices:**
- Hero sections
- Cards and panels
- Navigation bars
- Forms
- Feature grids
- Pricing tables
- Call-to-action sections

❌ **Avoid:**
- Entire pages (too complex, extract sections instead)
- Elements with lots of absolute positioning
- Complex animations

### Optimization

The extraction script automatically:
- ✅ Skips hidden elements
- ✅ Converts RGB to hex colors
- ✅ Extracts flexbox layouts
- ✅ Captures shadows and borders
- ✅ Preserves typography
- ✅ Maintains hierarchy

---

## 🔍 Example Selectors

Here are some common CSS selectors to try:

```
.header               → Element with class "header"
#hero-section        → Element with ID "hero-section"
.card:first-child    → First card element
main article         → Article inside main tag
.features .grid      → Grid inside features section
form.contact         → Form with class "contact"
button.primary       → Primary button
.container > div     → Direct div children of container
```

---

## 📋 Web Element Support

Your plugin now understands these HTML elements:

**Containers:**
`div`, `section`, `article`, `header`, `footer`, `nav`, `main`, `aside`, `form`

**Text:**
`span`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `label`, `a`

**Forms:**
`button`, `input`, `textarea`

**Lists:**
`ul`, `ol`, `li`

**Media:**
`img`

All elements automatically convert to proper Figma components!

---

## 🐛 Troubleshooting

### "Element not found"
- Check your CSS selector is correct
- Try a simpler selector (e.g., just the class name)
- Make sure the element is visible on the page

### "Failed to extract component"
- The element might be hidden (`display: none`)
- Try extracting a parent element
- Check browser console for errors

### Styles look different
- Web uses different layout model than React Native
- Some CSS properties may not have direct equivalents
- Complex CSS Grid layouts simplified to Flexbox

### No clipboard copy
- Manually copy the JSON from the console
- Look for the large JSON output
- Select all and copy (Cmd+A, Cmd+C)

---

## 🎨 What Gets Extracted

### ✅ Fully Supported:
- Colors (background, text, borders)
- Typography (font size, weight, family, line height)
- Spacing (padding, margin)
- Flexbox layouts
- Borders and border radius
- Box shadows
- Dimensions (width, height)
- Text content
- Placeholder text (inputs)

### ⚠️ Partial Support:
- Complex transforms
- CSS Grid (converted to Flexbox)
- Pseudo-elements
- Background gradients (not yet)

### ❌ Not Supported:
- Animations
- Hover states
- Media queries
- JavaScript interactions

---

## 💡 Pro Tips

1. **Extract Small Sections First**
   - Don't try to extract entire pages
   - Focus on reusable components
   - Better results with focused extractions

2. **Use Descriptive Names**
   - Elements are named by class/ID
   - Clean HTML = clean Figma layers

3. **Test With Examples First**
   - Try the included examples
   - Understand the JSON format
   - Then extract your own pages

4. **Combine Multiple Extractions**
   - Extract header separately
   - Extract hero separately
   - Extract footer separately
   - Combine in Figma

5. **Add Helper Classes**
   - Add `class="figma-extract"` to target elements
   - Makes extraction easier
   - Remove after extracting

---

## 🚀 What's Next?

Now that web support is working:

1. ✅ **Extract your own website components**
2. ✅ **Create a design system from your code**
3. ✅ **Document your UI in Figma**
4. ✅ **Share designs with your team**
5. ✅ **Keep designs and code in sync**

---

## 🎉 You're Ready!

Your plugin now supports:
- ✅ React Native mobile apps
- ✅ Web pages (HTML/CSS)
- ✅ Both frameworks in one plugin

**Try it now with the examples, then extract your own website!**

---

**Questions?** Check [README.md](README.md) for complete documentation.
