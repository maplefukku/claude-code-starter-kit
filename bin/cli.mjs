#!/usr/bin/env node

/**
 * Claude Code Security Setup - CLI Installer
 *
 * Usage:
 *   npx claude-security-setup [target-dir]
 *
 * Copies the security-setup skill into the target project's .claude/skills/ directory.
 * After installation, run `/security-setup` in Claude Code to start the interactive setup.
 */

import { cpSync, existsSync, readdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const SKILL_SOURCE = join(PACKAGE_ROOT, ".claude", "skills", "security-setup");

// カラー出力
const c = {
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function info(msg) {
  console.log(`${c.blue("[INFO]")} ${msg}`);
}
function ok(msg) {
  console.log(`${c.green("[OK]")} ${msg}`);
}
function warn(msg) {
  console.log(`${c.yellow("[WARN]")} ${msg}`);
}
function error(msg) {
  console.error(`${c.red("[ERROR]")} ${msg}`);
}

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  // --help
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${c.bold("Claude Code Security Setup")}

Usage:
  npx claude-security-setup [target-dir]

Options:
  --force, -f    Overwrite existing installation without prompting
  --help, -h     Show this help message

After installation, run ${c.green("/security-setup")} in Claude Code.
`);
    process.exit(0);
  }

  const force = args.includes("--force") || args.includes("-f");
  const targetDir = resolve(args.find((a) => !a.startsWith("-")) || ".");
  const targetSkillDir = join(targetDir, ".claude", "skills", "security-setup");

  console.log();
  console.log(c.blue("========================================"));
  console.log(c.blue(" Claude Code Security Setup Installer"));
  console.log(c.blue("========================================"));
  console.log();

  // ソース確認
  if (!existsSync(SKILL_SOURCE)) {
    error(`Skill source not found: ${SKILL_SOURCE}`);
    process.exit(1);
  }

  // ターゲット確認
  if (!existsSync(targetDir)) {
    error(`Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  // 既存チェック
  if (existsSync(targetSkillDir) && !force) {
    warn(`Already installed: ${targetSkillDir}`);
    const answer = await ask("Overwrite? (y/N): ");
    if (answer !== "y" && answer !== "yes") {
      info("Installation cancelled.");
      process.exit(0);
    }
  }

  // コピー
  info("Installing security-setup skill...");

  try {
    cpSync(SKILL_SOURCE, targetSkillDir, { recursive: true });
  } catch (e) {
    // Node < 16.7 fallback: manual recursive copy
    error(`Failed to copy: ${e.message}`);
    error("Node.js 16.7+ is required for fs.cpSync.");
    process.exit(1);
  }

  ok("Installation complete!");
  console.log();
  console.log(`  Target: ${c.green(targetSkillDir)}`);
  console.log();
  console.log(`  ${c.yellow("Next steps:")}`);
  console.log(`  1. Open Claude Code in your project`);
  console.log(`  2. Run ${c.green("/security-setup")}`);
  console.log(`  3. Select security features interactively`);
  console.log();

  // ファイル一覧表示
  info("Installed files:");
  listFiles(targetSkillDir, targetSkillDir);
  console.log();
}

function listFiles(dir, baseDir) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relPath = fullPath.replace(baseDir, "").replace(/^\//, "");
      if (entry.isDirectory()) {
        listFiles(fullPath, baseDir);
      } else {
        console.log(`    ${c.green("+")} ${relPath}`);
      }
    }
  } catch {
    // ignore errors
  }
}

main().catch((e) => {
  error(e.message);
  process.exit(1);
});
