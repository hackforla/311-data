# [311 Data](https://www.311-data.org/)

Each day, Los Angelenos report thousands of 311 requests all across LA to resolve issues such as illegal dumping and graffiti in their neighborhoods. These requests are then received by relevant agencies, such as the Police, Building and Safety, or Department of Transportation. The agency responds to the request, addresses it, and then closes it once it is fixed. Thanks to Mayor Eric Garcetti's [Open Data Initiative](https://data.lacity.org/), the expansive amount of data associated with these 311 requests is available online.

To empower local residents and [Neighborhood Councils](https://empowerla.org/councils/) to make informed decisions about how to improve their communities using an easy-to-use application, [Hack For LA](https://www.hackforla.org/) partnered with [EmpowerLA](https://empowerla.org/) to create the [311 Data project](https://www.hackforla.org/projects/311-data). 311 Data makes navigating the wealth of 311 data easier using an open source application built and maintained by volunteers throughout our community. To that end, 311 Data primarily provides two types of visualization:
* An interactive map showing where different types of 311 requests are being submitted
* Dashboards that show what types of requests are being made, how quickly they're being resolved, how different councils compare, and more

![311 Screenshot](docs/images/screenshot.png)

## Project Technology

### Frontend

* Javascript (React)
* Redux
* Bulma
* HTML/CSS

[See here](client/README.md) for more information about 311 Data client technology.

### Server/API

* FastAPI: asynchronous Python REST API
* Redis: key-value caching
* PostgreSql: persistent SQL database
* Prefect: data ingestion pipeline in Python
* Docker: containerized servers hosted in AWS

[See here](server/README.md) for more information about 311 Data server technology.

### Data Analysis

* Python
* Pandas/Numpy/Matplotlib
* PostgreSql
* Socrata API

[See here](docs/data_loading.md) for more information about 311 Data project data analysis.

### UI/UX

* Figma
* Google Drive
* Adobe CC
* Miro

## Joining the 311 Data project

We are looking for volunteers! Those with non-technical skills are welcome as well.

311 Data is part of [Hack for LA](https://www.hackforla.org/) where you can sign up to join weekly onboarding meetings. You can find more information about the current project team [here](https://www.hackforla.org/projects/311-data).

### To Sign Up

* Go to the [Getting Started](https://www.hackforla.org/getting-started) page on the Hack for LA website and learn about the projects and onboarding process.
* Sign up for an onboarding session on the [Hack for LA Meetup](https://www.meetup.com/hackforla/events) page. These session happen every week!

## More Information about the 311 Data project

* [Project background and resources](docs/background.md)
* [Contributing to the project](docs/contributing.md)
* [Data loading and analysis](docs/data_loading.md)
