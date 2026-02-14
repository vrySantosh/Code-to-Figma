#!/usr/bin/env node

/**
 * Test Helper Script for Code to Figma - Web Support
 * 
 * This script helps you test the web support implementation
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('🧪 CODE TO FIGMA - WEB SUPPORT TESTING');
console.log('='.repeat(70));
console.log('');

const examples = [
  {
    name: 'Simple Test Card',
    file: 'examples/web-simple-test.json',
    description: 'Quick test with a simple card (div, h1, p, button)'
  },
  {
    name: 'Contact Form',
    file: 'examples/web-contact-form.json',
    description: 'Complete form with inputs, textarea, and buttons'
  },
  {
    name: 'Landing Page',
    file: 'examples/web-landing-page.json',
    description: 'Full landing page with hero, features, and stats'
  }
];

console.log('📋 Available Test Examples:\n');

examples.forEach((example, i) => {
  console.log(`${i + 1}. ${example.name}`);
  console.log(`   File: ${example.file}`);
  console.log(`   ${example.description}`);
  console.log('');
});

console.log('='.repeat(70));
console.log('');
console.log('🚀 TESTING INSTRUCTIONS:');
console.log('');
console.log('1. Open Figma Desktop Application');
console.log('2. Create a new file or open an existing one');
console.log('3. Go to: Plugins → Development → Code to Figma');
console.log('   (Or if published: Plugins → Code to Figma)');
console.log('');
console.log('4. Copy a test file:');
console.log('   macOS: pbcopy < examples/web-simple-test.json');
console.log('   Linux: xclip -selection c < examples/web-simple-test.json');
console.log('   Or manually open and copy the file content');
console.log('');
console.log('5. Paste into the plugin textarea');
console.log('6. Click "Import to Figma"');
console.log('');
console.log('='.repeat(70));
console.log('');
console.log('✅ WHAT TO VERIFY:');
console.log('');
console.log('For Simple Test Card:');
console.log('  ✓ Card container (div) appears as a frame');
console.log('  ✓ Heading (h1) appears as text with proper style');
console.log('  ✓ Paragraph (p) appears with correct formatting');
console.log('  ✓ Button appears with background color and text');
console.log('  ✓ Shadows and rounded corners render correctly');
console.log('');
console.log('For Contact Form:');
console.log('  ✓ Form container with proper spacing');
console.log('  ✓ Input fields with borders and placeholders');
console.log('  ✓ Textarea with larger height');
console.log('  ✓ Buttons styled correctly');
console.log('');
console.log('For Landing Page:');
console.log('  ✓ Hero section with title and subtitle');
console.log('  ✓ 3-column feature grid layout');
console.log('  ✓ CTA buttons with proper styling');
console.log('  ✓ Stats section at bottom');
console.log('  ✓ All colors, fonts, and spacing preserved');
console.log('');
console.log('='.repeat(70));
console.log('');
console.log('⚡ QUICK TEST COMMAND:');
console.log('');
console.log('Copy the simple test to clipboard:');
console.log('  pbcopy < examples/web-simple-test.json');
console.log('');
console.log('Then paste into Figma plugin!');
console.log('');
console.log('='.repeat(70));
console.log('');

// Check if all files exist
console.log('🔍 Checking test files...\n');
examples.forEach(example => {
  const filePath = path.join(__dirname, '..', example.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      JSON.parse(content);
      console.log(`✅ ${example.name}: Valid JSON (${content.length} bytes)`);
    } catch (e) {
      console.log(`❌ ${example.name}: Invalid JSON - ${e.message}`);
    }
  } else {
    console.log(`❌ ${example.name}: File not found`);
  }
});

console.log('');
console.log('='.repeat(70));
console.log('');
console.log('💡 TIP: Start with "Simple Test Card" - it\'s the smallest!');
console.log('');
