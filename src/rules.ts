import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { RepositoryRule } from './types.js';

const RULE_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'CONTRIBUTING.md',
  '.github/pull_request_template.md'
];

export async function loadRepositoryRules(root: string): Promise<RepositoryRule[]> {
  const rules: RepositoryRule[] = [];

  for (const relativePath of RULE_FILES) {
    const content = await readOptionalFile(join(root, relativePath));
    if (!content) {
      continue;
    }

    rules.push(...extractRules(relativePath, content));
  }

  return rules;
}

function extractRules(source: string, content: string): RepositoryRule[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^- \[[ xX]\]\s+/, '- '))
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((text) => ({ source, text }));
}

async function readOptionalFile(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}
