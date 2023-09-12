# Engineering Getting Started
Welcome! This readme assumes you have already listened to the 311-data pitch, and gone through the basic onboarding. The following will be more geared towards the programming side of 311-data and getting your development environment setup. If you run into any problems, please submit a new issue.

## Feature Branching
For development we use feature branching to ensure easy collaboration. There aren't any rules to branch naming or how many branches you are allowed to have, but the recommended convention would look like `issueId-Prefix-MinimalDescription`
For example, a documentation branch could look like `138-DOC-OnboardingUpdate`.

Read more about feature branching [here](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).

## Default Branch
Building on feature branching, we treat the 'main' branch as the primary contribution branch. Pull requests to this branch should be as frequent as developers are closing issues (Hopefully very frequent!). Pushes to 'main' will require approval from assigned reviewers before the developer can push and merge their changes.

In other words, whenever you are about to start on a new feature, checkout a new local branch based off of the main branch. Your command would look something like 'git checkout -b 567-BACK-NewEndpoint'. See [this stackoverflow post](https://stackoverflow.com/questions/4470523/create-a-branch-in-git-from-another-branch) for more context.

## Branch Protection/Github Actions (to be implemented)
We use Github Actions to run our continuous integration (CI). These actions include status checks that run whenever you submit a pull request to main. When you submit a PR, Github will run a set of operations to build and test all or part of the codebase. If any of these steps fail, the pull request will not be allowed to be merged until they are fixed. From the pull request UI you can find the reason an operation may have failed in the status checks section towards the bottom.

If you want to look at our setup, check out the "Actions" tab in Github, as well as the [workflows directory](https://github.com/hackforla/311-data/tree/master/.github/workflows), which contains the code that Github runs when actions are triggered.

In addition to status checks, PR's are required to have at least one reviewer before being merged into `master`.

## Testing (to be implmented)
CI Is driven by tests, they help instill confidence in pull requests because a developer can say "All the status checks pass and my new tests pass so the PR is safe to merge" When contributing new features, it is most ideal to write at least 4 tests targeting your code.
  - One for the "happy path"
    - Test the endpoint/feature in the way it is intended to be used
  - One for the "extreme path"
    - Test with extreme inputs/characteristics (What if I use 10,000 XYZ)
  - One for the "negative path"
    - Test with strange input, (What if I send characters to a function that expects integers)
  - One for the "null path"
    - Test with empty params/nothing/emptiness
Our front end tests are run through Enzyme and our backend tests are run through Pytest.

