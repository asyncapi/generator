# AI Usage Policy

This policy governs the use of generative AI and AI-assisted tooling (LLMs, coding agents, autocomplete assistants, and similar) when contributing to this repository.

> **AI tools are instruments; humans are the only authors.**

You may use AI tools to help you contribute. But the moment you open a pull request or an issue, **you** are the author of every line in it. The tool is not a co-maintainer, it is not accountable, and it cannot be cited as an excuse. This policy exists so that AI accelerates good contributions without lowering the bar for quality, security, or trust.

This is a contributor-facing policy. It is **not** the same as [`AGENTS.md`](AGENTS.md): that file instructs coding agents on *how to write code that fits this repository*, whereas this policy defines *the rules and expectations for humans who use AI to contribute here*.

## When this applies

This policy applies to **any** contribution where a generative AI tool materially assisted in producing the content, including:

- source code, tests, and configuration,
- documentation and template content,
- issue descriptions, and
- review comments.

If you only used AI for spell-checking, search, or to understand existing code, disclosure is not required. If AI generated or substantially shaped the content you are submitting, it is.

## Your responsibilities as a contributor

Before you submit AI-assisted work, you must:

1. **Review it thoroughly.** Read and understand every part of the contribution. If you do not understand it, do not submit it.
2. **Verify quality.** Ensure it meets this project's standards — it builds, tests pass, and it follows the conventions in [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md).
3. **Remove extraneous changes.** Strip out unrelated edits, dead code, speculative abstractions, and noise the tool introduced. Keep the diff focused.
4. **Be prepared to explain it.** You must be able to justify any part of the contribution if a maintainer asks. "The AI wrote it" is not an answer.
5. **Accept responsibility.** You bear full accountability for the contribution, exactly as if you had written every line by hand.
6. **Check licensing.** Confirm that generated material does not reproduce code under incompatible licenses and does not violate this project's [license](LICENSE).

> Blindly copy-pasting AI output introduces security and stability risks. Maintainers may close such pull requests without review.

## Required disclosure

If a contribution was materially AI-assisted, you **must** disclose it:

- **Pull requests:** include a `Generated-by:` line in the PR description naming the tool and its version, for example:

  ```text
  Generated-by: Claude Code 1.x
  Generated-by: GitHub Copilot
  ```

  The pull request template carries a dedicated AI-assistance section — fill in the `Generated-by:` line, or check the "no AI assistance" box if it does not apply. A CI check verifies that one of the two is present; it confirms a declaration exists, it does not and cannot verify its truthfulness.

- **Issues:** note in the issue body that AI assisted in drafting it.

Disclosure is a sign of good faith, not an admission of wrongdoing. We welcome AI-assisted contributions that follow this policy.

## Consequences

- Maintainers may **close non-compliant pull requests without review**, including undisclosed AI-generated PRs and PRs the contributor cannot explain.
- **Repeated violations** are treated as a breach of our [Code of Conduct](CODE_OF_CONDUCT.md) and may result in the contributor being blocked.

If you are unsure whether something falls under this policy, ask a maintainer in the `#generator` channel on [AsyncAPI Slack](https://www.asyncapi.com/slack-invite) before submitting.
