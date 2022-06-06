## Creating or modifying dashboards

The ```dashboards``` directory has the installed dashboards. Adding new dashboards is as simple as dropping new Plotly Dash python files in this directory.

In order to be included in the 311 Data app, a new version of this project needs to be deployed and the report needs to be referenced in the React client header.

### Setting up your local environment

Feel free to use your own preferred environment or follow this process:
- Download and install [Visual Studio Code](https://code.visualstudio.com/download)
- Download and install [Docker Desktop](https://docs.docker.com/desktop/)
- Download and install [GitHub Desktop](https://desktop.github.com/)
- Fork the [311-data repository](https://github.com/hackforla/311-data.git)
- Clone the [311-data repository](https://github.com/hackforla/311-data.git) using GitHub Desktop
- Open the repo in VS Code
- To edit dashboards, follow the steps below using the terminal

### Editing a dashboard locally

The best way to develop new dashboards is by using the development Dash image and mounting a local directory on it. This method requires the least amount of configuration so you can spend your time working on dashboards.

These instructions assume you already have Docker installed and are on a Mac but should be easily transferrable to PC or Linux. 

```zsh
# first make sure you're in the dash directory
cd server/dash

# get the latest development version of the dash image
docker pull la311data/dash-poc:dev

# run the dash container with a local volume
docker run -p 5500:5500 -v "$(pwd)":/app -e PRELOAD=False la311data/dash-poc 

# view a dashboard in your browser
open http://localhost:5500/dashboards/overview

# to test the mount is working change the title property in this dashboard and reload (JUST REMEMBER TO REVERT YOUR CHANGE!)
# when you are done just enter Ctl+C in your terminal to stop the server
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