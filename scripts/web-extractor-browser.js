
(function() {
  /**
   * Extract computed styles from an element
   */
  function extractStyles(element) {
    const computed = window.getComputedStyle(element);
    const styles = {};
    
    // Colors & Background
    if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      styles.backgroundColor = rgbToHex(computed.backgroundColor);
    }
    if (computed.color) {
      styles.color = rgbToHex(computed.color);
    }
    if (computed.opacity && computed.opacity !== '1') {
      styles.opacity = parseFloat(computed.opacity);
    }
    
    // Typography
    if (computed.fontFamily) {
      styles.fontFamily = computed.fontFamily.split(',')[0].replace(/['"]/g, '');
    }
    if (computed.fontSize) {
      styles.fontSize = parseFloat(computed.fontSize);
    }
    if (computed.fontWeight && computed.fontWeight !== '400') {
      styles.fontWeight = computed.fontWeight;
    }
    if (computed.fontStyle && computed.fontStyle !== 'normal') {
      styles.fontStyle = computed.fontStyle;
    }
    if (computed.lineHeight && computed.lineHeight !== 'normal') {
      const lineHeight = parseFloat(computed.lineHeight);
      if (!isNaN(lineHeight)) {
        styles.lineHeight = lineHeight;
      }
    }
    if (computed.letterSpacing && computed.letterSpacing !== 'normal') {
      styles.letterSpacing = parseFloat(computed.letterSpacing);
    }
    if (computed.textAlign && computed.textAlign !== 'start') {
      styles.textAlign = computed.textAlign;
    }
    if (computed.textDecoration && computed.textDecoration !== 'none') {
      styles.textDecorationLine = computed.textDecoration.split(' ')[0];
    }
    if (computed.textTransform && computed.textTransform !== 'none') {
      styles.textTransform = computed.textTransform;
    }
    
    // Layout & Sizing
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (width) styles.width = width;
    if (height) styles.height = height;
    
    // Flexbox
    if (computed.display === 'flex' || computed.display === 'inline-flex') {
      if (computed.flexDirection && computed.flexDirection !== 'row') {
        styles.flexDirection = computed.flexDirection;
      }
      if (computed.flexWrap && computed.flexWrap !== 'nowrap') {
        styles.flexWrap = computed.flexWrap;
      }
      if (computed.alignItems && computed.alignItems !== 'normal') {
        styles.alignItems = computed.alignItems;
      }
      if (computed.justifyContent && computed.justifyContent !== 'normal') {
        styles.justifyContent = computed.justifyContent;
      }
      if (computed.gap && computed.gap !== 'normal') {
        styles.gap = parseFloat(computed.gap);
      }
    }
    
    // Spacing
    const padding = parseFloat(computed.paddingTop);
    const paddingRight = parseFloat(computed.paddingRight);
    const paddingBottom = parseFloat(computed.paddingBottom);
    const paddingLeft = parseFloat(computed.paddingLeft);
    
    if (padding === paddingRight && padding === paddingBottom && padding === paddingLeft && padding > 0) {
      styles.padding = padding;
    } else {
      if (paddingTop > 0) styles.paddingTop = padding;
      if (paddingRight > 0) styles.paddingRight = paddingRight;
      if (paddingBottom > 0) styles.paddingBottom = paddingBottom;
      if (paddingLeft > 0) styles.paddingLeft = paddingLeft;
    }
    
    const margin = parseFloat(computed.marginTop);
    const marginRight = parseFloat(computed.marginRight);
    const marginBottom = parseFloat(computed.marginBottom);
    const marginLeft = parseFloat(computed.marginLeft);
    
    if (margin === marginRight && margin === marginBottom && margin === marginLeft && margin > 0) {
      styles.margin = margin;
    } else {
      if (margin > 0) styles.marginTop = margin;
      if (marginRight > 0) styles.marginRight = marginRight;
      if (marginBottom > 0) styles.marginBottom = marginBottom;
      if (marginLeft > 0) styles.marginLeft = marginLeft;
    }
    
    // Borders
    const borderRadius = parseFloat(computed.borderRadius);
    if (borderRadius > 0) {
      styles.borderRadius = borderRadius;
    }
    
    const borderWidth = parseFloat(computed.borderWidth);
    if (borderWidth > 0) {
      styles.borderWidth = borderWidth;
      if (computed.borderColor) {
        styles.borderColor = rgbToHex(computed.borderColor);
      }
    }
    
    // Shadows
    if (computed.boxShadow && computed.boxShadow !== 'none') {
      const shadow = parseBoxShadow(computed.boxShadow);
      if (shadow) {
        styles.shadowColor = shadow.color;
        styles.shadowOffset = shadow.offset;
        styles.shadowOpacity = shadow.opacity;
        styles.shadowRadius = shadow.blur;
      }
    }
    
    // Position
    if (computed.position && computed.position !== 'static') {
      styles.position = computed.position === 'fixed' ? 'absolute' : computed.position;
      if (computed.top && computed.top !== 'auto') styles.top = parseFloat(computed.top);
      if (computed.bottom && computed.bottom !== 'auto') styles.bottom = parseFloat(computed.bottom);
      if (computed.left && computed.left !== 'auto') styles.left = parseFloat(computed.left);
      if (computed.right && computed.right !== 'auto') styles.right = parseFloat(computed.right);
      if (computed.zIndex && computed.zIndex !== 'auto') styles.zIndex = parseInt(computed.zIndex);
    }
    
    // Overflow
    if (computed.overflow && computed.overflow !== 'visible') {
      styles.overflow = computed.overflow;
    }
    
    return styles;
  }
  
  /**
   * Convert RGB/RGBA to hex
   */
  function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    const r = parseInt(match[0]).toString(16).padStart(2, '0');
    const g = parseInt(match[1]).toString(16).padStart(2, '0');
    const b = parseInt(match[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  
  /**
   * Parse box-shadow CSS property
   */
  function parseBoxShadow(shadow) {
    const match = shadow.match(/([\d.]+)px\s+([\d.]+)px\s+([\d.]+)px\s+([\d.]+)px\s+(.+)/);
    if (!match) return null;
    
    const [, offsetX, offsetY, blur, spread, color] = match;
    return {
      offset: { width: parseFloat(offsetX), height: parseFloat(offsetY) },
      blur: parseFloat(blur),
      opacity: 0.3,
      color: rgbToHex(color)
    };
  }
  
  /**
   * Determine component type from element
   */
  function getComponentType(element) {
    const tag = element.tagName.toLowerCase();
    
    // Map HTML tags to component types
    const typeMap = {
      'div': 'div',
      'span': 'span',
      'p': 'p',
      'h1': 'h1',
      'h2': 'h2',
      'h3': 'h3',
      'h4': 'h4',
      'h5': 'h5',
      'h6': 'h6',
      'button': 'button',
      'a': 'a',
      'section': 'section',
      'article': 'article',
      'header': 'header',
      'footer': 'footer',
      'nav': 'nav',
      'main': 'main',
      'aside': 'aside',
      'input': 'input',
      'textarea': 'textarea',
      'label': 'label',
      'form': 'form',
      'img': 'img',
      'ul': 'ul',
      'ol': 'ol',
      'li': 'li'
    };
    
    return typeMap[tag] || 'div';
  }
  
  /**
   * Get element name
   */
  function getElementName(element) {
    if (element.id) return element.id;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) return classes[0];
    }
    return element.tagName.toLowerCase();
  }
  
  /**
   * Check if element is text node
   */
  function isTextElement(element) {
    const textTags = ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'label', 'button'];
    return textTags.includes(element.tagName.toLowerCase());
  }
  
  /**
   * Extract node tree from element
   */
  function extractNode(element, depth = 0, maxDepth = 10) {
    if (depth > maxDepth) return null;
    if (!element || element.nodeType !== 1) return null;
    
    // Skip script, style, and hidden elements
    const computed = window.getComputedStyle(element);
    if (computed.display === 'none' || computed.visibility === 'hidden') return null;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK'].includes(element.tagName)) return null;
    
    const node = {
      type: getComponentType(element),
      name: getElementName(element),
      styles: extractStyles(element)
    };
    
    // Extract text content for text elements
    if (isTextElement(element)) {
      const text = Array.from(element.childNodes)
        .filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim())
        .join(' ')
        .trim();
      
      if (text) {
        node.text = text;
      }
    }
    
    // Extract image source
    if (element.tagName === 'IMG') {
      node.source = element.src;
    }
    
    // Extract input placeholder
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      node.placeholder = element.placeholder || '';
    }
    
    // Extract link href
    if (element.tagName === 'A') {
      node.href = element.href;
    }
    
    // Extract children
    const children = [];
    for (const child of element.children) {
      const childNode = extractNode(child, depth + 1, maxDepth);
      if (childNode) {
        children.push(childNode);
      }
    }
    
    if (children.length > 0) {
      node.children = children;
    }
    
    return node;
  }
  
  /**
   * Extract from selected element or prompt user
   */
  function extract() {
    console.log('🔍 Code to Figma - Web Extractor');
    console.log('================================\n');
    
    let element = document.querySelector('.selected-for-figma');
    
    if (!element) {
      const selector = prompt('Enter CSS selector for the element to extract (e.g., .card, #hero, main):');
      if (!selector) {
        console.log('❌ No selector provided');
        return;
      }
      element = document.querySelector(selector);
    }
    
    if (!element) {
      console.log('❌ Element not found');
      return;
    }
    
    console.log('✅ Extracting from:', element);
    
    const component = extractNode(element);
    
    if (!component) {
      console.log('❌ Failed to extract component');
      return;
    }
    
    const data = {
      component,
      metadata: {
        appName: document.title || 'Web Page',
        framework: 'Web (HTML/CSS)',
        version: '1.0',
        url: window.location.href,
        date: new Date().toISOString().split('T')[0]
      }
    };
    
    console.log('\n✅ Extraction complete!');
    console.log('\n📋 Copy this JSON and paste it into the Code to Figma plugin:\n');
    console.log(JSON.stringify(data, null, 2));
    
    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        .then(() => console.log('\n✅ JSON copied to clipboard!'))
        .catch(() => console.log('\n⚠️  Could not copy to clipboard automatically'));
    }
    
    return data;
  }
  
  return extract();
})();
