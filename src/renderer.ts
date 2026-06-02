import type { ChecklistInput } from './types.js';

export function renderChecklist(input: ChecklistInput): string {
  const lines = [
    `## ${input.title}`,
    '',
    '### Repository Rules',
    '',
    ...renderRules(input),
    '',
    '### Diff-Aware Review Items',
    '',
    ...renderItems(input.inferredItems),
    '',
    '### Changed Files',
    '',
    ...renderChangedFiles(input.changedFiles),
    ''
  ];

  return lines.join('\n');
}

function renderRules(input: ChecklistInput): string[] {
  if (input.rules.length === 0) {
    return ['- [ ] No repository rule files found; confirm project-specific expectations manually.'];
  }

  return input.rules.map((rule) => `- [ ] ${rule.text} _(${rule.source})_`);
}

function renderItems(items: string[]): string[] {
  if (items.length === 0) {
    return ['- [ ] No inferred review items.'];
  }

  return items.map((item) => `- [ ] ${item}`);
}

function renderChangedFiles(changedFiles: string[]): string[] {
  if (changedFiles.length === 0) {
    return ['- none provided'];
  }

  return changedFiles.map((file) => `- \`${file}\``);
}
