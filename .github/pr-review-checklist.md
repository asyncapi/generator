### What reviewer looks at during PR review
The following are ideal points maintainers look for during review. Reviewing these points yourself beforehand can help streamline the review process and reduce time to merge.

1. **PR Title**: Use a concise title that follows our [Conventional Commits](https://github.com/asyncapi/generator/blob/master/CONTRIBUTING.md#conventional-commits) guidelines and clearly summarizes the change using [imperative mood](https://cbea.ms/git-commit/#imperative) (it means `spoken or written as if giving a command or instruction`, like "add new helper for listing operations")
    > **Note** - In Generator, prepend `feat:` or `fix:` in PR title only when PATCH/MINOR release must be triggered.

1. **PR Description**: Clearly explain the issue being solved, summarize the changes made, and mention the related issue.
    > **Note** - In Generator, we use [Maintainers Work board](https://github.com/orgs/asyncapi/projects/50) to track progress. Ensure the PR Description includes `Resolves #<issue-number>` or `Fixes #<issue-number>` this will automatically close the linked issue when the PR is merged and helps automate the maintainers workflow.

1. **Documentation**: Update the relevant [Generator documentation](https://www.asyncapi.com/docs/tools/generator) to accurately reflect the changes introduced in the PR, ensuring users and contributors have up-to-date guidance.

1. **Comments and JSDoc**: Write clear and consistent JSDoc comments for functions, including parameter types, return values, and error conditions, so others can easily understand and use the code.

1. **DRY Code**: Ensure the code follows the **Don't Repeat Yourself** principle. Look out for duplicate logic that can be reused.

1. **Test Coverage**: Ensure the new code is well-tested with meaningful test cases that pass consistently and cover all relevant edge cases.

1. **Commit History**: Contributors should avoid force-pushing as much as possible. It makes it harder to track incremental changes and review the latest updates.

1. **Template Design Principles Alignment**: While reviewing template-related changes in the `packages/` directory, ensure they align with the [Assumptions and Principles](https://github.com/asyncapi/generator/blob/master/packages/README.md#assumptions-and-principles). If any principle feels outdated or no longer applicable, start a discussion these principles are meant to evolve with the project.

1. **Reduce Scope When Needed**: If an issue or PR feels too large or complex, consider splitting it and creating follow-up issues. Smaller, focused PRs are easier to review and merge.

1. **Bot Comments:**  As reviewers, check that contributors have appropriately addressed comments or suggestions made by automated bots. If there are bot comments the reviewer disagrees with, react to them or mark them as resolved, so the review history remains clear and accurate.