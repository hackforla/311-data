# Dash Report Server

This project is the reporting system used in the [311 Data project](https://311-data.org). It is powered by [Plotly Dash](https://dash.plotly.com/) to create reports with Python that can run interactively as React components in a web browser.

## Why did we use Plotly Dash?

Creating reports with Dash has several benefits:

- different layouts for each report
- fine-grained control over axes, grids, legends, etc.
- ability to merge data from different sources
- can easily leverage calculations and statistical tools
- uses standard Pandas, Numpy and other python libraries
- straight-forward to make reports responsive

**However, the main benefit is the workflow.**

With this approach we can have dedicated data analysts/scientists prototype reports in Jupyter notebooks using the Dash plug-in, get feedback/iterate, and package the report for inclusion in this app.

## How does it work?

Dash runs in a container deployed to AWS.

The reports get data using simple pandas get_json calls the API Server. Calls are either to the 311 Data API `/reports` endpoint to get aggregated data about service requests or the `/requests` endpoint to get disaggregated records.

It runs as a single embedded Flask app and routes requests to a specific report based on the query string. The reports themselves are self-contained single files with the data and layouts needed by Dash.

## Running the Dash Report Server

In production, the server is intended to be run in a container with gunicorn workers. If you have Docker installed you can run it locally this way:

```bash
docker build .
docker run -p 5500:5500 dash-poc
```

### Configuration

There is required configuration variable, `API_HOST`, which needs to be configured to point to the 311 Data API server that will be used as the data source. It defaults to the dev API server.

There is also an optional config setting, `PRELOAD`, which instructs the Dash Report Server to run all the dashboards at startup so that the reports are pre-cached. This should be set to True in production environments.

## Creating or Modifying Dashboards

The ./dashbords directory has the installed dashboards. Adding new dashboards is as simple as dropping new Plotly Dash report files in this directory.

In order to be included in the 311 Data app, a new version of this project needs to be deployed and the report needs to be referenced in the React client header.

<!--
docker build -t la311data/dash-poc .
docker run -p 5500:5500 la311data/dash-poc

aws lightsail push-container-image --region us-east-1 --service-name dash-reporting --label dash-poc --image la311data/dash-poc --profile 311user

lsof -ti:5500 | xargs kill
>
