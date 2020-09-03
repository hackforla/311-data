# 311 API

## Changes

* API now uses FastAPI (uvicorn/ASGI)
* Data access uses Gino, asyncpg
* New code is in the code directory
* Entry point is code/run.py
* Legacy code remains in src directory
* Current API compatibility: code/lacity_data_api/routers/legacy.py

## Running using Docker Compose

Setting for Docker Compose are in the .env file in the server directory. 
The DB_HOST setting should work if it is set to: host.docker.internal

To start the DB and API from the server directory run:

```bash
docker-compose up
```

To try the API:

* Ensure Test API is running with welcome message at http://localhost:5000/
* Test API using Open API (Swagger) at http://localhost:5000/docs
* Run the ReactJS app ```npm start``` from /client to make sure frontend works

## Testing

### Full filter (with zoom and bounds)

```json
{
   "startDate":"01/01/2020",
   "endDate":"08/27/2020",
   "ncList":[
      52,
      46,
      128,
      54,
      104,
      76,
      97,
      121,
      55
   ],
   "requestTypes":[
      "Dead Animal Removal",
      "Homeless Encampment",
      "Single Streetlight Issue",
      "Multiple Streetlight Issue",
      "Feedback"
   ],
   "zoom":13,
   "bounds":{
      "north":34.0731374116421,
      "east":-118.18010330200195,
      "south":33.97582290387967,
      "west":-118.41201782226564
   }
}
```

## TODOs

* add more pytests
* finish routes
* alembic migrations
* data seeds
* Add telemetry:
OpenTelemetry instrumentors exist for FastAPI, asyncpg, SQLAlchemy
https://opentelemetry-python.readthedocs.io/
https://opentelemetry.lightstep.com/

## Odd and Ends

To time API calls using curl: add ```--write-out '%{time_total}\n' --output /dev/null --silent```

For example:

```bash
curl -X POST "http://localhost:5000/map/pins" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"startDate\":\"01/01/2020\",\"endDate\":\"08/27/2020\",\"ncList\":[52,46,128,54,104,76,97,121,55],\"requestTypes\":[\"Homeless Encampment\"]}" --write-out '%{time_total}\n' --output /dev/null --silent
```

Here's how to go about killing any process orphaned by VS Code using port 5000

```bash
lsof -ti tcp:5000 | xargs kill
```

### Format for comparison reports

{
    "startDate":"01/01/2020",
    "endDate":"08/27/2020",
    "requestTypes":[
        "Bulky Items"
    ],
    "chart":"frequency",
    "set1":{
        "district":"nc",
        "list":[
            6
        ]
    },
    "set2":{
        "district":"nc",
        "list":[
            9
        ]
    }
}
