/**
 * Extract React Native Signup Page Structure for Figma
 * 
 * This script analyzes the signup page component and generates
 * a JSON representation that can be imported into Figma via the plugin.
 */

const fs = require('fs');
const path = require('path');

// Read SVG icons
const appleIconPath = path.join(__dirname, '../assets/images/auth/apple-icon.svg');
const googleIconPath = path.join(__dirname, '../assets/images/auth/google-icon.svg');
const appleIconSvg = fs.readFileSync(appleIconPath, 'utf8');
const googleIconSvg = fs.readFileSync(googleIconPath, 'utf8');

// Import design tokens
const VibeColors = {
  background: '#FFFFFF',
  text: '#000000',
  textMuted: '#7B7B7B',
  accent: '#91C788',
  articleLabel: '#FF806E',
  buttonCoral: '#FF8473',
  progressCardBg: '#A3A0CA',
  progressCardAccent: '#9E9BC7',
  categoryPink: '#FFF2F0',
  categoryGreen: '#EFF7EE',
  categoryYellow: '#FFF8EB',
  categoryFruits: '#4D0A00',
  categoryVegetables: '#1C3418',
  categorySnacks: '#4D3200',
  articleText: '#330600',
};

const Signika = 'Signika';
const lineHeightEm = 1.232;

// Component structure based on sign-up.tsx
const signupPageStructure = {
  component: {
    type: 'SafeAreaView',
    name: 'Signup Page',
    styles: {
      flex: 1,
      backgroundColor: VibeColors.background,
    },
    children: [
      {
        type: 'View',
        name: 'Container',
        styles: {
          flex: 1,
          paddingHorizontal: 24,
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        children: [
          // Header Section
          {
            type: 'View',
            name: 'Header',
            styles: {
              paddingTop: 60,
              marginBottom: 32,
            },
            children: [
              {
                type: 'Text',
                name: 'Title',
                text: 'Create your account',
                styles: {
                  fontFamily: Signika,
                  fontSize: 32,
                  fontWeight: '600',
                  lineHeight: 32 * lineHeightEm,
                  color: VibeColors.text,
                  marginBottom: 8,
                },
              },
              {
                type: 'Text',
                name: 'Subtitle',
                text: 'Join Provibe and start your healthy journey.',
                styles: {
                  fontFamily: Signika,
                  fontSize: 16,
                  lineHeight: 16 * lineHeightEm,
                  color: VibeColors.textMuted,
                },
              },
            ],
          },
          
          // Content Section
          {
            type: 'View',
            name: 'Content',
            styles: {
              flex: 1,
              flexDirection: 'column',
            },
            children: [
              // Form
              {
                type: 'View',
                name: 'Form',
                styles: {
                  gap: 16,
                  marginBottom: 24,
                  flexDirection: 'column',
                },
                children: [
                  // Name Input
                  {
                    type: 'View',
                    name: 'Name Input Group',
                    styles: {
                      gap: 8,
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'Text',
                        name: 'Name Label',
                        text: 'Name',
                        styles: {
                          fontFamily: Signika,
                          fontSize: 14,
                          fontWeight: '500',
                          lineHeight: 14 * lineHeightEm,
                          color: VibeColors.text,
                        },
                      },
                      {
                        type: 'TextInput',
                        name: 'Name Input',
                        placeholder: 'Enter your name',
                        styles: {
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontFamily: Signika,
                          fontSize: 16,
                          color: VibeColors.text,
                          backgroundColor: '#FAFAFA',
                          height: 50,
                          width: 327, // Mobile width minus 2x24px padding
                        },
                      },
                    ],
                  },
                  
                  // Email Input
                  {
                    type: 'View',
                    name: 'Email Input Group',
                    styles: {
                      gap: 8,
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'Text',
                        name: 'Email Label',
                        text: 'Email',
                        styles: {
                          fontFamily: Signika,
                          fontSize: 14,
                          fontWeight: '500',
                          lineHeight: 14 * lineHeightEm,
                          color: VibeColors.text,
                        },
                      },
                      {
                        type: 'TextInput',
                        name: 'Email Input',
                        placeholder: 'you@example.com',
                        styles: {
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontFamily: Signika,
                          fontSize: 16,
                          color: VibeColors.text,
                          backgroundColor: '#FAFAFA',
                          height: 50,
                          width: 327,
                        },
                      },
                    ],
                  },
                  
                  // Password Input
                  {
                    type: 'View',
                    name: 'Password Input Group',
                    styles: {
                      gap: 8,
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'Text',
                        name: 'Password Label',
                        text: 'Password',
                        styles: {
                          fontFamily: Signika,
                          fontSize: 14,
                          fontWeight: '500',
                          lineHeight: 14 * lineHeightEm,
                          color: VibeColors.text,
                        },
                      },
                      {
                        type: 'TextInput',
                        name: 'Password Input',
                        placeholder: '••••••••',
                        styles: {
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          fontFamily: Signika,
                          fontSize: 16,
                          color: VibeColors.text,
                          backgroundColor: '#FAFAFA',
                          height: 50,
                          width: 327,
                        },
                      },
                    ],
                  },
                ],
              },
              
              // Divider
              {
                type: 'View',
                name: 'Divider',
                styles: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                  gap: 12,
                },
                children: [
                  {
                    type: 'View',
                    name: 'Divider Line Left',
                    styles: {
                      flex: 1,
                      height: 1,
                      backgroundColor: '#E0E0E0',
                    },
                  },
                  {
                    type: 'Text',
                    name: 'Divider Text',
                    text: 'or continue with',
                    styles: {
                      fontFamily: Signika,
                      fontSize: 13,
                      color: VibeColors.textMuted,
                    },
                  },
                  {
                    type: 'View',
                    name: 'Divider Line Right',
                    styles: {
                      flex: 1,
                      height: 1,
                      backgroundColor: '#E0E0E0',
                    },
                  },
                ],
              },
              
              // Social Buttons
              {
                type: 'View',
                name: 'Social Buttons',
                styles: {
                  gap: 12,
                  marginBottom: 16,
                  flexDirection: 'column',
                },
                children: [
                  // Apple Button
                  {
                    type: 'Pressable',
                    name: 'Apple Button',
                    styles: {
                      backgroundColor: '#000000',
                      borderRadius: 16,
                      height: 56,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 8,
                    },
                    children: [
                      {
                        type: 'Icon',
                        name: 'Apple Icon',
                        svgData: appleIconSvg,
                        styles: {
                          width: 22,
                          height: 22,
                        },
                      },
                      {
                        type: 'Text',
                        name: 'Apple Button Text',
                        text: 'Continue with Apple',
                        styles: {
                          fontFamily: Signika,
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        },
                      },
                    ],
                  },
                  
                  // Google Button
                  {
                    type: 'Pressable',
                    name: 'Google Button',
                    styles: {
                      backgroundColor: '#FFFFFF',
                      borderRadius: 16,
                      height: 56,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                    },
                    children: [
                      {
                        type: 'Icon',
                        name: 'Google Icon',
                        svgData: googleIconSvg,
                        styles: {
                          width: 18,
                          height: 18,
                        },
                      },
                      {
                        type: 'Text',
                        name: 'Google Button Text',
                        text: 'Continue with Google',
                        styles: {
                          fontFamily: Signika,
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#000000',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          
          // Footer Section
          {
            type: 'View',
            name: 'Footer',
            styles: {
              gap: 16,
              paddingBottom: 32,
              flexDirection: 'column',
            },
            children: [
              // Primary Button
              {
                type: 'Pressable',
                name: 'Create Account Button',
                styles: {
                  backgroundColor: VibeColors.accent,
                  borderRadius: 16,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    type: 'Text',
                    name: 'Create Account Text',
                    text: 'Create Account',
                    styles: {
                      fontFamily: Signika,
                      fontSize: 17,
                      fontWeight: '600',
                      lineHeight: 17 * lineHeightEm,
                      color: '#FFFFFF',
                    },
                  },
                ],
              },
              
              // Sign In Link
              {
                type: 'View',
                name: 'Sign In Link Container',
                styles: {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    type: 'Text',
                    name: 'Sign In Text',
                    text: 'Already have an account? Sign In',
                    styles: {
                      fontFamily: Signika,
                      fontSize: 15,
                      lineHeight: 15 * lineHeightEm,
                      color: VibeColors.accent,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  colors: VibeColors,
  fonts: {
    Signika: Signika,
    lineHeightEm: lineHeightEm,
  },
};

// Generate JSON file
const outputPath = path.join(__dirname, '../figma-plugin/signup-data.json');
fs.writeFileSync(outputPath, JSON.stringify(signupPageStructure, null, 2));

console.log('✅ Signup page structure extracted!');
console.log(`📁 File saved to: ${outputPath}`);
console.log('\n📋 Copy the content and paste it into the Figma plugin UI.\n');
console.log('Or copy directly:');
console.log('─'.repeat(50));
console.log(JSON.stringify(signupPageStructure));
console.log('─'.repeat(50));
