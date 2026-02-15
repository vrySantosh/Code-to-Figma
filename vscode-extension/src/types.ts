// Type definitions for Code to Figma schema

export interface StyleData {
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
  elevation?: number;
  
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

export type ComponentType = 
  // React Native
  | 'View' | 'Text' | 'Image' | 'ScrollView' | 'TextInput' | 'Button' 
  | 'TouchableOpacity' | 'FlatList' | 'SafeAreaView'
  // Web HTML
  | 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'button' | 'input' | 'textarea' | 'label' | 'a' | 'img'
  | 'header' | 'footer' | 'section' | 'article' | 'nav' | 'aside'
  | 'ul' | 'ol' | 'li' | 'form';

export interface ComponentNode {
  type: ComponentType;
  name?: string;
  text?: string;
  src?: string; // for images
  styles?: StyleData;
  children?: ComponentNode[];
  props?: Record<string, any>;
}

export interface ComponentSchema {
  component: ComponentNode;
  metadata?: {
    appName?: string;
    framework?: 'React Native' | 'React' | 'HTML' | 'Vue' | 'Angular';
    version?: string;
    fileName?: string;
    exportedAt?: string;
  };
}

export interface SyncedNode {
  id: string;
  figmaNodeId: string;
  filePath: string;
  componentName: string;
  lastSync: string;
  schema: ComponentSchema;
}

export interface FigmaPluginMessage {
  type: 'export' | 'sync' | 'update' | 'response';
  data: ComponentSchema;
  nodeId?: string;
  syncedNodes?: SyncedNode[];
}

export interface FigmaAPIResponse {
  nodeId: string;
  success: boolean;
  message?: string;
}
