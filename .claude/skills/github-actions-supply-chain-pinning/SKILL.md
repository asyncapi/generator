---
name: github-actions-supply-chain-pinning
description: "Use when editing, adding, or reviewing any file under .github/workflows/, or when a CI step installs a CLI tool (npm i -g, npx, pipx, uses: */setup-*). Enforces full commit-SHA pinning for every action and exact-version pinning for installed tools, and checks whether a workflow is generator-owned or synced from asyncapi/.github before editing it."
---

# GitHub Actions Supply-Chain Pinning

You are adding, editing, bumping, or reviewing a GitHub Actions workflow in `asyncapi/generator`. Two rules keep CI's supply chain closed: every action is pinned to a full commit SHA, and every CLI a step installs is pinned to an exact version.

## Invocation

Fires for any edit to `.github/workflows/*`, a new workflow, a review of one, or a CI step that installs a tool. For a **review**, run the preconditions and the Verify step, report what you find, and don't edit.

## Preconditions (fast gate)

Check in order and stop on the first failure.

### 1. `gh` is ready

Run `gh auth status`. If it fails, stop and ask the user to run `! gh auth login`. Never fall back to guessing a SHA or copying one from memory or from another repo.

### 2. Ownership

Some workflows are synced into this repo from `asyncapi/.github` by its `global-replicator.yml`, and the next sync overwrites any local edit. If the file you're about to touch is global-owned, **stop** and point the user to `asyncapi/.github` instead. In review mode, don't stop: report the file as global-owned (fix upstream) and keep reviewing the rest.

Global-owned as of 2026-09:

| Global-owned | Why |
|---|---|
| `add-good-first-issue-labels.yml`, `automerge.yml`, `automerge-for-humans-add-ready-to-merge-or-do-not-merge-label.yml`, `automerge-for-humans-merging.yml`, `automerge-for-humans-remove-ready-to-merge-label-on-edit.yml`, `automerge-orphans.yml`, `autoupdate.yml`, `bounty-program-commands.yml`, `help-command.yml`, `issues-prs-notifications.yml`, `lint-pr-title.yml`, `microgrant-program-commands.yml`, `notify-tsc-members-mention.yml`, `please-take-a-look-command.yml`, `release-announcements.yml`, `stale-issues-prs.yml`, `update-pr.yml`, `welcome-first-time-contrib.yml`, `.github/workflows/scripts/` | generic set, synced to every repo |
| `if-nodejs-pr-testing.yml` | topic `nodejs` |
| `update-docs-on-docs-commits.yml` | topic `get-global-docs-autoupdate` |
| `update-maintainers-trigger.yaml` | every repo |
| `.github/holopin.yml` | topic `get-global-holopin` |

`bump.yml` **looks** global but isn't. Its replicator job needs the `get-global-node-release-workflows` topic, which generator doesn't have, so it's a generator-owned local copy.

This list can go stale. To re-check it live:

```bash
gh api repos/asyncapi/.github/contents/.github/workflows/global-replicator.yml -H "Accept: application/vnd.github.raw" \
  | grep -E "patterns_to_include|topics_to_include|repos_to_ignore"
gh api repos/asyncapi/generator/topics
```

A job's `patterns_to_include` applies to generator when `generator` isn't in that job's `repos_to_ignore` and the job either has no `topics_to_include` or shares a topic with generator.

## Research

### 1. Pick the version

- **Default:** the latest release (`gh api repos/<owner>/<repo>/releases/latest --jq .tag_name`). If that returns 404 (the action publishes tags without GitHub Releases), list the tags with `gh api repos/<owner>/<repo>/tags --paginate --jq '.[].name'` and pick the highest stable semver yourself. That list isn't sorted by version.
- **Reuse** the version the global workflows already run for that action when one exists (for example, `grep -h "uses: actions/checkout@" .github/workflows/automerge.yml`), so the repo converges on one pin per action.
- **Crossing a major version:** read the release notes against how the step actually uses the action's inputs, outputs and env. If our usage breaks, pin the latest release of the current major and write down the deferred upgrade (PR description or an issue). Don't migrate behavior inside a pinning change.
- If a spec or plan already fixed the version, use that version. Don't re-pick "latest".

### 2. Resolve the SHA

```bash
gh api repos/<owner>/<repo>/git/ref/tags/<tag> --jq '.object.type+" "+.object.sha'
# If the type is "tag" (an annotated tag), dereference it to the commit:
gh api repos/<owner>/<repo>/git/tags/<sha> --jq '.object.type+" "+.object.sha'
# Verify the commit exists and matches:
gh api repos/<owner>/<repo>/commits/<commit-sha> --jq .sha
```

Pin the **commit** SHA, never the tag-object SHA. For an action in a subfolder (for example `github/codeql-action/init`), resolve against `<owner>/<repo>` and keep the subpath in the `uses:` line. If any command fails, stop and report it.

A floating ref like `@v1` in an existing workflow may be a **branch**, not a tag, so `git/ref/tags/v1` returns 404. To see what it runs today, use `gh api repos/<owner>/<repo>/git/ref/heads/v1 --jq .object.sha`. To see whether moving to your pin changes behavior at all, use `gh api repos/<owner>/<repo>/compare/<floating-ref>...<pinned-sha> --jq '.status+" ahead="+(.ahead_by|tostring)+" behind="+(.behind_by|tostring)'`. `identical` means no behavior change.

## Execution

1. **Rule 1: actions.** Every `uses:` is `<action>@<40-char commit SHA> # vX.Y.Z`. The comment is exactly `# vX.Y.Z`, with no URL and no extra words. GitHub's own `actions/*` get no exception.
   - **The only exception:** `asyncapi/.github/.github/actions/<name>@master # //NOSONAR`, the org's composite actions. Keep or add the `//NOSONAR` marker. Other `asyncapi/*` actions, such as `asyncapi/cli`, are SHA-pinned like any other action.
   - Local actions (`./path`) have no ref. Docker actions must use `docker://<image>@sha256:<digest>`.
2. **Rule 2: installed CLIs.** Pin exact versions, as this repo already does: `npm i -g netlify-cli@23.9.5`, `npx -p @changesets/cli@2.27.7 changeset …`, `npm i -g npm@8.19.4`. No `@latest`, no bare `npx <tool>`, no unversioned `npm i -g <tool>`, no `version: latest` on a `setup-*` action.
3. **Bumping a pin.** Change the SHA and the comment in the same edit, resolving the new SHA with Research step 2. Never hand-edit only the comment. Make one workflow per commit, so a single breakage can be reverted on its own.
4. **Verify** every edited workflow:
   - This must print nothing. Any line it prints is a floating ref, a short SHA, a missing comment or a malformed comment:
     ```bash
     grep -nE "uses: " <file> \
       | grep -vE "@[0-9a-f]{40} # v[0-9]+\.[0-9]+\.[0-9]+[[:space:]]*$" \
       | grep -vE "uses: asyncapi/\.github/\.github/actions/[^@ ]+@master # //NOSONAR[[:space:]]*$" \
       | grep -vE "uses: (\./|docker://[^@ ]+@sha256:[0-9a-f]{64})"
     ```
   - For each SHA you wrote or changed, the comment's tag resolves to that SHA (Research step 2).
   - `git diff --name-only`: no global-owned file.

## Reference

### Red flags: stop and fix

| You see or are about to write | Do this instead |
|---|---|
| `uses: foo/bar@v4`, `@main`, `@master`, `@latest` | Resolve the commit SHA and pin it with `# vX.Y.Z` |
| `@master`/`@main` on anything other than `asyncapi/.github/.github/actions/*` | Pin by SHA; only the org composite actions float |
| A SHA with no comment, or a comment with a URL or extra words | Rewrite the comment as exactly `# vX.Y.Z`, after checking that tag resolves to that SHA |
| A comment tag that doesn't resolve to the SHA next to it | Re-resolve and replace SHA and comment together |
| A tag-object SHA pinned instead of the commit SHA | Dereference the annotated tag to its commit |
| `npm i -g <tool>@latest`, bare `npx <tool>`, `pipx install <tool>`, `version: latest` | Pin an exact version |
| Editing a global-owned file | Stop; change it in `asyncapi/.github` |
| `pull_request_target` (or `workflow_run`) + checkout of `github.event.pull_request.head.*` + later steps that build or run that code with secrets in scope | Stop and flag it to the user as a pwn-request risk. Pinning doesn't fix it. See `manual-netlify-preview.yml` for a known case. |

### Rationalizations to reject

- "It's just `actions/checkout`, it's from GitHub." → Same risk class as any third-party action (compromised maintainer, re-pointed tag).
- "This repo has no Dependabot, so a SHA will go stale." → That's true: a pin stays exactly as old as the day you wrote it. That's the trade-off we accept, not a reason to float.
- "The comment is enough, I'll fix the SHA later." → A comment that doesn't match its SHA is worse than no comment.
- "Pinning makes the workflow harder to read." → The `# vX.Y.Z` comment restores readability.
- "I'll pin later." → Pin in the same change.

## Non-goals

- CI enforcement (zizmor, or a Dependabot `github-actions` ecosystem config) is a possible follow-up, not part of this skill.
- Fixing a `pull_request_target` design problem. Flag it and hand it to the user; it needs its own issue and PR.
- Editing global-owned workflows.
