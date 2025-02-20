# 311-Data v1.2

Demo: [https://hackforla.github.io/311-data/](https://hackforla.github.io/311-data/)

## "Democratizing public data to improve community initiatives"

Each day, Los Angelenos report thousands of 311 requests all across LA to resolve issues such as illegal dumping and graffiti in their neighborhoods. These requests are then received by relevant agencies, such as the Police, Building and Safety, or Department of Transportation. The agency responds to the request, addresses it, and then closes it once it is fixed. Thanks to Mayor Eric Garcetti's [Open Data Initiative](https://data.lacity.org/), the expansive amount of data associated with these 311 requests is available online.

We are a group of volunteers with diverse backgrounds who share a common vision: To make 311 request data more accessible and useful for our diverse communities and their representatives through visualization and data science.

By leveraging technology, we can empower local residents and the representatives of our [Neighborhood Councils](https://empowerla.org/councils/) to

- Access
- Analyze
- Visualize

the service request data that gets submitted to Los Angeles's 311 system at https://myla311.lacity.org/.

Our application is open source, built and maintained by volunteers throughout our community, and provides two primary modes of operation:

1. An interactive map showing where different types of 311 requests are being submitted
1. Dashboards that show what types of requests are being made, how quickly they're being resolved, how different councils compare, and more

![screenshot](./assets/screenshot.PNG)

Our mission is to create a user-friendly platform for anyone interested in exploring 311 service requests so that they can immediately gain actionable insights. If you would like to contribute as a volunteer, please visit the [Open Roles Board](https://github.com/orgs/hackforla/projects/67/views/1?filterQuery=repo%3A%22hackforla%2F311-data%22+status%3A%22Currently+Recruiting%22).

## Project Technology

- Node.js
- React.js
- Duckdb-wasm
- Redux
- Material-UI 5.x

### Data Analysis

- Python
- Pandas

### UI/UX

- Figma
- Google Drive

## Quick Start

### Install Node.js

- Ensure that node version manager (nvm) is installed (e.g. follow a [tutorial](https://heynode.com/tutorial/install-nodejs-locally-nvm/))
- Run `nvm install lts/hydrogen` (on windows `nvm install hydrogen`)
- Run `nvm use lts/hydrogen` (on windows `nvm use hydrogen`)
- Confirm you are using **Node 18** by running `node -v` (e.g. `Now using node v18.7.0 (npm v8.9.2)`)

### Set up environment/variables

- Clone the repo
- Run `cd 311-data/`
- Run `cp .example.env .env`
- Edit your new `.env` and supply a valid `VITE_MAPBOX_TOKEN`. If you are a member of hack4la, please contact someone in 311-engineering for one.
- Run `npm run setup`

### Start the development server

- Run `npm start`
- Visit http://localhost:5173

### Run tests

- Run `npm test`

See [contributing.md](contributing.md#testing) for info on writing tests.

### Information About Technologies

- Frontend
  - Mapbox
  - React
  - MUI
  - Vite
  - Vitest
  - React Testing Library
- Backend
  - DuckDb
  - HuggingFace
  - python data transform + Github Actions
  - DbProvider + Context
  - Data Export Queries
  - Bot Email + Support Ticket Automation

## Resources

Public data used in this project:

- [MyLA311 Service Request Data](https://data.lacity.org/browse?q=myla311%20service%20request%20data&sortBy=relevance)
- [CSV and parquet datasets are also available here at huggingface.co](https://huggingface.co/311-data)

The source code for this project is based on the original 311-Data [v2-aws](https://github.com/hackforla/311-data/releases/tag/v2-aws) release.
