# Fix: Add CI check for generated docs on PRs (#2038)

## New Workflow File: `.github/workflows/check-generated-docs.yml`

```yaml
# This workflow verifies that generated documentation (JSDoc → api_components.md, etc.)
# is up to date on every PR. If a contributor edits JSDoc comments without running
# `npm run generate:assets`, this check will fail with a clear remediation message.

name: 'Check Generated Docs'

on:
  pull_request:
    paths:
      - '**/*.js'
      - '**/*.ts'
      - '**/*.tsx'
  push:
    branches:
      - master

permissions:
  contents: read

jobs:
  check-docs:
    name: 'Verify generated docs are up to date'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Determine what node version to use
        uses: asyncapi/.github/.github/actions/get-node-version-from-package-lock@master
        with:
          node-version: ${{ vars.NODE_VERSION }}
        id: lockversion

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "${{ steps.lockversion.outputs.version }}"
          cache: 'npm'
          cache-dependency-path: '**/package-lock.json'

      - name: Install dependencies
        run: npm ci

      - name: Regenerate docs
        run: npm run generate:assets --if-present

      - name: Check for doc changes
        run: |
          if ! git diff --exit-code -- '*.md' 'apps/generator/docs/**' 2>/dev/null; then
            echo "::error::Generated docs are out of date! 📝"
            echo "Please run \`npm run generate:assets\` locally and commit the changes."
            echo ""
            echo "Changed files:"
            git diff --name-only -- '*.md' 'apps/generator/docs/**'
            exit 1
          fi
          echo "✅ Generated docs are up to date"
```

## What This Does

1. **Triggers** on any PR that touches `.js`/`.ts`/`.tsx` files (where JSDoc lives)
2. **Runs** `npm run generate:assets` to regenerate `api_components.md` etc.
3. **Checks** if any `.md` files changed after regeneration
4. **Fails** with clear error message if docs are stale
5. **Passes** silently if everything is in sync

## Notes

- Uses existing `get-node-version-from-package-lock` action (same as other workflows)
- Only checks `.md` output files, not intermediate build artifacts
- The `update-docs-on-docs-commits.yml` workflow becomes redundant but can be kept as a safety net for direct master commits
