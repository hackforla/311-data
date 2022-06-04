## Creating or modifying dashboards

The ```dashboards``` directory has the installed dashboards. Adding new dashboards is as simple as dropping new Plotly Dash python files in this directory.

In order to be included in the 311 Data app, a new version of this project needs to be deployed and the report needs to be referenced in the React client header.

### Setting up your local environment

Feel free to use your own preferred environment or follow this process:
- Download and install [Visual Studio Code](https://code.visualstudio.com/download)
- Download and install [Docker Desktop](https://docs.docker.com/desktop/)
- Download and install [GitHub Desktop](https://desktop.github.com/)
- Make sure that you are running Python 3.7 (run `python --version` in your terminal to check)
- Fork the [311-data repository](https://github.com/hackforla/311-data.git)
- Clone the [311-data repository](https://github.com/hackforla/311-data.git) using GitHub Desktop
- Open the repo in VS Code
- To edit dashboards, follow the steps below using the terminal

### Editing a dashboard locally

```zsh
# First make sure you're in the dash directory.
cd server/dash

# Install the requirements.
pip install -r requirements.txt

# Run the server. 
gunicorn --bind 0.0.0.0:5500 --timeout 300 --workers 2 index:server --reload

# View a dashboard in your browser.
open http://localhost:5500/dashboards/overview

# To view your changes, edit a file and save it.
# The server will log something like "Worker reloading: <file> modified."
# Wait until it says "Report Server ready" again, and
# then you can refresh the dash webpage and see your changes.
```

When you have the dashboard completed, you should follow the standard Git workflow of committing, pushing, and issuing a pull request. Note that there are several pre-commit hooks that will run before you can merge. Once your PR is accepted, your changes will automatically be merged to dev and a new Dash Docker image will be published.

### Git workflow cheat sheet

```zsh
# check git status
git status

# load your changes to the staging area
# this assumes that you are in the server/dash directory as shown above
git add filename.py   

#commit your changes
git commit -m "add a detailed description of the changes you made"

#push your changes to the dev branch
git push origin dev
```
The final step is to create a pull request [here](https://github.com/hackforla/311-data/pulls)