---
title: "Development setup"
weight: 210
---

This guide helps you set up the `generator` locally and run it. For testing see [Testing](/docs/tools/generator/development-testing); for releasing see [Release process](/docs/tools/generator/release-process); for the AI tools that review your PRs see [AI tooling](/docs/tools/generator/ai-tooling).

## Before you begin - new contributor onboarding

New to AsyncAPI Generator? We strongly recommend watching our comprehensive onboarding webinar first:

**Watch: [One Tool, One Flow: AsyncAPI's New Take on Code/Docs/Config Generation](https://www.youtube.com/watch?v=Mkd7FgKOMNE)**

### What you'll learn:

- What AsyncAPI is and the challenges it solves
- The origins and evolution of the Generator (legacy vs. future architecture)
- Understanding event-driven architectures and protocol complexity
- How the Generator works: templates, render engines, and the generation process
- Component-based template development for better reusability
- Baked-in templates and the monorepo structure
- Live demonstrations of code generation from AsyncAPI documents

This webinar provides essential context about the Generator's architecture, design decisions, and development workflow. Watching it will make the rest of this development guide much clearer and help you contribute more effectively.

## Getting started

1. Fork & Clone the repository:

First fork the repository from github and then clone it,

```bash
git clone https://github.com/{your_username}/generator.git
cd generator
```

After cloning the repository, you should setup the fork properly and configure the `remote` repository as described in the [AsyncAPI git workflow guidelines](https://github.com/asyncapi/community/blob/master/docs/010-contribution-guidelines/git-workflow.md)

2. Install dependencies:

```bash
npm install --workspaces
```

**`CLAUDE.md` vs `AGENTS.md`:** The repo may ship `CLAUDE.md` as a symlink to [`AGENTS.md`](https://github.com/asyncapi/generator/blob/master/AGENTS.md) (one canonical guidelines file). After a clone, Linux and macOS usually need no extra step. On **Windows**, turn on **Developer Mode** (or equivalent symlink permission), run `git config core.symlinks true`, then `git checkout -- CLAUDE.md` so Git creates a real link—not a one-line text stub. Edit **`AGENTS.md`** only for content; the symlink follows automatically.

## Additional commands

- Lint the code: `npm run lint`
- Generate documentation: `npm run docs`
- Build Docker image: `npm run docker:build`

## Troubleshooting

If you encounter any issues during development or testing, please check the following:

1. Ensure you're using the correct Node.js version (24.11 or higher) and npm version (11.5.1 or higher).
2. Clear the `node_modules` directory and reinstall dependencies if you encounter unexpected behavior.
3. For Docker-related issues, make sure Docker is running and you have sufficient permissions.

If problems persist, please open an issue on the GitHub repository.
