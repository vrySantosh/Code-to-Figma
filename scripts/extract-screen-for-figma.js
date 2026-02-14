#!/usr/bin/env node

/**
 * Extract React Native screen components and convert to Figma-compatible JSON
 * 
 * Usage:
 *   node scripts/extract-screen-for-figma.js app/(auth)/sign-in.tsx
 *   node scripts/extract-screen-for-figma.js app/(auth)/sign-up.tsx --output figma-plugin/sign-up-screen.json
 */

const fs = require('fs');
const path = require('path');

// Color constants mapping
const VibeColors = {
  background: '#FFFFFF',
  text: '#000000',
  textMuted: '#7B7B7B',
  accent: '#91C788',
  articleLabel: '#FF806E',
  buttonCoral: '#FF8473',
  progressCardBg: '#A3A0CA',
};

// Font constants
const lineHeightEm = 1.232;

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node extract-screen-for-figma.js <file-path> [--output <output-path>]');
  console.error('Example: node scripts/extract-screen-for-figma.js app/(auth)/sign-in.tsx');
  process.exit(1);
}

const inputFile = args[0];
const outputIndex = args.indexOf('--output');
const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Read the file
const fileContent = fs.readFileSync(inputFile, 'utf-8');

// Extract screen name from file path
const screenName = path.basename(inputFile, path.extname(inputFile))
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

console.log(`\n🎨 Extracting screen: ${screenName}`);
console.log(`📄 Source: ${inputFile}\n`);

// Parse styles object from StyleSheet.create
function parseStyles(content) {
  const styleMatch = content.match(/const styles = StyleSheet\.create\({([\s\S]*?)\}\);/);
  if (!styleMatch) return {};

  const stylesText = styleMatch[1];
  const styleObjects = {};

  // Extract each style object
  const styleRegex = /(\w+):\s*{([^}]+)}/g;
  let match;
  while ((match = styleRegex.exec(stylesText)) !== null) {
    const [, name, props] = match;
    styleObjects[name] = parseStyleProps(props);
  }

  return styleObjects;
}

// Parse individual style properties
function parseStyleProps(propsText) {
  const props = {};
  const lines = propsText.split(',').map(l => l.trim()).filter(l => l);

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove trailing comma
    value = value.replace(/,$/, '');

    // Parse value
    if (value === 'true' || value === 'false') {
      props[key] = value === 'true';
    } else if (!isNaN(value)) {
      props[key] = parseFloat(value);
    } else if (value.startsWith("'") || value.startsWith('"')) {
      props[key] = value.slice(1, -1);
    } else if (value.includes('VibeColors.')) {
      const colorKey = value.replace('VibeColors.', '');
      props[key] = VibeColors[colorKey] || value;
    } else if (value.includes('StyleSheet.hairlineWidth')) {
      props[key] = 1;
    } else if (value.includes('*')) {
      // Handle calculations like 24 * lineHeightEm
      try {
        props[key] = eval(value.replace('lineHeightEm', lineHeightEm));
      } catch (e) {
        props[key] = value;
      }
    } else {
      props[key] = value;
    }
  });

  return props;
}

// Extract component structure from JSX
function extractComponentStructure(content) {
  // Basic extraction - this is a simplified version
  // In a real implementation, you'd want to use a proper JSX parser
  
  const hasAppleAuth = content.includes('AppleAuthentication') || content.includes('apple-icon.svg');
  const hasGoogleAuth = content.includes('google-icon.svg') || content.includes('signInWithGoogle');
  
  return {
    hasAppleAuth,
    hasGoogleAuth,
    hasSocialAuth: hasAppleAuth || hasGoogleAuth,
  };
}

// Load SVG icon data
function loadSvgIcon(iconPath) {
  const fullPath = path.join(process.cwd(), iconPath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8').replace(/\n/g, '');
  }
  return null;
}

// Generate JSON structure
function generateJSON(screenName, styles, structure) {
  const appleIconSvg = loadSvgIcon('assets/images/auth/apple-icon.svg');
  const googleIconSvg = loadSvgIcon('assets/images/auth/google-icon.svg');

  // Extract text content from the source file
  const titleMatch = fileContent.match(/<Text style={styles\.title}>([^<]+)<\/Text>/);
  const subtitleMatch = fileContent.match(/<Text style={styles\.subtitle}>([^<]+)<\/Text>/);
  
  const title = titleMatch ? titleMatch[1] : 'Welcome';
  const subtitle = subtitleMatch ? subtitleMatch[1] : 'Continue your journey';

  const json = {
    component: {
      type: 'SafeAreaView',
      name: `${screenName}Screen`,
      styles: {
        width: 390,
        height: 844,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
      },
      children: [
        {
          type: 'View',
          name: 'Container',
          styles: {
            flex: 1,
            paddingHorizontal: styles.container?.paddingHorizontal || 28,
            paddingTop: styles.container?.paddingTop || 60,
            paddingBottom: styles.container?.paddingBottom || 32,
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          children: [
            // Header Section
            {
              type: 'View',
              name: 'HeaderSection',
              styles: { gap: 8 },
              children: [
                {
                  type: 'Text',
                  name: 'Title',
                  text: title,
                  styles: {
                    fontFamily: styles.title?.fontFamily || 'Signika',
                    fontSize: styles.title?.fontSize || 32,
                    fontWeight: '600',
                    lineHeight: (styles.title?.fontSize || 32) * lineHeightEm,
                    color: styles.title?.color || '#000000',
                  },
                },
                {
                  type: 'Text',
                  name: 'Subtitle',
                  text: subtitle,
                  styles: {
                    fontFamily: styles.subtitle?.fontFamily || 'Signika',
                    fontSize: styles.subtitle?.fontSize || 16,
                    lineHeight: (styles.subtitle?.fontSize || 16) * lineHeightEm,
                    color: styles.subtitle?.color || '#7B7B7B',
                  },
                },
              ],
            },
            // Content Section
            {
              type: 'View',
              name: 'ContentSection',
              styles: { gap: 24 },
              children: [
                // Form fields will be added here
                generateFormSection(styles),
                // Social auth if needed
                ...(structure.hasSocialAuth ? [
                  generateDivider(),
                  generateSocialButtons(structure, appleIconSvg, googleIconSvg),
                ] : []),
              ],
            },
            // Footer Section
            generateFooterSection(styles),
          ],
        },
      ],
    },
    metadata: {
      appName: 'Provibe',
      framework: 'React Native',
      version: '1.0',
      screen: screenName,
      date: new Date().toISOString().split('T')[0],
    },
  };

  return json;
}

function generateFormSection(styles) {
  return {
    type: 'View',
    name: 'FormSection',
    styles: { gap: 16 },
    children: [
      {
        type: 'View',
        name: 'EmailField',
        styles: { gap: 8 },
        children: [
          {
            type: 'Text',
            name: 'EmailLabel',
            text: 'Email',
            styles: {
              fontFamily: 'Signika',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 17.248,
              color: '#000000',
            },
          },
          {
            type: 'View',
            name: 'EmailInput',
            styles: {
              minHeight: 50,
              borderRadius: styles.input?.borderRadius || 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: '#FAFAFA',
              flexDirection: 'row',
              alignItems: 'center',
            },
            children: [
              {
                type: 'Text',
                name: 'EmailPlaceholder',
                text: 'you@example.com',
                styles: {
                  fontFamily: 'Signika',
                  fontSize: 16,
                  color: '#7B7B7B',
                },
              },
            ],
          },
        ],
      },
      {
        type: 'View',
        name: 'PasswordField',
        styles: { gap: 8 },
        children: [
          {
            type: 'Text',
            name: 'PasswordLabel',
            text: 'Password',
            styles: {
              fontFamily: 'Signika',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 17.248,
              color: '#000000',
            },
          },
          {
            type: 'View',
            name: 'PasswordInput',
            styles: {
              minHeight: 50,
              borderRadius: styles.input?.borderRadius || 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: '#FAFAFA',
              flexDirection: 'row',
              alignItems: 'center',
            },
            children: [
              {
                type: 'Text',
                name: 'PasswordPlaceholder',
                text: '••••••••',
                styles: {
                  fontFamily: 'Signika',
                  fontSize: 16,
                  color: '#7B7B7B',
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

function generateDivider() {
  return {
    type: 'View',
    name: 'DividerSection',
    styles: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    children: [
      {
        type: 'View',
        name: 'DividerLine1',
        styles: {
          flex: 1,
          height: 1,
          backgroundColor: '#E0E0E0',
        },
      },
      {
        type: 'Text',
        name: 'DividerText',
        text: 'or continue with',
        styles: {
          fontFamily: 'Signika',
          fontSize: 13,
          color: '#7B7B7B',
        },
      },
      {
        type: 'View',
        name: 'DividerLine2',
        styles: {
          flex: 1,
          height: 1,
          backgroundColor: '#E0E0E0',
        },
      },
    ],
  };
}

function generateSocialButtons(structure, appleIconSvg, googleIconSvg) {
  const buttons = [];

  if (structure.hasAppleAuth && appleIconSvg) {
    buttons.push({
      type: 'Pressable',
      name: 'AppleButton',
      styles: {
        backgroundColor: '#000000',
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      },
      children: [
        {
          type: 'Icon',
          name: 'AppleIcon',
          svgData: appleIconSvg,
          styles: {
            width: 22,
            height: 22,
          },
        },
        {
          type: 'Text',
          name: 'AppleButtonText',
          text: 'Continue with Apple',
          styles: {
            fontFamily: 'Signika',
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
          },
        },
      ],
    });
  }

  if (structure.hasGoogleAuth && googleIconSvg) {
    buttons.push({
      type: 'Pressable',
      name: 'GoogleButton',
      styles: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
      children: [
        {
          type: 'Icon',
          name: 'GoogleIcon',
          svgData: googleIconSvg,
          styles: {
            width: 18,
            height: 18,
          },
        },
        {
          type: 'Text',
          name: 'GoogleButtonText',
          text: 'Continue with Google',
          styles: {
            fontFamily: 'Signika',
            fontSize: 16,
            fontWeight: '600',
            color: '#000000',
          },
        },
      ],
    });
  }

  return {
    type: 'View',
    name: 'SocialButtons',
    styles: { gap: 12 },
    children: buttons,
  };
}

function generateFooterSection(styles) {
  const buttonText = fileContent.includes('Sign in') ? 'Sign in' : 
                     fileContent.includes('Sign up') || fileContent.includes('Create') ? 'Create Account' : 'Continue';
  
  const secondaryText = fileContent.includes("Don't have an account") ? "Don't have an account? Sign up" :
                        fileContent.includes('Already have') ? 'Already have an account? Sign In' : '';

  return {
    type: 'View',
    name: 'FooterSection',
    styles: { gap: 16 },
    children: [
      {
        type: 'Pressable',
        name: 'PrimaryButton',
        styles: {
          backgroundColor: styles.primaryButton?.backgroundColor || '#91C788',
          borderRadius: styles.primaryButton?.borderRadius || 16,
          height: styles.primaryButton?.height || 56,
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          {
            type: 'Text',
            name: 'PrimaryButtonText',
            text: buttonText,
            styles: {
              fontFamily: 'Signika',
              fontSize: 17,
              fontWeight: '600',
              lineHeight: 20.944,
              color: '#FFFFFF',
            },
          },
        ],
      },
      ...(secondaryText ? [{
        type: 'View',
        name: 'SecondaryButton',
        styles: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          {
            type: 'Text',
            name: 'SecondaryButtonText',
            text: secondaryText,
            styles: {
              fontFamily: 'Signika',
              fontSize: 15,
              lineHeight: 18.48,
              color: '#7B7B7B',
            },
          },
        ],
      }] : []),
    ],
  };
}

// Main execution
try {
  const styles = parseStyles(fileContent);
  const structure = extractComponentStructure(fileContent);
  const json = generateJSON(screenName, styles, structure);

  // Determine output file
  const defaultOutput = path.join('figma-plugin', `${path.basename(inputFile, path.extname(inputFile))}-screen.json`);
  const finalOutput = outputFile || defaultOutput;

  // Write JSON file
  fs.writeFileSync(finalOutput, JSON.stringify(json, null, 2));

  console.log('✅ JSON generated successfully!');
  console.log(`📦 Output: ${finalOutput}\n`);
  console.log('Next steps:');
  console.log('1. Open Figma Desktop');
  console.log('2. Run: Plugins → Code to Figma');
  console.log(`3. Paste contents of ${finalOutput}`);
  console.log('4. Click "Import to Figma"\n');

} catch (error) {
  console.error('❌ Error generating JSON:', error.message);
  process.exit(1);
}
