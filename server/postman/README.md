## Setup

### 1. Install and run Postman

Download it [here](https://www.postman.com/downloads/) and start it up.

### 2. Create a 311 workspace (optional)

If you create a workspace, all of your 311 stuff will be grouped together, so it won't get jumbled up with anything else you're doing in Postman.

To create one, select "create new" from dropdown menu in the middle of the nav bar (top of the window). Give it a name, select "Personal" type (instead of "Team"), and hit "Create Workspace".

### 3. Import this folder

Click the Import button at the top left, select "Folder" from the tabs, and then select this folder (`/server/postman`) from the finder. The import will add two collections to Postman:
  - **311-all**: a collection containing all of the endpoints that the api currently supports, with prepopulated params for each api call.
  - **311-CI**: a collection containing all of the tests we run during continuous integration. These include tests for bad input -- e.g., a missing required param should return 400, an unsupported endpoint should return a 404.

The import will also add two environments:
  - **311-local**: all api calls go to your local server (which should be running)
  - **311-prod**: api calls go to the production server

### 4. Activate the `311-local` environment.

Just select it from the dropdown at the top right of the window.

## Usage

### Run a single api call

Open the `311-all` collection on the left, and click one of the endpoints. Then click the blue "Send" button next to the url bar. This will send a request to the endpoint and show you the result. If you click around underneath the url bar, you'll find the body of the request (if it's a POST), and in the section below that, the body of the response.

### Run an entire collection

Click "Runner" at the top left to open the collection runner. Then select one of the two collections, select the `311-local` environment, and hit the blue button. Postman will make an api call to your local server for each item in the collection, and print a summary of the results.

Note that the `311-CI` collection contains all of the tests we run whenever you submit a pull request to `dev`. So if you want to help make sure your PR gets approved, run these tests before submitting.

### Run CI tests from the command line

As an alternative to running the CI tests in Postman, you can run them from the command line. Run this command from the `/server` directory:
```
chmod +x postman/test.sh && postman/test.sh
```
