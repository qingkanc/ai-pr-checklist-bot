import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { loadRepositoryRules } from '../src/rules.js';

describe('loadRepositoryRules', () => {
  it('extracts concise checklist rules from repository instruction files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ai-pr-checklist-rules-'));
    await mkdir(join(root, '.github'), { recursive: true });
    await writeFile(
      join(root, 'AGENTS.md'),
      [
        '# AGENTS',
        '- Keep changes scoped to the current request.',
        '- Run at least one local verification command.',
        '- Do not commit secrets.'
      ].join('\n')
    );
    await writeFile(
      join(root, '.github', 'pull_request_template.md'),
      [
        '## Checklist',
        '- [ ] Tests updated',
        '- [ ] Docs updated'
      ].join('\n')
    );

    const rules = await loadRepositoryRules(root);

    expect(rules).toEqual([
      {
        source: 'AGENTS.md',
        text: 'Keep changes scoped to the current request.'
      },
      {
        source: 'AGENTS.md',
        text: 'Run at least one local verification command.'
      },
      {
        source: 'AGENTS.md',
        text: 'Do not commit secrets.'
      },
      {
        source: '.github/pull_request_template.md',
        text: 'Tests updated'
      },
      {
        source: '.github/pull_request_template.md',
        text: 'Docs updated'
      }
    ]);
  });
});
