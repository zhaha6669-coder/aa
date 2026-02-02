# Lumina MCP Server

MCP (Model Context Protocol) Server for analyzing the Lumina Next.js project.

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_pages` | List all pages in the Next.js application |
| `list_components` | List all React components in the project |
| `analyze_component` | Analyze a specific component for imports, exports, and dependencies |
| `check_imports` | Check all imports across the project and identify missing dependencies |
| `project_structure` | Get the complete project structure as a tree |
| `find_unused_components` | Find components that are not imported anywhere |
| `check_translations` | Check for missing translation keys between languages |
| `analyze_bundle` | Analyze package.json dependencies and their sizes |

## Configuration

The MCP server is configured in `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "lumina-analyzer": {
      "command": "node",
      "args": ["e:/pro1/mcp-server/dist/index.js"],
      "cwd": "e:/pro1/mcp-server"
    }
  }
}
```

## Usage with VS Code

1. Ensure the MCP server is built: `npm run build`
2. Restart VS Code to load the MCP configuration
3. Use the MCP tools through GitHub Copilot Chat

## Running Manually

```bash
npm start
```

The server communicates via stdio (standard input/output).
