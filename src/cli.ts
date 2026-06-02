#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeChangedFiles } from './analyzer.js';
import { getChangedFilesFromGit } from './git.js';
import { renderChecklist } from './renderer.js';
import { loadRepositoryRules } from './rules.js';

export interface CliOptions {
  root: string;
  base: string;
  files: string[];
  output?: string;
}

const VERSION = '0.1.0';

async function main(argv: string[]): Promise<void> {
  const options = parseArgs(argv);

  if ('help' in options) {
    process.stdout.write(helpText());
    return;
  }

  if ('version' in options) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const root = resolve(options.root);
  const changedFiles = options.files.length > 0 ? options.files : await getChangedFilesFromGit(root, options.base);
  const rules = await loadRepositoryRules(root);
  const markdown = renderChecklist({
    title: 'PR Review Checklist',
    changedFiles,
    rules,
    inferredItems: analyzeChangedFiles(changedFiles)
  });

  if (options.output) {
    await writeFile(resolve(root, options.output), markdown, 'utf8');
    process.stdout.write(`Wrote ${resolve(root, options.output)}\n`);
    return;
  }

  process.stdout.write(markdown);
}

export function parseArgs(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd()
): CliOptions | { help: true } | { version: true } {
  const options: CliOptions = {
    root: env.INPUT_ROOT || cwd,
    base: env.INPUT_BASE || 'origin/main',
    files: splitFiles(env.INPUT_FILES)
  };
  const actionOutput = env.INPUT_OUTPUT;
  if (actionOutput) {
    options.output = actionOutput;
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      return { help: true };
    }
    if (arg === '--version' || arg === '-v') {
      return { version: true };
    }
    if (arg === '--root') {
      options.root = readValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === '--base') {
      options.base = readValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === '--output') {
      options.output = readValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === '--files') {
      options.files.push(...splitFiles(readValue(argv, index, arg)));
      index += 1;
      continue;
    }

    options.files.push(arg);
  }

  return options;
}

function splitFiles(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((file) => file.trim())
    .filter(Boolean);
}

function readValue(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function helpText(): string {
  return `ai-pr-checklist

Generate a repository-aware PR review checklist.

Usage:
  ai-pr-checklist [--root <path>] [--base <ref>] [--output <file>] [--files <a,b,c>]
  ai-pr-checklist src/index.ts test/index.test.ts

Options:
  --root <path>     Repository root. Defaults to current directory.
  --base <ref>      Git base ref used when files are not provided. Defaults to origin/main.
  --output <file>   Write markdown to a file inside the root.
  --files <a,b,c>   Comma-separated changed files.
  -h, --help        Show this help.
  -v, --version     Show version.
`;
}

if (isDirectRun()) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exitCode = 1;
  });
}

function isDirectRun(): boolean {
  const entryPoint = process.argv[1];
  return Boolean(entryPoint) && import.meta.url === pathToFileURL(entryPoint).href;
}
