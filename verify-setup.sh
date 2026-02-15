#!/bin/bash

# Code to Figma - Quick Verification Script
# Checks if all components are properly set up and compiled

set -e  # Exit on error

echo "🔍 Code to Figma - Setup Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((ERRORS++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((ERRORS++))
        return 1
    fi
}

echo "📁 Checking Project Structure..."
echo "-----------------------------------"

# Root files
check_file "manifest.json"
check_file "code.ts"
check_file "code.js"
check_file "ui.html"
check_file "package.json"

echo ""

# VS Code Extension files
check_dir "vscode-extension"
check_file "vscode-extension/package.json"
check_file "vscode-extension/figma-bridge-server.js"
check_file "vscode-extension/src/extension.ts"
check_file "vscode-extension/src/controlPanel.ts"
check_file "vscode-extension/src/figmaClient.ts"
check_file "vscode-extension/src/parser.ts"

echo ""
echo "🔨 Checking Compilation Output..."
echo "-----------------------------------"

# Check compiled files
check_dir "vscode-extension/dist"
check_file "vscode-extension/dist/extension.js"
check_file "vscode-extension/dist/controlPanel.js"
check_file "vscode-extension/dist/figmaClient.js"
check_file "vscode-extension/dist/parser.js"

echo ""
echo "📦 Checking Dependencies..."
echo "-----------------------------------"

# Check node_modules exist
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Root dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Root dependencies not installed - run 'npm install'"
    ((WARNINGS++))
fi

if [ -d "vscode-extension/node_modules" ]; then
    echo -e "${GREEN}✓${NC} VS Code extension dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Extension dependencies not installed - run 'cd vscode-extension && npm install'"
    ((WARNINGS++))
fi

echo ""
echo "🔍 Checking for Obsolete Files..."
echo "-----------------------------------"

# Check that old files are moved
if [ -f "vscode-extension/src/extension-old.ts" ]; then
    echo -e "${YELLOW}⚠${NC} Found obsolete file: extension-old.ts (should be archived)"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} No extension-old.ts in src/"
fi

if [ -f "vscode-extension/src/extension-new.ts" ]; then
    echo -e "${YELLOW}⚠${NC} Found obsolete file: extension-new.ts (should be archived)"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} No extension-new.ts in src/"
fi

if [ -f "vscode-extension/package-old.json" ]; then
    echo -e "${YELLOW}⚠${NC} Found obsolete file: package-old.json (should be archived)"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} No package-old.json found"
fi

echo ""
echo "🔌 Checking Ports..."
echo "-----------------------------------"

# Check if ports are in use
if lsof -Pi :3333 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    PID=$(lsof -Pi :3333 -sTCP:LISTEN -t)
    echo -e "${YELLOW}⚠${NC} Port 3333 is in use (PID: $PID)"
    echo "  This might be the bridge server already running"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} Port 3333 available"
fi

if lsof -Pi :3334 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    PID=$(lsof -Pi :3334 -sTCP:LISTEN -t)
    echo -e "${YELLOW}⚠${NC} Port 3334 is in use (PID: $PID)"
    echo "  This might be the bridge server already running"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} Port 3334 available"
fi

echo ""
echo "🧪 Running Syntax Checks..."
echo "-----------------------------------"

# Check for TypeScript errors (don't exit on error for this check)
set +e
cd "vscode-extension"
TS_OUTPUT=$(npm run compile 2>&1)
TS_EXIT=$?
cd ..
set -e

if [ $TS_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No TypeScript compilation errors"
else
    echo -e "${RED}✗${NC} TypeScript compilation errors found:"
    echo "$TS_OUTPUT" | grep -i "error" || echo "$TS_OUTPUT"
    ((ERRORS++))
fi

# Check manifest.json is valid JSON
if jq empty manifest.json >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} manifest.json is valid JSON"
elif python3 -m json.tool manifest.json >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} manifest.json is valid JSON"
else
    echo -e "${RED}✗${NC} manifest.json is invalid JSON"
    ((ERRORS++))
fi

# Check package.json files
if jq empty package.json >/dev/null 2>&1 || python3 -m json.tool package.json >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Root package.json is valid JSON"
else
    echo -e "${RED}✗${NC} Root package.json is invalid JSON"
    ((ERRORS++))
fi

if jq empty vscode-extension/package.json >/dev/null 2>&1 || python3 -m json.tool vscode-extension/package.json >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Extension package.json is valid JSON"
else
    echo -e "${RED}✗${NC} Extension package.json is invalid JSON"
    ((ERRORS++))
fi

echo ""
echo "======================================"
echo "📊 Verification Summary"
echo "======================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🎉 Your setup is ready for testing!"
    echo ""
    echo "Next steps:"
    echo "  1. Open vscode-extension folder in VS Code"
    echo "  2. Press F5 to launch Extension Development Host"
    echo "  3. Open Figma Desktop and import plugin (Plugins → Development → Import plugin from manifest)"
    echo "  4. See TESTING_WORKFLOW.md for detailed testing instructions"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can proceed with testing, but review the warnings above."
    echo "See TESTING_WORKFLOW.md for detailed testing instructions."
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before testing."
    echo ""
    echo "Quick fixes:"
    echo "  - Missing dependencies: cd <folder> && npm install"
    echo "  - Compilation errors: Check the file/line mentioned and review your code"
    echo "  - Missing files: Ensure you're running this from the project root"
    exit 1
fi
