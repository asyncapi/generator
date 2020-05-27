# Templates List Validator

Simple action that runs to check with GitHub API official list of templates and inform about the change.
It indicates where lists of templates must be update to have latest state.

## Development

To try action locally, run the following:
```
GITHUB_TOKEN=your-token npm run start
```

After every change in dependencies or code you need to generate a new bundle for the GitHub Action:
```
npm run package
```