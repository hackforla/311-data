
To try it:

Start new server from API directory with python code/run
Ensure Test API is running with welcome message at http://localhost:5000/
Test API using OpenAPI at http://localhost:5000/docs
Run the ReactJS app to make sure frontend works


TODO:
* add some pytests
* finish routes
* alembic migrations
* data seeds


add ```--write-out '%{time_total}\n' --output /dev/null --silent``` to curls

```bash
curl -X POST "http://localhost:5000/map/pins" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"startDate\":\"01/01/2020\",\"endDate\":\"08/27/2020\",\"ncList\":[52,46,128,54,104,76,97,121,55],\"requestTypes\":[\"Homeless Encampment\"]}" --write-out '%{time_total}\n' --output /dev/null --silent
```

killing
```bash
lsof -i :5000
| kill -9

```

### Full filter OLD FORMAT
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
      "Feedback",
      "Bulky Items",
      "Electronic Waste",
      "Metal/Household Appliances",
      "Graffiti Removal",
      "Illegal Dumping Pickup",
      "Other"
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


### Full filter: NEW FORMAT
```json
{
   "startDate":"2020-01-01",
   "endDate":"2020-08-27",
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
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
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


# Old format

{
    "startDate": "01/01/2020",
    "endDate": "08/27/2020",
    "ncList": [52, 46, 128, 54, 104, 76, 97, 121, 55],
    "requestTypes": ["Homeless Encampment"]
}

# New format

{
    "startDate": "2020-01-01",
    "endDate": "2020-08-27",
    "ncList": [52, 46, 128, 54, 104, 76, 97, 121, 55],
    "requestTypes": [6]
}
