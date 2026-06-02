import { describe, expect, it } from 'vitest';
import { analyzeChangedFiles } from '../src/analyzer.js';

describe('analyzeChangedFiles', () => {
  it('maps changed files to focused review categories', () => {
    const result = analyzeChangedFiles([
      'src/cli.ts',
      'test/cli.test.ts',
      'README.md',
      '.github/workflows/ci.yml',
      'package.json'
    ]);

    expect(result).toEqual([
      'Source code changed: confirm behavior, error handling, and public API impact.',
      'Tests changed: confirm coverage matches the changed behavior and avoids brittle assertions.',
      'Documentation changed: confirm examples, commands, and claims match the implementation.',
      'CI workflow changed: confirm permissions, triggers, and required checks are appropriate.',
      'Package metadata changed: confirm scripts, dependencies, engines, and publish contents.'
    ]);
  });
});
