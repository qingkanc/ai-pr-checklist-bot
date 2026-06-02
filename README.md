# ai-pr-checklist-bot

Generate a repository-aware PR review checklist from local rules and changed files.

## Why

AI-assisted PRs can move quickly, but reviewers still need project-specific guardrails. This tool reads rule files such as `AGENTS.md`, `CONTRIBUTING.md`, and `.github/pull_request_template.md`, then combines them with changed-file signals to produce a focused Markdown checklist.

## Install

```bash
npm install
npm run build
```

After publishing to npm, the intended CLI usage is:

```bash
npx ai-pr-checklist-bot --files src/index.ts,test/index.test.ts
```

## CLI Usage

Generate from explicit file paths:

```bash
node dist/cli.js --files src/index.ts,test/index.test.ts,README.md
```

Generate from a Git diff:

```bash
node dist/cli.js --base origin/main
```

Write to a file:

```bash
node dist/cli.js --files src/index.ts --output PR_CHECKLIST.md
```

## GitHub Action Usage

Add this to a workflow after checkout and Node setup:

```yaml
- run: npm ci
- run: npm run build
- uses: ./
  with:
    files: "src/index.ts,test/index.test.ts"
    output: PR_CHECKLIST.md
```

For a published action, replace `uses: ./` with your repository tag.

## Rule Sources

The CLI reads checklist-like bullet points from:

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `CONTRIBUTING.md`
- `.github/pull_request_template.md`

## Diff Signals

Changed files add review prompts for:

- source code
- tests
- documentation
- CI workflows
- package metadata
- structured config and data

## Development

```bash
npm test
npm run build
npm audit
node dist/cli.js --help
```

## License

Apache-2.0
