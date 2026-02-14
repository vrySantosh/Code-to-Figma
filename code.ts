// Figma Plugin: Code to Figma
// Comprehensive support for all React Native components and styles

interface StyleData {
  // Colors & Backgrounds
  backgroundColor?: string;
  color?: string;
  opacity?: number;
  
  // Typography
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Layout & Sizing
  width?: number | string;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  
  // Flexbox
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  alignItems?: string;
  alignSelf?: string;
  alignContent?: string;
  justifyContent?: string;
  
  // Spacing
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  
  // Borders
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  
  // Shadows & Effects
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android elevation
  
  // Position
  position?: 'absolute' | 'relative';
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  zIndex?: number;
  
  // Transform
  transform?: Array<Record<string, any>>;
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll';
  
  // Tint (for images/icons)
  tintColor?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

interface RNComponentNode {
  type: 
    // Core Components (React Native)
    | 'View' 
    | 'Text' 
    | 'TextInput'
    | 'Image'
    | 'ScrollView'
    | 'FlatList'
    | 'SectionList'
    // Touchables (React Native)
    | 'Pressable' 
    | 'TouchableOpacity'
    | 'TouchableHighlight'
    | 'TouchableWithoutFeedback'
    // Form Controls (React Native)
    | 'Switch'
    | 'Slider'
    | 'Picker'
    // Indicators (React Native)
    | 'ActivityIndicator'
    | 'ProgressBar'
    // Safe Areas (React Native)
    | 'SafeAreaView'
    | 'KeyboardAvoidingView'
    // Custom (React Native)
    | 'Icon'
    | 'LinearGradient'
    | 'Modal'
    // Web HTML Elements
    | 'div'
    | 'span'
    | 'p'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'button'
    | 'a'
    | 'section'
    | 'article'
    | 'header'
    | 'footer'
    | 'nav'
    | 'main'
    | 'aside'
    | 'input'
    | 'textarea'
    | 'label'
    | 'form'
    | 'img'
    | 'ul'
    | 'ol'
    | 'li';
  
  styles: StyleData;
  children?: RNComponentNode[];
  
  // Text content
  text?: string;
  placeholder?: string;
  
  // Image props
  source?: string | { uri: string };
  
  // Icon props
  svgData?: string;
  iconName?: string;
  iconFamily?: string;
  
  // List props
  data?: any[];
  renderItem?: string;
  
  // Gradient props
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  
  // Metadata
  name: string;
  componentProps?: Record<string, any>;
}

interface DesignData {
  component: RNComponentNode;
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  spacing?: Record<string, number>;
  metadata?: {
    appName?: string;
    framework?: string;
    version?: string;
  };
}

interface TargetDimensions {
  width: number;
  height: number;
}

interface ProcessingContext {
  targetDimensions?: TargetDimensions;
  scaleFactor?: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Convert hex color to Figma RGB format */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/** Calculate scale factor to fit component into target dimensions */
function calculateScaleFactor(componentWidth: number, componentHeight: number, target?: TargetDimensions): number {
  if (!target) return 1;
  
  const scaleX = target.width / componentWidth;
  const scaleY = target.height / componentHeight;
  
  // Use the smaller scale to ensure the component fits within target dimensions
  return Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed
}

/** Scale a dimension value based on scale factor */
function scaleDimension(value: number | undefined, scaleFactor: number): number | undefined {
  if (value === undefined) return undefined;
  return Math.round(value * scaleFactor);
}

/** Scale style object based on scale factor */
function scaleStyles(styles: StyleData, scaleFactor: number): StyleData {
  if (scaleFactor === 1) return styles;
  
  const scaled: StyleData = { ...styles };
  
  // Scale dimensions
  if (typeof scaled.width === 'number') scaled.width = scaleDimension(scaled.width, scaleFactor)!;
  if (scaled.height) scaled.height = scaleDimension(scaled.height, scaleFactor)!;
  if (scaled.minWidth) scaled.minWidth = scaleDimension(scaled.minWidth, scaleFactor)!;
  if (scaled.minHeight) scaled.minHeight = scaleDimension(scaled.minHeight, scaleFactor)!;
  if (scaled.maxWidth) scaled.maxWidth = scaleDimension(scaled.maxWidth, scaleFactor)!;
  if (scaled.maxHeight) scaled.maxHeight = scaleDimension(scaled.maxHeight, scaleFactor)!;
  
  // Scale spacing
  if (scaled.padding) scaled.padding = scaleDimension(scaled.padding, scaleFactor)!;
  if (scaled.paddingTop) scaled.paddingTop = scaleDimension(scaled.paddingTop, scaleFactor)!;
  if (scaled.paddingBottom) scaled.paddingBottom = scaleDimension(scaled.paddingBottom, scaleFactor)!;
  if (scaled.paddingLeft) scaled.paddingLeft = scaleDimension(scaled.paddingLeft, scaleFactor)!;
  if (scaled.paddingRight) scaled.paddingRight = scaleDimension(scaled.paddingRight, scaleFactor)!;
  if (scaled.paddingHorizontal) scaled.paddingHorizontal = scaleDimension(scaled.paddingHorizontal, scaleFactor)!;
  if (scaled.paddingVertical) scaled.paddingVertical = scaleDimension(scaled.paddingVertical, scaleFactor)!;
  
  if (scaled.margin) scaled.margin = scaleDimension(scaled.margin, scaleFactor)!;
  if (scaled.marginTop) scaled.marginTop = scaleDimension(scaled.marginTop, scaleFactor)!;
  if (scaled.marginBottom) scaled.marginBottom = scaleDimension(scaled.marginBottom, scaleFactor)!;
  if (scaled.marginLeft) scaled.marginLeft = scaleDimension(scaled.marginLeft, scaleFactor)!;
  if (scaled.marginRight) scaled.marginRight = scaleDimension(scaled.marginRight, scaleFactor)!;
  if (scaled.marginHorizontal) scaled.marginHorizontal = scaleDimension(scaled.marginHorizontal, scaleFactor)!;
  if (scaled.marginVertical) scaled.marginVertical = scaleDimension(scaled.marginVertical, scaleFactor)!;
  
  if (scaled.gap) scaled.gap = scaleDimension(scaled.gap, scaleFactor)!;
  if (scaled.rowGap) scaled.rowGap = scaleDimension(scaled.rowGap, scaleFactor)!;
  if (scaled.columnGap) scaled.columnGap = scaleDimension(scaled.columnGap, scaleFactor)!;
  
  // Scale borders
  if (scaled.borderRadius) scaled.borderRadius = scaleDimension(scaled.borderRadius, scaleFactor)!;
  if (scaled.borderTopLeftRadius) scaled.borderTopLeftRadius = scaleDimension(scaled.borderTopLeftRadius, scaleFactor)!;
  if (scaled.borderTopRightRadius) scaled.borderTopRightRadius = scaleDimension(scaled.borderTopRightRadius, scaleFactor)!;
  if (scaled.borderBottomLeftRadius) scaled.borderBottomLeftRadius = scaleDimension(scaled.borderBottomLeftRadius, scaleFactor)!;
  if (scaled.borderBottomRightRadius) scaled.borderBottomRightRadius = scaleDimension(scaled.borderBottomRightRadius, scaleFactor)!;
  
  if (scaled.borderWidth) scaled.borderWidth = scaleDimension(scaled.borderWidth, scaleFactor)!;
  if (scaled.borderTopWidth) scaled.borderTopWidth = scaleDimension(scaled.borderTopWidth, scaleFactor)!;
  if (scaled.borderBottomWidth) scaled.borderBottomWidth = scaleDimension(scaled.borderBottomWidth, scaleFactor)!;
  if (scaled.borderLeftWidth) scaled.borderLeftWidth = scaleDimension(scaled.borderLeftWidth, scaleFactor)!;
  if (scaled.borderRightWidth) scaled.borderRightWidth = scaleDimension(scaled.borderRightWidth, scaleFactor)!;
  
  // Scale font size
  if (scaled.fontSize) scaled.fontSize = scaleDimension(scaled.fontSize, scaleFactor)!;
  if (scaled.lineHeight) scaled.lineHeight = scaleDimension(scaled.lineHeight, scaleFactor)!;
  if (scaled.letterSpacing) scaled.letterSpacing = scaleDimension(scaled.letterSpacing, scaleFactor)!;
  
  // Scale shadows
  if (scaled.shadowRadius) scaled.shadowRadius = scaleDimension(scaled.shadowRadius, scaleFactor)!;
  if (scaled.shadowOffset) {
    scaled.shadowOffset = {
      width: scaleDimension(scaled.shadowOffset.width, scaleFactor)!,
      height: scaleDimension(scaled.shadowOffset.height, scaleFactor)!
    };
  }
  
  // Scale position
  if (scaled.top) scaled.top = scaleDimension(scaled.top, scaleFactor)!;
  if (scaled.bottom) scaled.bottom = scaleDimension(scaled.bottom, scaleFactor)!;
  if (scaled.left) scaled.left = scaleDimension(scaled.left, scaleFactor)!;
  if (scaled.right) scaled.right = scaleDimension(scaled.right, scaleFactor)!;
  
  return scaled;
}

/** Load font with comprehensive fallback strategy */
async function loadFontWithFallback(fontFamily: string, fontWeight?: string, fontStyle?: string): Promise<FontName> {
  const isItalic = fontStyle === 'italic';
  
  // Map font weights to style names
  const weightVariations: string[][] = [];
  
  if (fontWeight === '900' || fontWeight === 'black') {
    weightVariations.push(['Black'], ['ExtraBold'], ['Bold'], ['SemiBold'], ['Medium'], ['Regular']);
  } else if (fontWeight === '800' || fontWeight === 'extra-bold') {
    weightVariations.push(['ExtraBold'], ['Extra Bold'], ['Bold'], ['SemiBold'], ['Medium'], ['Regular']);
  } else if (fontWeight === '700' || fontWeight === 'bold') {
    weightVariations.push(['Bold'], ['SemiBold'], ['Semi Bold'], ['Medium'], ['Regular']);
  } else if (fontWeight === '600' || fontWeight === 'semi-bold') {
    weightVariations.push(['SemiBold'], ['Semi Bold'], ['Semibold'], ['Bold'], ['Medium'], ['Regular']);
  } else if (fontWeight === '500' || fontWeight === 'medium') {
    weightVariations.push(['Medium'], ['Regular']);
  } else if (fontWeight === '300' || fontWeight === 'light') {
    weightVariations.push(['Light'], ['Regular']);
  } else if (fontWeight === '200' || fontWeight === 'extra-light') {
    weightVariations.push(['ExtraLight'], ['Extra Light'], ['Light'], ['Regular']);
  } else if (fontWeight === '100' || fontWeight === 'thin') {
    weightVariations.push(['Thin'], ['ExtraLight'], ['Light'], ['Regular']);
  } else {
    weightVariations.push(['Regular']);
  }
  
  // Add italic variations if needed
  const styleVariations: string[] = [];
  if (isItalic) {
    weightVariations.forEach(weights => {
      weights.forEach(weight => {
        styleVariations.push(`${weight} Italic`);
        styleVariations.push(`${weight}Italic`);
      });
    });
    styleVariations.push('Italic');
  }
  
  // Flatten all variations
  const flatWeights: string[] = [];
  weightVariations.forEach(arr => flatWeights.push(...arr));
  const allVariations = [...styleVariations, ...flatWeights];
  
  // Try each variation with the specified font family
  for (const style of allVariations) {
    try {
      await figma.loadFontAsync({ family: fontFamily, style });
      return { family: fontFamily, style };
    } catch (error) {
      // Continue to next variation
    }
  }
  
  // Fallback to Inter (always available in Figma)
  console.warn(`Font ${fontFamily} ${fontWeight} ${fontStyle} not available, falling back to Inter`);
  for (const style of allVariations) {
    try {
      await figma.loadFontAsync({ family: 'Inter', style });
      return { family: 'Inter', style };
    } catch (error) {
      // Continue
    }
  }
  
  // Last resort: Inter Regular
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  return { family: 'Inter', style: 'Regular' };
}

/** Convert React Native alignment to Figma */
function convertAlignment(align: string): 'MIN' | 'CENTER' | 'MAX' {
  switch (align) {
    case 'flex-start':
    case 'start':
      return 'MIN';
    case 'center':
      return 'CENTER';
    case 'flex-end':
    case 'end':
      return 'MAX';
    case 'stretch':
      // Stretch is handled separately for counterAxisAlignItems
      return 'MIN';
    default:
      return 'MIN';
  }
}

/** Convert React Native justifyContent to Figma */
function convertJustifyContent(justify: string): 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN' {
  switch (justify) {
    case 'flex-start':
    case 'start':
      return 'MIN';
    case 'center':
      return 'CENTER';
    case 'flex-end':
    case 'end':
      return 'MAX';
    case 'space-between':
      return 'SPACE_BETWEEN';
    default:
      return 'MIN';
  }
}

/** Create shadow effect from React Native shadow props */
function createShadow(styles: StyleData): Effect | null {
  if (!styles.shadowColor && !styles.elevation) return null;
  
  // Handle Android elevation (convert to iOS-like shadow)
  if (styles.elevation) {
    const elevation = styles.elevation;
    return {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 + (elevation * 0.02) },
      offset: { x: 0, y: elevation / 2 },
      radius: elevation,
      visible: true,
      blendMode: 'NORMAL',
    };
  }
  
  // Handle iOS shadow props
  if (styles.shadowColor) {
    const rgb = hexToRgb(styles.shadowColor);
    return {
      type: 'DROP_SHADOW',
      color: { ...rgb, a: styles.shadowOpacity || 0.3 },
      offset: {
        x: styles.shadowOffset?.width || 0,
        y: styles.shadowOffset?.height || 2,
      },
      radius: styles.shadowRadius || 4,
      visible: true,
      blendMode: 'NORMAL',
    };
  }
  
  return null;
}

/** Create SVG node from SVG data */
async function createSvgNode(svgData: string, name: string, width: number, height: number): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.fills = [];
  
  try {
    const svgNode = figma.createNodeFromSvg(svgData);
    
    // Scale to desired size
    const scaleX = width / svgNode.width;
    const scaleY = height / svgNode.height;
    const scale = Math.min(scaleX, scaleY);
    
    svgNode.resize(svgNode.width * scale, svgNode.height * scale);
    
    // Center in frame
    svgNode.x = (width - svgNode.width) / 2;
    svgNode.y = (height - svgNode.height) / 2;
    
    frame.appendChild(svgNode);
  } catch (error) {
    console.error('Failed to create SVG:', error);
    // Create placeholder text instead
    const text = figma.createText();
    text.characters = `[Icon: ${name}]`;
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    text.fontName = { family: 'Inter', style: 'Regular' };
    text.fontSize = 12;
    frame.appendChild(text);
  }
  
  return frame;
}

/** Apply border radius (handles individual corners) */
function applyBorderRadius(node: FrameNode | RectangleNode, styles: StyleData) {
  if (styles.borderTopLeftRadius !== undefined ||
      styles.borderTopRightRadius !== undefined ||
      styles.borderBottomLeftRadius !== undefined ||
      styles.borderBottomRightRadius !== undefined) {
    // Individual corner radii
    node.topLeftRadius = styles.borderTopLeftRadius || 0;
    node.topRightRadius = styles.borderTopRightRadius || 0;
    node.bottomLeftRadius = styles.borderBottomLeftRadius || 0;
    node.bottomRightRadius = styles.borderBottomRightRadius || 0;
  } else if (styles.borderRadius !== undefined) {
    // Uniform border radius
    node.cornerRadius = styles.borderRadius;
  }
}

/** Apply padding to a frame */
function applyPadding(frame: FrameNode, styles: StyleData) {
  const paddingTop = styles.paddingTop ?? styles.paddingVertical ?? styles.padding ?? 0;
  const paddingBottom = styles.paddingBottom ?? styles.paddingVertical ?? styles.padding ?? 0;
  const paddingLeft = styles.paddingLeft ?? styles.paddingHorizontal ?? styles.padding ?? 0;
  const paddingRight = styles.paddingRight ?? styles.paddingHorizontal ?? styles.padding ?? 0;
  
  frame.paddingTop = paddingTop;
  frame.paddingBottom = paddingBottom;
  frame.paddingLeft = paddingLeft;
  frame.paddingRight = paddingRight;
}

// ============================================================================
// COMPONENT CREATORS
// ============================================================================

/** Create Image component */
async function createImageNode(node: RNComponentNode, context?: ProcessingContext): Promise<FrameNode> {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  
  const frame = figma.createFrame();
  frame.name = node.name;
  
  const width = typeof scaledStyles.width === 'number' ? scaledStyles.width : Math.round(100 * scaleFactor);
  const height = scaledStyles.height || Math.round(100 * scaleFactor);
  frame.resize(width, height);
  
  // Add placeholder for image
  const rect = figma.createRectangle();
  rect.name = 'Image Placeholder';
  rect.resize(width, height);
  rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  
  const text = figma.createText();
  text.name = 'Source';
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  text.fontName = { family: 'Inter', style: 'Regular' };
  text.fontSize = Math.round(10 * scaleFactor);
  
  const source = typeof node.source === 'string' ? node.source : (node.source as any)?.uri || 'Image';
  text.characters = `📷 ${source}`;
  text.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
  
  frame.appendChild(rect);
  text.x = Math.round(8 * scaleFactor);
  text.y = Math.round(8 * scaleFactor);
  frame.appendChild(text);
  
  applyBorderRadius(frame, scaledStyles);
  
  if (scaledStyles.backgroundColor) {
    frame.fills = [{ type: 'SOLID', color: hexToRgb(scaledStyles.backgroundColor) }];
  }
  
  return frame;
}

/** Create LinearGradient component */
function createGradientNode(node: RNComponentNode, context?: ProcessingContext): FrameNode {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  const frame = figma.createFrame();
  frame.name = node.name;
  
  const width = typeof scaledStyles.width === 'number' ? scaledStyles.width : Math.round(375 * scaleFactor);
  const height = scaledStyles.height || Math.round(100 * scaleFactor);
  frame.resize(width, height);
  
  if (node.colors && node.colors.length >= 2) {
    const gradientStops: ColorStop[] = node.colors.map((color, index) => ({
      color: { ...hexToRgb(color), a: 1 },
      position: index / (node.colors!.length - 1),
    }));
    
    frame.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientStops,
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
    }];
  }
  
  return frame;
}

/** Create TextInput component */
async function createTextInputNode(node: RNComponentNode, context?: ProcessingContext): Promise<FrameNode> {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  const inputFrame = figma.createFrame();
  inputFrame.name = node.name;
  
  const width = typeof scaledStyles.width === 'number' ? scaledStyles.width : Math.round(327 * scaleFactor);
  const height = scaledStyles.height || Math.round(50 * scaleFactor);
  inputFrame.resize(width, height);
  
  if (scaledStyles.backgroundColor) {
    inputFrame.fills = [{ type: 'SOLID', color: hexToRgb(scaledStyles.backgroundColor) }];
  }
  
  if (scaledStyles.borderWidth && scaledStyles.borderColor) {
    inputFrame.strokeWeight = scaledStyles.borderWidth;
    inputFrame.strokes = [{ type: 'SOLID', color: hexToRgb(scaledStyles.borderColor) }];
  }
  
  applyBorderRadius(inputFrame, scaledStyles);
  
  // Create placeholder text
  const placeholderText = figma.createText();
  placeholderText.name = 'Placeholder';
  placeholderText.characters = node.placeholder || node.text || 'Input';
  
  const fontFamily = scaledStyles.fontFamily || 'Inter';
  const fontStyle = await loadFontWithFallback(fontFamily, scaledStyles.fontWeight);
  placeholderText.fontName = fontStyle;
  
  if (scaledStyles.fontSize) {
    placeholderText.fontSize = scaledStyles.fontSize;
  }
  
  const placeholderColor = '#999999';
  placeholderText.fills = [{ type: 'SOLID', color: hexToRgb(placeholderColor) }];
  
  const paddingLeft = scaledStyles.paddingHorizontal || scaledStyles.paddingLeft || Math.round(16 * scaleFactor);
  const paddingTop = scaledStyles.paddingVertical || scaledStyles.paddingTop || Math.round(14 * scaleFactor);
  placeholderText.x = paddingLeft;
  placeholderText.y = paddingTop;
  
  inputFrame.appendChild(placeholderText);
  
  return inputFrame;
}

/** Create Text component */
async function createTextNode(node: RNComponentNode, context?: ProcessingContext): Promise<TextNode> {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  const textNode = figma.createText();
  textNode.name = node.name;
  
  textNode.characters = node.text || 'Text';
  
  const fontFamily = scaledStyles.fontFamily || 'Inter';
  const fontStyle = await loadFontWithFallback(
    fontFamily,
    scaledStyles.fontWeight,
    scaledStyles.fontStyle
  );
  textNode.fontName = fontStyle;
  
  if (scaledStyles.fontSize) {
    textNode.fontSize = scaledStyles.fontSize;
  }
  
  if (scaledStyles.lineHeight) {
    textNode.lineHeight = { value: scaledStyles.lineHeight, unit: 'PIXELS' };
  }
  
  if (scaledStyles.letterSpacing) {
    textNode.letterSpacing = { value: scaledStyles.letterSpacing, unit: 'PIXELS' };
  }
  
  if (scaledStyles.textAlign) {
    textNode.textAlignHorizontal = scaledStyles.textAlign.toUpperCase() as any;
  }
  
  if (scaledStyles.textTransform === 'uppercase') {
    textNode.characters = textNode.characters.toUpperCase();
  } else if (scaledStyles.textTransform === 'lowercase') {
    textNode.characters = textNode.characters.toLowerCase();
  } else if (scaledStyles.textTransform === 'capitalize') {
    textNode.characters = textNode.characters.replace(/\b\w/g, c => c.toUpperCase());
  }
  
  if (scaledStyles.textDecorationLine && scaledStyles.textDecorationLine !== 'none') {
    textNode.textDecoration = scaledStyles.textDecorationLine.includes('underline') ? 'UNDERLINE' : 'NONE';
    if (scaledStyles.textDecorationLine.includes('line-through')) {
      textNode.textDecoration = 'STRIKETHROUGH';
    }
  }
  
  if (scaledStyles.color) {
    textNode.fills = [{ type: 'SOLID', color: hexToRgb(scaledStyles.color) }];
  }
  
  if (scaledStyles.opacity !== undefined) {
    textNode.opacity = scaledStyles.opacity;
  }
  
  return textNode;
}

/** Create main frame-based component (View, ScrollView, etc.) */
async function createFrameNode(node: RNComponentNode, data: DesignData, context?: ProcessingContext): Promise<FrameNode> {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  
  const frame = figma.createFrame();
  frame.name = node.name;
  
  // Set layout mode
  const flexDir = scaledStyles.flexDirection || 'column';
  if (flexDir === 'row' || flexDir === 'row-reverse') {
    frame.layoutMode = 'HORIZONTAL';
  } else {
    frame.layoutMode = 'VERTICAL';
  }
  
  // Set alignment
  if (scaledStyles.alignItems) {
    if (scaledStyles.alignItems === 'stretch') {
      // In Figma, 'STRETCH' is a valid value for counterAxisAlignItems
      frame.counterAxisAlignItems = 'MIN';
      frame.counterAxisSizingMode = 'AUTO';
    } else {
      frame.counterAxisAlignItems = convertAlignment(scaledStyles.alignItems);
    }
  }
  
  if (scaledStyles.justifyContent) {
    frame.primaryAxisAlignItems = convertJustifyContent(scaledStyles.justifyContent);
  }
  
  // Set spacing
  if (scaledStyles.gap) {
    frame.itemSpacing = scaledStyles.gap;
  }
  
  // Apply padding
  applyPadding(frame, scaledStyles);
  
  // Set size - only use target dimensions for flex containers without explicit width
  let width: number;
  if (typeof scaledStyles.width === 'number') {
    // Explicit width specified
    width = scaledStyles.width;
  } else if (scaledStyles.flex && context?.targetDimensions?.width) {
    // Flex container without width - use device width
    width = context.targetDimensions.width;
  } else {
    // Default fallback
    width = 375;
  }
  let height = scaledStyles.height || 100;
  
  frame.resize(width, height);
  
  // Set background
  if (scaledStyles.backgroundColor) {
    frame.fills = [{ type: 'SOLID', color: hexToRgb(scaledStyles.backgroundColor) }];
  } else {
    frame.fills = [];
  }
  
  // Apply opacity
  if (scaledStyles.opacity !== undefined) {
    frame.opacity = scaledStyles.opacity;
  }
  
  // Apply border radius
  applyBorderRadius(frame, scaledStyles);
  
  // Apply border
  if (scaledStyles.borderWidth && scaledStyles.borderColor) {
    frame.strokeWeight = scaledStyles.borderWidth;
    frame.strokes = [{ type: 'SOLID', color: hexToRgb(scaledStyles.borderColor) }];
    
    if (scaledStyles.borderStyle === 'dashed') {
      frame.dashPattern = [5, 5];
    } else if (scaledStyles.borderStyle === 'dotted') {
      frame.dashPattern = [2, 2];
    }
  }
  
  // Apply shadow
  const shadow = createShadow(scaledStyles);
  if (shadow) {
    frame.effects = [shadow];
  }
  
  // Create children (pass scaleFactor and targetDimensions to children)
  if (node.children) {
    const childContext: ProcessingContext = {
      scaleFactor: scaleFactor,
      targetDimensions: context?.targetDimensions
    };
    for (const child of node.children) {
      const childNode = await createFigmaNode(child, data, childContext);
      frame.appendChild(childNode);
    }
  }
  
  // Set flex grow
  if (scaledStyles.flex) {
    frame.layoutGrow = scaledStyles.flex;
  }
  
  // Set layoutAlign only when explicitly specified in alignSelf
  if (scaledStyles.alignSelf === 'stretch') {
    frame.layoutAlign = 'STRETCH';
  } else if (scaledStyles.alignSelf) {
    const alignment = convertAlignment(scaledStyles.alignSelf);
    if (alignment !== 'MIN') {
      frame.layoutAlign = alignment;
    }
  }
  
  // Handle overflow
  if (scaledStyles.overflow === 'hidden') {
    frame.clipsContent = true;
  }
  
  return frame;
}

/** Normalize web HTML elements to React Native equivalents for processing */
function normalizeWebElement(type: RNComponentNode['type']): RNComponentNode['type'] {
  // Web text elements → Text
  if (['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'a'].includes(type)) {
    return 'Text';
  }
  // Web button → Pressable
  if (type === 'button') {
    return 'Pressable';
  }
  // Web input → TextInput
  if (type === 'input' || type === 'textarea') {
    return 'TextInput';
  }
  // Web image → Image
  if (type === 'img') {
    return 'Image';
  }
  // Web containers → View
  if (['div', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside', 'form', 'ul', 'ol', 'li'].includes(type)) {
    return 'View';
  }
  // Return original if not a web element
  return type;
}

/** Main router to create appropriate Figma node */
async function createFigmaNode(node: RNComponentNode, data: DesignData, context?: ProcessingContext): Promise<SceneNode> {
  const scaleFactor = context?.scaleFactor || 1;
  const scaledStyles = scaleStyles(node.styles, scaleFactor);
  
  // Normalize web elements to React Native equivalents
  const normalizedType = normalizeWebElement(node.type);

  // Handle Icon type
  if (normalizedType === 'Icon' && node.svgData) {
    const width = typeof scaledStyles.width === 'number' ? scaledStyles.width : Math.round(24 * scaleFactor);
    const height = typeof scaledStyles.height === 'number' ? scaledStyles.height : Math.round(24 * scaleFactor);
    return await createSvgNode(node.svgData, node.name, width, height);
  }

  // Handle Image
  if (normalizedType === 'Image') {
    return await createImageNode(node, context);
  }

  // Handle LinearGradient
  if (normalizedType === 'LinearGradient') {
    return createGradientNode(node, context);
  }

  // Handle TextInput
  if (normalizedType === 'TextInput') {
    return await createTextInputNode(node, context);
  }
  
  // Handle Text
  if (normalizedType === 'Text') {
    return await createTextNode(node, context);
  }

  // Handle ActivityIndicator
  if (normalizedType === 'ActivityIndicator') {
    const frame = figma.createFrame();
    frame.name = node.name;
    const size = Math.round(40 * scaleFactor);
    frame.resize(size, size);
    frame.fills = [];
    
    const circleSize = Math.round(30 * scaleFactor);
    const circle = figma.createEllipse();
    circle.resize(circleSize, circleSize);
    circle.x = Math.round(5 * scaleFactor);
    circle.y = Math.round(5 * scaleFactor);
    circle.fills = [];
    circle.strokes = [{ type: 'SOLID', color: hexToRgb(scaledStyles.color || '#007AFF') }];
    circle.strokeWeight = Math.round(3 * scaleFactor);
    circle.dashPattern = [5, 5];
    
    frame.appendChild(circle);
    return frame;
  }

  // Handle FlatList / ScrollView
  if (normalizedType === 'FlatList' || normalizedType === 'ScrollView') {
    const frame = await createFrameNode(node, data, context);
    frame.name = `${node.type} - ${node.name}`;
    
    // Add scroll indicator
    const text = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    text.fontName = { family: 'Inter', style: 'Medium' };
    text.fontSize = Math.round(10 * scaleFactor);
    text.characters = node.type === 'FlatList' ? '📋 List' : '⬇️ Scrollable';
    text.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
    text.x = Math.round(8 * scaleFactor);
    text.y = Math.round(8 * scaleFactor);
    frame.appendChild(text);
    
    return frame;
  }

  // All other frame-based components
  return await createFrameNode(node, data, context);
}

// ============================================================================
// MAIN PLUGIN CODE
// ============================================================================

figma.showUI(__html__, { width: 540, height: 680, title: 'Code to Figma' });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-design') {
    try {
      const data: DesignData = msg.data;
      const targetDimensions: TargetDimensions | undefined = msg.targetDimensions;
      
      // Pre-load common fonts
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
      await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
      await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
      
      console.log('🎨 Starting import...');
      console.log('App:', data.metadata?.appName || 'Unknown');
      console.log('Framework:', data.metadata?.framework || 'React Native');
      
      // Calculate scale factor if target dimensions provided
      let scaleFactor = 1;
      if (targetDimensions) {
        const componentWidth = typeof data.component.styles.width === 'number' 
          ? data.component.styles.width 
          : 375;
        const componentHeight = data.component.styles.height || 844;
        
        scaleFactor = calculateScaleFactor(componentWidth, componentHeight, targetDimensions);
        console.log(`📐 Scaling from ${componentWidth}×${componentHeight} to ${targetDimensions.width}×${targetDimensions.height} (factor: ${scaleFactor.toFixed(2)})`);
      }
      
      // Create context with target dimensions and scale factor
      const context: ProcessingContext = {
        targetDimensions,
        scaleFactor
      };
      
      // Create main frame
      const mainFrame = await createFigmaNode(data.component, data, context) as FrameNode;
      
      // Override dimensions for root frame if target dimensions provided
      if (targetDimensions) {
        mainFrame.resize(targetDimensions.width, targetDimensions.height);
      }
      
      const frameName = data.metadata?.appName 
        ? `${data.metadata.appName} - ${data.component.name}`
        : `${data.component.name} (React Native)`;
      mainFrame.name = frameName;
      
      // Add to current page
      figma.currentPage.appendChild(mainFrame);
      
      // Center in viewport
      figma.viewport.scrollAndZoomIntoView([mainFrame]);
      
      const componentCount = countComponents(data.component);
      const deviceInfo = targetDimensions 
        ? ` (${targetDimensions.width}×${targetDimensions.height})`
        : '';
      figma.notify(`✅ Imported ${componentCount} components${deviceInfo} successfully!`);
      console.log('✅ Import complete!');
    } catch (error: any) {
      figma.notify(`❌ Error: ${error?.message || 'Unknown error'}`);
      console.error('Import error:', error);
    }
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Helper to count components
function countComponents(node: RNComponentNode): number {
  let count = 1;
  if (node.children) {
    node.children.forEach(child => {
      count += countComponents(child);
    });
  }
  return count;
}
