import { describe, expect, it } from 'vitest';
import { parseArgs } from '../src/cli.js';

describe('cli action inputs', () => {
  it('uses GitHub Action INPUT_* environment variables when args are omitted', () => {
    const options = parseArgs([], {
      INPUT_ROOT: '/repo',
      INPUT_BASE: 'origin/trunk',
      INPUT_FILES: 'src/index.ts,README.md',
      INPUT_OUTPUT: 'PR_CHECKLIST.md'
    });

    expect(options).toEqual({
      root: '/repo',
      base: 'origin/trunk',
      files: ['src/index.ts', 'README.md'],
      output: 'PR_CHECKLIST.md'
    });
  });
});
