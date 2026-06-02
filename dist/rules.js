import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const RULE_FILES = [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'CONTRIBUTING.md',
    '.github/pull_request_template.md'
];
export async function loadRepositoryRules(root) {
    const rules = [];
    for (const relativePath of RULE_FILES) {
        const content = await readOptionalFile(join(root, relativePath));
        if (!content) {
            continue;
        }
        rules.push(...extractRules(relativePath, content));
    }
    return rules;
}
function extractRules(source, content) {
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
async function readOptionalFile(path) {
    try {
        return await readFile(path, 'utf8');
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return undefined;
        }
        throw error;
    }
}
