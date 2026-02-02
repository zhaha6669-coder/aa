// Quick Analysis Script for Lumina Project
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");

console.log("🔍 LUMINA PROJECT ANALYSIS");
console.log("=".repeat(50));

// 1. List Pages
console.log("\n📄 PAGES:");
const appDir = path.join(PROJECT_ROOT, "src", "app");
function findPages(dir, prefix = "") {
    const pages = [];
    if (!fs.existsSync(dir)) return pages;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            pages.push(...findPages(fullPath, `${prefix}/${entry.name}`));
        } else if (entry.name === "page.tsx") {
            pages.push(prefix || "/");
        }
    }
    return pages;
}
const pages = findPages(appDir);
pages.forEach(p => console.log(`  ✓ ${p}`));

// 2. List Components
console.log("\n🧩 COMPONENTS:");
const componentsDir = path.join(PROJECT_ROOT, "src", "components");
const components = fs.readdirSync(componentsDir).filter(f => f.endsWith(".tsx"));
components.forEach(c => console.log(`  • ${c}`));

// 3. Check Imports
console.log("\n📦 IMPORT ANALYSIS:");
const srcDir = path.join(PROJECT_ROOT, "src");
const files = await glob("**/*.{ts,tsx}", { cwd: srcDir });

const externalPackages = new Set();
const localImports = new Map();
const potentialIssues = [];

for (const file of files) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Check for 'use client' in files using hooks
    const usesHooks = /use(State|Effect|Context|Ref|Memo|Callback)\s*\(/.test(content);
    const hasUseClient = content.includes('"use client"') || content.includes("'use client'");
    
    if (usesHooks && !hasUseClient && !file.includes("context/")) {
        potentialIssues.push(`⚠️ ${file}: Uses React hooks but missing "use client" directive`);
    }
    
    // Extract imports
    const importMatches = content.match(/from ['"]([^'"]+)['"]/g) || [];
    for (const match of importMatches) {
        const moduleName = match.replace(/from ['"]|['"]/g, "");
        if (!moduleName.startsWith(".") && !moduleName.startsWith("@/")) {
            const packageName = moduleName.startsWith("@") 
                ? moduleName.split("/").slice(0, 2).join("/")
                : moduleName.split("/")[0];
            externalPackages.add(packageName);
        }
    }
}

// Check package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf-8"));
const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
const builtInModules = ["react", "react-dom", "next", "fs", "path", "crypto"];

console.log("  External packages used:");
externalPackages.forEach(pkg => {
    const version = installedDeps[pkg];
    if (version) {
        console.log(`    ✓ ${pkg} (${version})`);
    } else if (!builtInModules.includes(pkg) && !pkg.startsWith("next/")) {
        potentialIssues.push(`❌ Missing package: ${pkg}`);
    }
});

// 4. Find Unused Components
console.log("\n🔎 UNUSED COMPONENTS CHECK:");
const allFileContents = files.map(f => fs.readFileSync(path.join(srcDir, f), "utf-8")).join("\n");
const unusedComponents = [];

for (const component of components) {
    const componentName = component.replace(".tsx", "");
    // Check if imported anywhere (excluding its own file)
    const importPattern = new RegExp(`import.*${componentName}.*from|<${componentName}[\\s/>]`, "g");
    const selfFile = `components/${component}`;
    
    let isUsed = false;
    for (const file of files) {
        if (file === selfFile) continue;
        const content = fs.readFileSync(path.join(srcDir, file), "utf-8");
        if (content.includes(componentName)) {
            isUsed = true;
            break;
        }
    }
    
    if (!isUsed) {
        unusedComponents.push(component);
    }
}

if (unusedComponents.length > 0) {
    unusedComponents.forEach(c => console.log(`  ⚠️ Potentially unused: ${c}`));
} else {
    console.log("  ✓ All components appear to be in use");
}

// 5. Check for common issues
console.log("\n⚠️ POTENTIAL ISSUES:");
if (potentialIssues.length > 0) {
    potentialIssues.forEach(issue => console.log(`  ${issue}`));
} else {
    console.log("  ✓ No critical issues found");
}

// 6. Check for console.log statements (should be removed in production)
console.log("\n🔧 CODE QUALITY:");
let consoleLogCount = 0;
for (const file of files) {
    const content = fs.readFileSync(path.join(srcDir, file), "utf-8");
    const matches = content.match(/console\.(log|warn|error)\(/g) || [];
    if (matches.length > 0) {
        consoleLogCount += matches.length;
    }
}
console.log(`  • Console statements found: ${consoleLogCount}`);

// 7. Bundle size concerns
console.log("\n📊 BUNDLE ANALYSIS:");
const heavyPackages = ["three", "@react-three/fiber", "@react-three/drei", "framer-motion"];
const foundHeavy = heavyPackages.filter(pkg => installedDeps[pkg]);
if (foundHeavy.length > 0) {
    console.log("  Heavy packages (consider code splitting):");
    foundHeavy.forEach(pkg => console.log(`    • ${pkg}`));
} else {
    console.log("  ✓ No particularly heavy packages detected");
}

console.log("\n" + "=".repeat(50));
console.log("✅ ANALYSIS COMPLETE");
