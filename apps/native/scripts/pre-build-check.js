#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Checking DeenQuest build configuration...\n");

const checks = [
  {
    name: "EAS Configuration",
    check: () => fs.existsSync("eas.json"),
    fix: "Run: eas build:configure",
  },
  {
    name: "App Configuration",
    check: () => fs.existsSync("app.config.js") || fs.existsSync("app.json"),
    fix: "Ensure app.config.js or app.json exists",
  },
  {
    name: "Environment Variables",
    check: () => {
      const hasEnvDev = fs.existsSync(".env.development");
      const hasEnvProd = fs.existsSync(".env.production");
      return hasEnvDev && hasEnvProd;
    },
    fix: "Create .env.development and .env.production files",
  },
  {
    name: "Package Dependencies",
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const hasEasScripts =
        packageJson.scripts && packageJson.scripts["build:dev"];
      return hasEasScripts;
    },
    fix: "Add EAS build scripts to package.json",
  },
  {
    name: "Assets Directory",
    check: () => fs.existsSync("assets"),
    fix: "Create assets directory with icon.png, splash.png, etc.",
  },
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${check.name}`);

  if (!passed) {
    console.log(`   💡 Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log("\n" + "=".repeat(50));

if (allPassed) {
  console.log("🎉 All checks passed! Ready to build.");
  console.log("\n📱 Next steps:");
  console.log("1. npm run build:dev:android (for Android)");
  console.log("2. npm run build:dev:ios (for iOS)");
  console.log("3. Install the build on your device");
  console.log("4. npm run dev (to start development server)");
} else {
  console.log(
    "⚠️  Some checks failed. Please fix the issues above before building."
  );
  process.exit(1);
}

console.log("\n🔧 Available build commands:");
console.log("- npm run build:dev - Development build");
console.log("- npm run build:preview - Preview build");
console.log("- npm run build:production - Production build");
console.log("\n📚 For more info, see: EAS_BUILD_GUIDE.md");
