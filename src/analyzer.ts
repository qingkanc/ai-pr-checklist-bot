const CATEGORY_RULES: Array<{ test: (path: string) => boolean; item: string }> = [
  {
    test: (path) => /\.(ts|tsx|js|jsx|mjs|cjs|py|java|go|rs)$/.test(path) && !isTestPath(path),
    item: 'Source code changed: confirm behavior, error handling, and public API impact.'
  },
  {
    test: isTestPath,
    item: 'Tests changed: confirm coverage matches the changed behavior and avoids brittle assertions.'
  },
  {
    test: (path) => /(^|\/)(README|CHANGELOG|CONTRIBUTING|AGENTS|CLAUDE|GEMINI)\.md$/i.test(path) || path.startsWith('docs/'),
    item: 'Documentation changed: confirm examples, commands, and claims match the implementation.'
  },
  {
    test: isCiWorkflowPath,
    item: 'CI workflow changed: confirm permissions, triggers, and required checks are appropriate.'
  },
  {
    test: (path) => /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|pyproject\.toml|pom\.xml|go\.mod|Cargo\.toml)$/.test(path),
    item: 'Package metadata changed: confirm scripts, dependencies, engines, and publish contents.'
  },
  {
    test: (path) => !isCiWorkflowPath(path) && (/\.(sql|xml|ya?ml)$/.test(path) || (/\.json$/.test(path) && !isPackageMetadataPath(path))),
    item: 'Structured config or data changed: confirm syntax, escaping, and environment-specific impact.'
  }
];

export function analyzeChangedFiles(changedFiles: string[]): string[] {
  const items = new Set<string>();

  for (const file of changedFiles) {
    for (const rule of CATEGORY_RULES) {
      if (rule.test(file)) {
        items.add(rule.item);
      }
    }
  }

  if (changedFiles.length === 0) {
    items.add('No changed files were provided: confirm the diff source before reviewing.');
  }

  return [...items];
}

function isTestPath(path: string): boolean {
  return /(^|\/)(test|tests|__tests__)\/|\.test\.|\.spec\./.test(path);
}

function isPackageMetadataPath(path: string): boolean {
  return /(^|\/)(package\.json|package-lock\.json)$/.test(path);
}

function isCiWorkflowPath(path: string): boolean {
  return path.startsWith('.github/workflows/') || path === 'action.yml';
}
