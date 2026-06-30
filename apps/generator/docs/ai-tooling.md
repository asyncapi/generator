---
title: "AI tooling"
weight: 240
---

This project uses automated AI tools to assist with code review and to answer questions on pull requests and issues. This page describes those tools, CodeRabbit and Dosu, explaining how they work, how to interact with them, and how much to rely on their output.

> **Note:**
> This page covers the AI tools that the project runs on your contributions. It is distinct from two related documents: the [AI Usage Policy](https://github.com/asyncapi/generator/blob/master/AI-POLICY.md) defines the rules for using AI to write your own contributions, including the required disclosure, while [`AGENTS.md`](https://github.com/asyncapi/generator/blob/master/AGENTS.md) provides guidelines for coding agents that generate code for this repository.

## CodeRabbit

[CodeRabbit](https://www.coderabbit.ai/) automatically reviews pull requests in this repository. Its behavior is configured in [`.coderabbit.yaml`](https://github.com/asyncapi/generator/blob/master/.coderabbit.yaml) at the repo root, so the review is consistent and reproducible.

**What it does on a pull request:**

- Posts an automatic review when a PR is opened and re-reviews incrementally as you push new commits. Draft PRs are not reviewed, and bot accounts (`dependabot`, `asyncapi-bot`) are ignored.
- Adds a high-level summary of the change and a per-file changed-files summary.
- Links the PR to related issues and PRs and assesses whether it addresses its linked issue.
- Runs linters as part of the review: ESLint, markdownlint, yamllint, and actionlint (for GitHub Actions workflows).
- Flags suspected low-effort or AI-generated "slop" with an `AI-Spam` label.
- Enforces a **pre-merge title check**: your PR title must follow our [Conventional Commits guidelines](/docs/tools/generator/contributing#conventional-commits). A non-conforming title fails the check and blocks merge until you fix it.

**How to interact with it:**

CodeRabbit only acts on explicit mentions (it does not auto-reply to every comment). In a PR comment you can use:

- `@coderabbitai review` — trigger a fresh review.
- `@coderabbitai summary` — regenerate the high-level summary.
- `@coderabbitai pause` / `@coderabbitai resume` — stop or restart automatic reviews on the PR.
- `@coderabbitai resolve` — resolve CodeRabbit's open review comments.

**How to treat its feedback:**

CodeRabbit is **advisory**. It is not a maintainer, and its review is **not an approval** — a human maintainer still reviews and approves every PR. Use its suggestions as a helpful first pass and act on the ones that make the change better. You are not obligated to apply a suggestion, but when you choose not to, reply with a comment explaining why.

## Dosu

[Dosu](https://dosu.dev/) answers questions about the project. You can reach it in three ways:

- **On GitHub** — mention `@dosu` in an issue or pull request comment with your question (for example, asking where a feature lives or how a workflow behaves). It does not comment on its own and replies only when mentioned.
- **On Slack** — Dosu is connected to the public `#generator` channel in the [AsyncAPI community Slack](https://www.asyncapi.com/slack-invite), so you can ask it there as well.
- **In its web chat** — ask a question directly in [Dosu's chat for the generator](https://app.dosu.dev/e0d32413-3b37-4b53-85d6-bd7caab075e8/ask).

**How to treat its answers:**

Dosu is useful for **orientation and context**, but its answers are **not authoritative maintainer decisions** and can be wrong or out of date. Verify anything important against the code, the docs, or a maintainer before relying on it. For a binding decision, ask a maintainer in the `#generator` channel on the AsyncAPI community Slack.

## Quick reference

| You want to... | Do this |
|---|---|
| Re-run the CodeRabbit review | Comment `@coderabbitai review` |
| Pause/resume CodeRabbit on a PR | Comment `@coderabbitai pause` / `@coderabbitai resume` |
| Fix a failing title check | Edit the PR title to follow [Conventional Commits](/docs/tools/generator/contributing#conventional-commits) |
| Ask a question about the project | Mention `@dosu` on an issue or PR, ask in the `#generator` Slack channel, or use [Dosu's web chat](https://app.dosu.dev/e0d32413-3b37-4b53-85d6-bd7caab075e8/ask) |

Both tools are assistants, not decision-makers. A human maintainer always has the final say.
