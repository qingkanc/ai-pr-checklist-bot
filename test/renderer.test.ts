import { describe, expect, it } from 'vitest';
import { renderChecklist } from '../src/renderer.js';

describe('renderChecklist', () => {
  it('renders repository rules and inferred review items as markdown', () => {
    const markdown = renderChecklist({
      title: 'PR Review Checklist',
      changedFiles: ['src/index.ts'],
      rules: [
        {
          source: 'AGENTS.md',
          text: 'Run at least one local verification command.'
        }
      ],
      inferredItems: ['Source code changed: confirm behavior.']
    });

    expect(markdown).toContain('## PR Review Checklist');
    expect(markdown).toContain('- [ ] Run at least one local verification command. _(AGENTS.md)_');
    expect(markdown).toContain('- [ ] Source code changed: confirm behavior.');
    expect(markdown).toContain('- `src/index.ts`');
  });
});
