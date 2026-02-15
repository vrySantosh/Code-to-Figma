# VS Code Extension Development Guide

## Project Structure

```
vscode-extension/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── parser.ts              # Component parser (React, Vue, HTML)
│   ├── figmaClient.ts         # Figma API and plugin communication
│   ├── syncManager.ts         # Sync state management
│   ├── treeProvider.ts        # Sidebar tree view provider
│   └── types.ts               # TypeScript type definitions
├── dist/                      # Compiled JavaScript output
├── figma-bridge-server.js     # WebSocket server for Figma bridge
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Documentation
```

## Key Components

### 1. Extension Entry Point (`extension.ts`)

The main activation function registers:
- Commands (convert, export, sync)
- Tree view providers
- File watchers
- Status bar items

### 2. Parser (`parser.ts`)

Handles parsing of different component formats:
- **React/React Native**: Uses Babel parser to extract JSX
- **HTML**: Basic HTML parsing
- **Vue**: Template extraction

Converts code to the standardized JSON schema.

### 3. Figma Client (`figmaClient.ts`)

Manages communication with Figma:
- Bridge server detection
- WebSocket communication
- Figma REST API fallback
- Node creation and updates

### 4. Sync Manager (`syncManager.ts`)

Tracks synced components:
- Stores sync data in `.vscode/code-to-figma-sync.json`
- Maps file paths to Figma node IDs
- Handles update operations
- Manages auto-sync

### 5. Tree Provider (`treeProvider.ts`)

Sidebar UI showing:
- List of synced components
- Node IDs and sync times
- Quick navigation to files

## Communication Flow

```
┌─────────────────┐
│   VS Code       │
│   Extension     │
└────────┬────────┘
         │
         │ HTTP POST
         ▼
┌─────────────────┐
│  Bridge Server  │
│  (Express +     │
│   WebSocket)    │
└────────┬────────┘
         │
         │ WebSocket
         ▼
┌─────────────────┐
│  Figma Plugin   │
│  (ui.html)      │
└────────┬────────┘
         │
         │ postMessage
         ▼
┌─────────────────┐
│  Figma Plugin   │
│  Code (code.ts) │
└─────────────────┘
```

## Message Types

### VS Code → Figma

- `export`: Create new component in Figma
- `update`: Update existing Figma node
- `sync`: Request current node data

### Figma → VS Code

- `import-complete`: Component created successfully
- `update-complete`: Node updated
- `node-data-response`: Current node data

## Development Workflow

### Local Development

1. **Start in Watch Mode**
   ```bash
   npm run watch
   ```

2. **Launch Extension Host**
   - Press `F5` in VS Code
   - Or: Run → Start Debugging

3. **Make Changes**
   - Edit TypeScript files
   - Watch mode auto-compiles
   - Reload Extension Host: `Cmd+R` (Mac) / `Ctrl+R` (Windows)

### Testing

1. **Bridge Server**
   ```bash
   node figma-bridge-server.js
   ```

2. **Test Component**
   Create a test file and try exporting

3. **Check Logs**
   - VS Code: Output → Code to Figma
   - Figma: Plugins → Development → Code to Figma (console)
   - Bridge: Terminal output

### Debugging

#### VS Code Extension
- Set breakpoints in `.ts` files
- Use Debug Console
- Check `console.log` in Output panel

#### Bridge Server
- Add `console.log` statements
- Check terminal output
- Use `curl` to test endpoints:
  ```bash
  curl http://localhost:3333/health
  ```

#### Figma Plugin
- Open browser console (if web Figma)
- Use `console.log` in ui.html
- Check Figma desktop logs

## Adding New Features

### 1. Add a Command

**In `package.json`:**
```json
{
  "commands": [
    {
      "command": "codeToFigma.myNewCommand",
      "title": "Code to Figma: My New Feature"
    }
  ]
}
```

**In `extension.ts`:**
```typescript
const myNewCommand = vscode.commands.registerCommand(
  'codeToFigma.myNewCommand', 
  async () => {
    // Your logic here
  }
);

context.subscriptions.push(myNewCommand);
```

### 2. Add Parser Support

**In `parser.ts`:**
```typescript
private parseMyFramework(code: string): ComponentSchema {
  // Parse logic
  return {
    component: { /* ... */ },
    metadata: { /* ... */ }
  };
}
```

Update `parseToSchema` to handle new language ID.

### 3. Add Message Type

**Define in `types.ts`:**
```typescript
export interface MyMessageType {
  type: 'my-new-type';
  data: any;
}
```

**Handle in `figmaClient.ts`:**
```typescript
async handleMyMessage(data: any): Promise<any> {
  // Implementation
}
```

**Handle in `code.ts`:**
```typescript
if (msg.type === 'my-new-type') {
  // Handle in Figma plugin
}
```

## Configuration

### Extension Settings

Add to `package.json`:
```json
{
  "configuration": {
    "properties": {
      "codeToFigma.myNewSetting": {
        "type": "string",
        "default": "value",
        "description": "Description"
      }
    }
  }
}
```

Access in code:
```typescript
const config = vscode.workspace.getConfiguration('codeToFigma');
const mySetting = config.get<string>('myNewSetting');
```

## Publishing

### Prepare for Publishing

1. **Update Version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Compile Production Build**
   ```bash
   npm run compile
   ```

3. **Test Package**
   ```bash
   npm install -g vsce
   vsce package
   ```

4. **Install VSIX Locally**
   ```bash
   code --install-extension code-to-figma-vscode-1.0.0.vsix
   ```

### Publish to Marketplace

1. **Get Publisher Token**
   - Go to [Azure DevOps](https://dev.azure.com)
   - Create Personal Access Token

2. **Create Publisher**
   ```bash
   vsce create-publisher your-publisher-name
   ```

3. **Publish**
   ```bash
   vsce publish
   ```

## Best Practices

### Code Quality
- Use TypeScript strict mode
- Add JSDoc comments
- Handle errors gracefully
- Validate user input

### Performance
- Avoid blocking operations
- Use Progress API for long tasks
- Cache parsed results when possible
- Debounce file watchers

### User Experience
- Provide clear error messages
- Show progress notifications
- Add keyboard shortcuts
- Include helpful tooltips

### Security
- Never log access tokens
- Store credentials securely
- Validate bridge server responses
- Sanitize user input

## Common Issues

### TypeScript Errors
```bash
npm run compile
```
Check `tsconfig.json` settings.

### Extension Not Activating
- Check `activationEvents` in `package.json`
- Ensure commands are registered
- Check Output panel for errors

### Bridge Connection Failed
- Verify ports 3333/3334 are available
- Check firewall settings
- Restart bridge server

### Figma Plugin Not Responding
- Reload Figma plugin
- Check WebSocket connection
- Verify message format

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Babel Parser](https://babeljs.io/docs/en/babel-parser)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## Support

- GitHub Issues
- Stack Overflow: `code-to-figma`
- Discord: [Join Server](#)
