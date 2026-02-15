#!/bin/bash

echo "======================================"
echo "  Code to Figma Connection Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Bridge Server HTTP
echo -n "1. Bridge Server (HTTP)... "
if curl -s http://localhost:3333/health | grep -q "ok"; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
    echo "   Start with: cd vscode-extension && node figma-bridge-server.js"
fi

# Test 2: WebSocket Port
echo -n "2. WebSocket Port (3334)... "
if lsof -i :3334 | grep -q LISTEN; then
    echo -e "${GREEN}✓ Listening${NC}"
else
    echo -e "${RED}✗ Not listening${NC}"
fi

# Test 3: Figma Plugin Built
echo -n "3. Figma Plugin (code.js)... "
if [ -f "code.js" ] && [ -s "code.js" ]; then
    SIZE=$(du -h code.js | cut -f1)
    echo -e "${GREEN}✓ Built ($SIZE)${NC}"
else
    echo -e "${RED}✗ Not found or empty${NC}"
    echo "   Build with: npm run build"
fi

# Test 4: VS Code Extension Built
echo -n "4. VS Code Extension... "
if [ -f "vscode-extension/dist/extension.js" ] && [ -s "vscode-extension/dist/extension.js" ]; then
    SIZE=$(du -h vscode-extension/dist/extension.js | cut -f1)
    echo -e "${GREEN}✓ Built ($SIZE)${NC}"
else
    echo -e "${RED}✗ Not found or empty${NC}"
    echo "   Build with: cd vscode-extension && npm run compile"
fi

# Test 5: Icon
echo -n "5. Extension Icon... "
if [ -f "vscode-extension/resources/icon-128.png" ] && [ -s "vscode-extension/resources/icon-128.png" ]; then
    SIZE=$(du -h vscode-extension/resources/icon-128.png | cut -f1)
    echo -e "${GREEN}✓ Generated ($SIZE)${NC}"
else
    echo -e "${RED}✗ Not found or empty${NC}"
    echo "   Generate with: cd vscode-extension && node generate-icon.js"
fi

# Test 6: Dependencies
echo -n "6. Dependencies... "
if [ -d "node_modules" ] && [ -d "vscode-extension/node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Missing${NC}"
    echo "   Install with: npm install && cd vscode-extension && npm install"
fi

echo ""
echo "======================================"

# Summary
if curl -s http://localhost:3333/health | grep -q "ok" && lsof -i :3334 | grep -q LISTEN; then
    echo -e "${GREEN}✓ Ready to use!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Open Figma → Plugins → Development → Code to Figma"
    echo "  2. Check for '🟢 VS Code: Connected' at the top"
    echo "  3. In VS Code, run 'Code to Figma: Export to Figma'"
else
    echo -e "${RED}✗ Setup incomplete${NC}"
    echo ""
    echo "Start bridge server:"
    echo "  cd vscode-extension && node figma-bridge-server.js"
fi

echo ""
