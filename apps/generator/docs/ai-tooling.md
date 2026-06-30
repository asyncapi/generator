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

- Posts an automatic review when a PR is opened and re-reviews incrementally as you push new commits. Draft PRs are not reviewed; bot accounts (`dependabot`, `asyncapi-bot`) are ignored.
- Adds a high-level summary of the change and a per-file changed-files summary.
- Links the PR to related issues and PRs and assesses whether it addresses its linked issue.
- Runs linters as part of the review: ESLint, markdownlint, yamllint, and actionlint (for GitHub Actions workflows).
- Flags suspected low-effort or AI-generated "slop" with an `AI-Spam` label.
- Enforces a **pre-merge title check**: your PR title must follow our [Conventional Commits guidelines](https://github.com/asyncapi/generator/blob/master/CONTRIBUTING.md#conventional-commits). A non-conforming title fails the check and blocks merge until you fix it.

**How to interact with it:**

CodeRabbit only acts on explicit mentions (it does not auto-reply to every comment). In a PR comment you can use:

- `@coderabbitai review` — trigger a fresh review.
- `@coderabbitai summary` — regenerate the high-level summary.
- `@coderabbitai pause` / `@coderabbitai resume` — stop or restart automatic reviews on the PR.
- `@coderabbitai resolve` — resolve CodeRabbit's open review comments.

**How to treat its feedback:**

CodeRabbit is **advisory**. It is not a maintainer, and its review is **not an approval** — a human maintainer still reviews and approves every PR. Use its suggestions as a helpful first pass: act on the ones that make the change better, and explain in a reply when you disagree. If a suggestion is wrong, say so; you are not obligated to apply it.

## Dosu

[Dosu](https://dosu.dev/) answers questions on issues and pull requests. It does not comment on its own — you reach it by mentioning it.

**How to use it:**

- Mention `@dosu` in an issue or PR comment with your question (for example, asking where a feature lives or how a workflow behaves). Dosu replies with an answer drawn from the repository and its history.

**How to treat its answers:**

Dosu is useful for **orientation and context**, but its answers are **not authoritative maintainer decisions** and can be wrong or out of date. Verify anything important against the code, the docs, or a maintainer before relying on it. For a binding decision, ask a maintainer in the `#generator` channel on [AsyncAPI Slack](https://www.asyncapi.com/slack-invite).

## Quick reference

| You want to... | Do this |
|---|---|
| Re-run the CodeRabbit review | Comment `@coderabbitai review` |
| Pause/resume CodeRabbit on a PR | Comment `@coderabbitai pause` / `@coderabbitai resume` |
| Fix a failing title check | Edit the PR title to follow [Conventional Commits](https://github.com/asyncapi/generator/blob/master/CONTRIBUTING.md#conventional-commits) |
| Ask a question about the project | Comment `@dosu <your question>` on the issue or PR |
| Disagree with a bot | Reply explaining why; a human maintainer makes the final call |

Both tools are assistants, not decision-makers. A human maintainer always has the final say.
