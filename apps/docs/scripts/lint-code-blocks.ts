#!/usr/bin/env npx tsx

/**
 * Linting script to check that all markdown code blocks with a filetype
 * also have a title property set.
 *
 * Usage: npx tsx scripts/lint-code-blocks.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "../content/docs");

// Regex to match code blocks with filetype
// Matches: ```filetype or ```filetype with attributes
const CODE_BLOCK_REGEX = /```(\w+)([^\n]*)/g;

interface Violation {
  line: number;
  filetype: string;
  attributes: string;
  codeBlock: string;
}

interface FileViolations {
  file: string;
  violations: Violation[];
}

/**
 * Check if a code block has a title property
 */
function hasTitle(attributes: string): boolean {
  // Check for title="..." or title='...'
  return /title\s*=\s*["'][^"']+["']/.test(attributes);
}

/**
 * Extract filetype from code block opening
 */
function getFiletype(match: RegExpExecArray): string {
  return match[1];
}

/**
 * Extract attributes from code block opening
 */
function getAttributes(match: RegExpExecArray): string {
  return match[2] || "";
}

/**
 * Check a single MDX file for violations
 */
function checkFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const violations: Violation[] = [];
  let match: RegExpExecArray | null;

  // Reset regex lastIndex
  CODE_BLOCK_REGEX.lastIndex = 0;

  while ((match = CODE_BLOCK_REGEX.exec(content)) !== null) {
    const filetype = getFiletype(match);
    const attributes = getAttributes(match);
    const lineNumber = content.substring(0, match.index).split("\n").length;

    // Skip if no filetype (plain code blocks)
    if (!filetype || filetype.trim() === "") {
      continue;
    }

    // Check if title is present
    if (!hasTitle(attributes)) {
      violations.push({
        line: lineNumber,
        filetype,
        attributes,
        codeBlock: match[0],
      });
    }
  }

  return violations;
}

/**
 * Recursively find all MDX files in a directory
 */
function findMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main function
 */
function main(): void {
  console.log("Scanning MDX files for code blocks with filetype but no title...\n");

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Error: Directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const mdxFiles = findMdxFiles(DOCS_DIR);
  const allViolations: FileViolations[] = [];

  mdxFiles.forEach((filePath) => {
    const violations = checkFile(filePath);
    if (violations.length > 0) {
      allViolations.push({
        file: path.relative(process.cwd(), filePath),
        violations,
      });
    }
  });

  // Report results
  if (allViolations.length === 0) {
    console.log("✅ All code blocks with filetype have a title property!");
    process.exit(0);
  } else {
    console.error(`❌ Found ${allViolations.length} file(s) with violations:\n`);

    allViolations.forEach(({ file, violations }) => {
      console.error(`\n${file}:`);
      violations.forEach(({ line, filetype, codeBlock }) => {
        console.error(`  Line ${line}: Missing title for code block with filetype "${filetype}"`);
        console.error(`    ${codeBlock.trim()}`);
      });
    });

    console.error(
      `\n\nTotal: ${allViolations.reduce((sum, { violations }) => sum + violations.length, 0)} violation(s)`,
    );
    process.exit(0);
  }
}

main();
