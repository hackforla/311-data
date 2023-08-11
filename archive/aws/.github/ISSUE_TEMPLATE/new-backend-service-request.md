---
name: New Backend Service request
about: Describe the inputs and outputs of a frontend request to the backend
title: "[Service] Enter service name here"
labels: ''
assignees: ''

---

# Description
Describe the new service purpose here

## Endpoint
Check or uncheck the supported methods
Accepted methods
  - [ ] GET
  - [ ] POST

Path: ```server:port/{ENTER PATH HERE}```

## Inputs
Describe a quick overview of the inputs here
**Use JSON code flags to describe the json payload**
```json
{
	"startDate":"2015-01-01",
	"endDate":"2015-12-31",
	"ncList": ["SUNLAND-TUJUNGA NC"],
	"requestTypes":["Homeless Encampment"]
}
```
## Outputs
Describe a quick overview of the expected outputs here
**Use JSON code flags to describe the json payload**
```json
{
    "lastPulled": "NOW",
    "data": [
        {
            "ncname": "SUNLAND-TUJUNGA NC",
            "requesttype": "Homeless Encampment",
            "srnumber": "1-79371671",
            "latitude": 34.2500573562,
            "longitude": -118.285967224,
            "address": "TUJUNGA CANYON BLVD AT PINEWOOD AVE, 91042",
            "createddate": 1449835131
        },
        {
            "ncname": "SUNLAND-TUJUNGA NC",
            "requesttype": "Homeless Encampment",
            "srnumber": "1-75982851",
            "latitude": 34.2480072639,
            "longitude": -118.285966934,
            "address": "PINEWOOD AVE AT FOOTHILL BLVD, 91042",
            "createddate": 1449245408
        },
  ]
}
```

**Additional context**
Add any other context about the feature request here.
