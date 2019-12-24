# Engineering Getting Started
Welcome! This readme assumes you have already listened to the 311-data pitch, and gone through the basic onboarding. The following will be more geared towards the programming side of 311-data and getting your development environment setup. If you run into any issues _please_ submit a new issue and reference [this]([https://github.com/hackforla/311-data/issues/138](https://github.com/hackforla/311-data/issues/138)) issue in the description.

## Feature Branching
For development we use feature branching to ensure easy collaboration. There arent any rules to branch naming or how many branches you are allowed to have but the recommended convention would look like `issueId-Prefix-MinimalDescription`
For example, a documetion branch could look like `138-DOC-OnboardingUpdate`

Read more about feature branching [here]([https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow))

## Default Branch
Building on feature branching, we treat the `dev` branch as the main contribution branch. pull requests to this branch should be as frequent as developers are closing issues *(Hopefully very frequent!)*. Pushes to `master` will be much less frequent and will be handled by administrators and in the future, automation...see Github Actions section. With this workflow, master will have an extra layer of protection and should always represent a working version of the application.

In other words, whenever you are about to start on a new feature, checkout your branch based off of the `dev` branch. Your command would look something like ```git checkout -b 567-BACK-NewEndpoint dev ``` See [this]([https://stackoverflow.com/questions/4470523/create-a-branch-in-git-from-another-branch](https://stackoverflow.com/questions/4470523/create-a-branch-in-git-from-another-branch)) stackoverflow post for more context.
When making new pull requests, make sure you update the base branch to `dev`

## Branch Protection
There are features in place at the `dev` and `master` level to prevent oopsies. At the moment, we are utilizing github actions to run our continuous integration (CI) this includes status checks. When you make a new pull request, github actions will run a set of operations to build and test the entire codebase. If any of these steps fail, the pull request will not be allowed to be merged until they are fixed. From the pull request UI you can find the reason an operation may have failed in the status checks section towards the bottom.
In addition to status checks, PR's are required to have at least one reviewer before being merged into `dev` or `master`

## Github Actions
[Here]([https://github.com/features/actions](https://github.com/features/actions)) is the overview on github actions, I'll let that take care of the documentation :)
If you want to look at our setup, you can find it [here]([https://github.com/hackforla/311-data/actions](https://github.com/hackforla/311-data/actions)) and the configuration [here]([https://github.com/hackforla/311-data/tree/master/.github/workflows](https://github.com/hackforla/311-data/tree/master/.github/workflows))

## Testing
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

## Postgres
Our persistence layer is run by Postgresql. It is recommended to review [this]([https://www.tutorialspoint.com/postgresql/postgresql_overview.htm](https://www.tutorialspoint.com/postgresql/postgresql_overview.htm)) if you are unfamiliar
For local development, we utilize a volatile docker container through docker compose. This is meant for experimentation and working with datasets in isolation. When the application is ready for deployment, the persistence will be offloaded to a shared server in some cloud...somewhere

## Python
Since this project is very data driven, we have targeted python 3 as our backend language. It is utilized in isolation for discovery and exploration. As we get closer to deployment, the exploration work done by the data team will be converted into web server code to enable an interface for the front end to connect to.

## Virtual Environments
Package management in python is handled through our [requirements.txt]([https://github.com/hackforla/311-data/blob/master/server/requirements.txt](https://github.com/hackforla/311-data/blob/master/server/requirements.txt)) When cloning the repo, this file should allow any python developer to retrieve all the requirements necessary to run the backend. A `Virtual Environment` is an organizational practice to isolate your pip dependencies.
It is recommended to review [this]([https://www.geeksforgeeks.org/python-virtual-environment/](https://www.geeksforgeeks.org/python-virtual-environment/)) to get your bearings on virtual environments.
For consistencies sake, it is recommended to create your virtualenvironment like this: ```virtualenv -p python3 ~/.envs/311-data```
This will create the virtual enviroment in the home folder under .envs and it will use python3 as the interpreter.

Running this command does not mean you are _in_ the virtual environment yet. in order to utilize the environment, run ```source ~/.envs/311-data/bin/activate``` and your terminal should now be prefixed with `(311-data)`


## Flask
## React
## API Secrets
## Docker Compose
## Onboarding Script
