#!/bin/bash

# Code to Figma - Extension Installer Script
# Installs the .vsix package into VS Code

set -e

echo "🔧 Code to Figma Extension Installer"
echo "======================================"
echo ""

VSIX_FILE="code-to-figma-vscode-1.0.0.vsix"
EXTENSION_DIR="/Users/Santosh/Code to Figma/vscode-extension"

cd "$EXTENSION_DIR"

# Check if .vsix exists
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ Error: $VSIX_FILE not found!"
    echo ""
    echo "Creating package first..."
    npx --yes @vscode/vsce package
    echo ""
fi

echo "📦 Found: $VSIX_FILE"
ls -lh "$VSIX_FILE"
echo ""

# Try to install using code command
if command -v code &> /dev/null; then
    echo "✅ 'code' command found. Installing..."
    code --install-extension "$VSIX_FILE"
    echo ""
    echo "✅ Extension installed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart VS Code"
    echo "  2. Press Cmd+Shift+P and type 'Code to Figma'"
    echo "  3. Run 'Code to Figma: Open Control Panel'"
else
    echo "⚠️  'code' command not found in PATH"
    echo ""
    echo "Opening VS Code to install manually..."
    open -a "Visual Studio Code" "$VSIX_FILE"
    echo ""
    echo "📋 Manual Installation:"
    echo "  1. VS Code should open with 'Install Extension' prompt"
    echo "  2. Click 'Install' button"
    echo "  3. Restart VS Code when prompted"
    echo ""
    echo "OR install via Extensions panel:"
    echo "  1. Open VS Code"
    echo "  2. Press Cmd+Shift+X (Extensions)"
    echo "  3. Click '...' menu → 'Install from VSIX...'"
    echo "  4. Select: $EXTENSION_DIR/$VSIX_FILE"
fi

echo ""
echo "📖 For detailed instructions, see: INSTALL.md"
