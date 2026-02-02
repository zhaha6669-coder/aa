#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Project root path (parent directory)
const PROJECT_ROOT = path.resolve(process.cwd(), "..");

// Create MCP Server
const server = new Server(
  {
    name: "lumina-analyzer",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============ TOOLS ============

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_pages",
        description: "List all pages in the Next.js application",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "list_components",
        description: "List all React components in the project",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "analyze_component",
        description: "Analyze a specific component for imports, exports, and dependencies",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "Name of the component file (e.g., Header.tsx)",
            },
          },
          required: ["componentName"],
        },
      },
      {
        name: "check_imports",
        description: "Check all imports across the project and identify missing dependencies",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "project_structure",
        description: "Get the complete project structure as a tree",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "find_unused_components",
        description: "Find components that are not imported anywhere",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "check_translations",
        description: "Check for missing translation keys between languages",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "analyze_bundle",
        description: "Analyze package.json dependencies and their sizes",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_pages": {
      const pagesDir = path.join(PROJECT_ROOT, "src", "app");
      const pages = await findPages(pagesDir);
      return {
        content: [
          {
            type: "text",
            text: `📄 Found ${pages.length} pages:\n\n${pages.map((p) => `  • ${p}`).join("\n")}`,
          },
        ],
      };
    }

    case "list_components": {
      const componentsDir = path.join(PROJECT_ROOT, "src", "components");
      const components = await findComponents(componentsDir);
      return {
        content: [
          {
            type: "text",
            text: `🧩 Found ${components.length} components:\n\n${components.map((c) => `  • ${c}`).join("\n")}`,
          },
        ],
      };
    }

    case "analyze_component": {
      const componentName = (args as { componentName: string }).componentName;
      const analysis = await analyzeComponent(componentName);
      return {
        content: [
          {
            type: "text",
            text: analysis,
          },
        ],
      };
    }

    case "check_imports": {
      const importAnalysis = await checkAllImports();
      return {
        content: [
          {
            type: "text",
            text: importAnalysis,
          },
        ],
      };
    }

    case "project_structure": {
      const structure = await getProjectStructure();
      return {
        content: [
          {
            type: "text",
            text: structure,
          },
        ],
      };
    }

    case "find_unused_components": {
      const unused = await findUnusedComponents();
      return {
        content: [
          {
            type: "text",
            text: unused,
          },
        ],
      };
    }

    case "check_translations": {
      const translationCheck = await checkTranslations();
      return {
        content: [
          {
            type: "text",
            text: translationCheck,
          },
        ],
      };
    }

    case "analyze_bundle": {
      const bundleAnalysis = await analyzeBundleDependencies();
      return {
        content: [
          {
            type: "text",
            text: bundleAnalysis,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ============ RESOURCES ============

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "lumina://project/overview",
        name: "Project Overview",
        description: "Complete overview of the Lumina project",
        mimeType: "text/plain",
      },
      {
        uri: "lumina://project/package.json",
        name: "Package.json",
        description: "Project dependencies and scripts",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "lumina://project/overview") {
    const overview = await getProjectOverview();
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: overview,
        },
      ],
    };
  }

  if (uri === "lumina://project/package.json") {
    const packagePath = path.join(PROJECT_ROOT, "package.json");
    const content = fs.readFileSync(packagePath, "utf-8");
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: content,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// ============ HELPER FUNCTIONS ============

async function findPages(dir: string): Promise<string[]> {
  const pages: string[] = [];

  function scanDir(currentDir: string, prefix = "") {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath, `${prefix}/${entry.name}`);
      } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
        pages.push(prefix || "/");
      }
    }
  }

  scanDir(dir);
  return pages;
}

async function findComponents(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  return files.filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
}

async function analyzeComponent(componentName: string): Promise<string> {
  const componentPath = path.join(PROJECT_ROOT, "src", "components", componentName);

  if (!fs.existsSync(componentPath)) {
    return `❌ Component "${componentName}" not found`;
  }

  const content = fs.readFileSync(componentPath, "utf-8");

  // Extract imports
  const importMatches = content.match(/^import .+ from ['"].+['"]/gm) || [];

  // Check for 'use client' directive
  const hasUseClient = content.includes('"use client"') || content.includes("'use client'");

  // Extract exported function/component names
  const exportMatches = content.match(/export (default )?(function|const|class) (\w+)/g) || [];

  // Check for hooks usage
  const hooksUsed: string[] = [];
  const hookPatterns = ["useState", "useEffect", "useContext", "useRef", "useMemo", "useCallback"];
  hookPatterns.forEach((hook) => {
    if (content.includes(hook)) hooksUsed.push(hook);
  });

  // Line count
  const lineCount = content.split("\n").length;

  return `
📊 Analysis of ${componentName}
${"=".repeat(40)}

📁 File Info:
  • Lines of code: ${lineCount}
  • Client Component: ${hasUseClient ? "✅ Yes" : "❌ No (Server Component)"}

📦 Imports (${importMatches.length}):
${importMatches.map((i) => `  • ${i}`).join("\n") || "  None"}

📤 Exports:
${exportMatches.map((e) => `  • ${e}`).join("\n") || "  None"}

🪝 React Hooks Used:
${hooksUsed.length > 0 ? hooksUsed.map((h) => `  • ${h}`).join("\n") : "  None"}
`;
}

async function checkAllImports(): Promise<string> {
  const srcDir = path.join(PROJECT_ROOT, "src");
  const files = await glob("**/*.{ts,tsx}", { cwd: srcDir });

  const allImports: Map<string, string[]> = new Map();
  const externalPackages: Set<string> = new Set();

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const importMatches = content.match(/from ['"]([^'"]+)['"]/g) || [];

    for (const match of importMatches) {
      const moduleName = match.replace(/from ['"]|['"]/g, "");

      if (!moduleName.startsWith(".") && !moduleName.startsWith("@/")) {
        // External package
        const packageName = moduleName.startsWith("@")
          ? moduleName.split("/").slice(0, 2).join("/")
          : moduleName.split("/")[0];
        externalPackages.add(packageName);
      }

      if (!allImports.has(moduleName)) {
        allImports.set(moduleName, []);
      }
      allImports.get(moduleName)!.push(file);
    }
  }

  // Check against package.json
  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const installedDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const missingPackages: string[] = [];
  const builtInModules = ["react", "react-dom", "next", "fs", "path", "crypto"];

  externalPackages.forEach((pkg) => {
    if (!installedDeps[pkg] && !builtInModules.includes(pkg) && !pkg.startsWith("next/")) {
      missingPackages.push(pkg);
    }
  });

  return `
🔍 Import Analysis
${"=".repeat(40)}

📦 External Packages Used (${externalPackages.size}):
${Array.from(externalPackages)
  .map((p) => `  • ${p} ${installedDeps[p] ? `(v${installedDeps[p]})` : ""}`)
  .join("\n")}

${
  missingPackages.length > 0
    ? `⚠️ Potentially Missing Packages:\n${missingPackages.map((p) => `  • ${p}`).join("\n")}`
    : "✅ All packages appear to be installed"
}

📁 Files Analyzed: ${files.length}
`;
}

async function getProjectStructure(): Promise<string> {
  const srcDir = path.join(PROJECT_ROOT, "src");

  function buildTree(dir: string, prefix = ""): string {
    if (!fs.existsSync(dir)) return "";

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let result = "";

    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = isLast ? "    " : "│   ";

      if (entry.isDirectory()) {
        result += `${prefix}${connector}📁 ${entry.name}/\n`;
        result += buildTree(path.join(dir, entry.name), prefix + childPrefix);
      } else {
        const icon = entry.name.endsWith(".tsx")
          ? "⚛️"
          : entry.name.endsWith(".ts")
          ? "📘"
          : entry.name.endsWith(".css")
          ? "🎨"
          : "📄";
        result += `${prefix}${connector}${icon} ${entry.name}\n`;
      }
    });

    return result;
  }

  return `
🗂️ Project Structure
${"=".repeat(40)}

📁 src/
${buildTree(srcDir, "")}`;
}

async function findUnusedComponents(): Promise<string> {
  const componentsDir = path.join(PROJECT_ROOT, "src", "components");
  const srcDir = path.join(PROJECT_ROOT, "src");

  if (!fs.existsSync(componentsDir)) {
    return "❌ Components directory not found";
  }

  const components = fs.readdirSync(componentsDir).filter((f) => f.endsWith(".tsx"));
  const allFiles = await glob("**/*.{ts,tsx}", { cwd: srcDir });

  const unusedComponents: string[] = [];

  for (const component of components) {
    const componentName = component.replace(".tsx", "");
    let isUsed = false;

    for (const file of allFiles) {
      if (file === `components/${component}`) continue;

      const filePath = path.join(srcDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      if (content.includes(`from`) && content.includes(componentName)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      unusedComponents.push(component);
    }
  }

  return `
🔍 Unused Components Analysis
${"=".repeat(40)}

${
  unusedComponents.length > 0
    ? `⚠️ Potentially Unused Components (${unusedComponents.length}):\n${unusedComponents.map((c) => `  • ${c}`).join("\n")}`
    : "✅ All components appear to be in use"
}

📁 Total Components Analyzed: ${components.length}
`;
}

async function checkTranslations(): Promise<string> {
  const translationsPath = path.join(PROJECT_ROOT, "src", "data", "translations.ts");

  if (!fs.existsSync(translationsPath)) {
    return "❌ Translations file not found";
  }

  const content = fs.readFileSync(translationsPath, "utf-8");

  // Simple key extraction (this is a basic check)
  const enKeys = (content.match(/en:\s*{[\s\S]*?(?=ar:|$)/)?.[0] || "").match(/\w+:/g) || [];
  const arKeys = (content.match(/ar:\s*{[\s\S]*$/)?.[0] || "").match(/\w+:/g) || [];

  return `
🌍 Translation Keys Analysis
${"=".repeat(40)}

📝 English Keys Found: ~${enKeys.length}
📝 Arabic Keys Found: ~${arKeys.length}

${
  enKeys.length === arKeys.length
    ? "✅ Key counts match between languages"
    : "⚠️ Key count mismatch - manual verification recommended"
}

💡 Note: For accurate analysis, manually verify nested keys
`;
}

async function analyzeBundleDependencies(): Promise<string> {
  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return "❌ package.json not found";
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const deps = Object.entries(packageJson.dependencies || {});
  const devDeps = Object.entries(packageJson.devDependencies || {});

  const heavyPackages = [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "framer-motion",
    "chart.js",
    "moment",
    "lodash",
  ];

  const foundHeavy = deps.filter(([name]) => heavyPackages.includes(name));

  return `
📦 Bundle Analysis
${"=".repeat(40)}

📚 Production Dependencies (${deps.length}):
${deps.map(([name, version]) => `  • ${name}: ${version}`).join("\n")}

🔧 Dev Dependencies (${devDeps.length}):
${devDeps.map(([name, version]) => `  • ${name}: ${version}`).join("\n")}

${
  foundHeavy.length > 0
    ? `\n⚠️ Heavy Packages Detected:\n${foundHeavy.map(([name, ver]) => `  • ${name} (${ver}) - Consider code splitting`).join("\n")}`
    : "\n✅ No particularly heavy packages detected"
}

💡 Recommendations:
  • Use dynamic imports for heavy components
  • Consider tree-shaking for large libraries
  • Analyze with 'next build' for accurate bundle sizes
`;
}

async function getProjectOverview(): Promise<string> {
  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const pages = await findPages(path.join(PROJECT_ROOT, "src", "app"));
  const components = await findComponents(path.join(PROJECT_ROOT, "src", "components"));

  return `
🌟 LUMINA PROJECT OVERVIEW
${"=".repeat(50)}

📋 Project: ${packageJson.name}
📌 Version: ${packageJson.version}
📝 Description: ${packageJson.description || "N/A"}

🛠️ Tech Stack:
  • Framework: Next.js 14
  • Language: TypeScript
  • Styling: Tailwind CSS
  • Animations: Framer Motion
  • 3D Graphics: Three.js

📄 Pages: ${pages.length}
🧩 Components: ${components.length}

🔗 Scripts Available:
${Object.entries(packageJson.scripts || {})
  .map(([name, cmd]) => `  • ${name}: ${cmd}`)
  .join("\n")}
`;
}

// ============ START SERVER ============

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Lumina MCP Server running on stdio");
}

main().catch(console.error);
