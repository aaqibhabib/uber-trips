# Overview
A simple api for viewing Uber data. `trips100.json` is the provided file, however is limited in timestamp spread. `genData.js` is a utility that uses `trips100.json` and spreads `start_hour` and increases the duration of each trip. This is the file used to seed the DB.

This app relies on using a MongoDB instance hosted on MongoLab.

# Requirements
 This app is designed to work on ES6 systems. Make sure you have v4+ NodeJS environment and an ES6 browser (new Chrome will do).

# Installing
1. git clone https://github.com/aaqibhabib/uber-trips.git
2. cd uber-trips
3. npm install
4. bower install
5. gulp scripts


- To seed data, run: `node app trips100-ah.json` OR any JSON file containing trip data located in the root directory. Warning: This will drop the previous collection.
- To launch the app, run `node app.js` and navigate to `http://localhost:8080/`

Note: `trips100-ah.json` is created using `genData.js` and spreads the start times throughout the day which makes for interesting statistics. 
`trips100.json` is the original that has all trips starting the same time.

# Limitations
1. Limited request/response error handling
2. Responses are not truncated to max length

# API Overview
Base URL: [host:port]/[route]

## /api/
*Returns JSON of welcome message.*

#### Request:

/api/

#### Response:
```
{
  "message": "hooray! welcome to the uber api!"
}
```

## /api/trip/
*Returns array of all trips*

#### Request:
/api/trip/
#### Response:

```
[
  {
    "_id": "563fe6d2c9f3128c0da06248",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 7,
    "end_hour": 7,
    "start_time": 1444981086,
    "end_time": 1444981746,
    "duration_mins": 11,
    "__v": 0
  },
  ...
]
```

### Option:
#### /api/trip/?all=true
Returns all trips with path array

##### Request:
/api/trip/?all=true
##### Response:
```
[
  {
    "_id": "563fe6d2c9f3128c0da06248",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 7,
    "end_hour": 7,
    "start_time": 1444981086,
    "end_time": 1444981746,
    "duration_mins": 11,
    "__v": 0,
    "path": [
      {
        "_id": "563fe6d2c9f3128c0da0623c",
        "time": 1444981086,
        "longitude": -80.09118412563276,
        "latitude": 40.461998020663984
      },
      {
        "_id": "563fe6d2c9f3128c0da0623d",
        "time": 1444981146,
        "longitude": -80.09877987372587,
        "latitude": 40.45286731148913
      },
	  ...
	],
	...
]
```
## /api/trip/:trip_id/
*Returns a trip matching `trip_id`*

#### Request:
/api/trip/563fe6d2c9f3128c0da06248/

#### Response:
```
{
	"_id": "563fe6d2c9f3128c0da06248",
	"driver_id": 1,
	"driver_name": "Alice Aardvark",
	"passenger_id": 104,
	"passenger_name": "Danielle Daffodil",
	"start_hour": 7,
	"end_hour": 7,
	"start_time": 1444981086,
	"end_time": 1444981746,
	"duration_mins": 11,
	"__v": 0,
	"path": [
		{
		"_id": "563fe6d2c9f3128c0da0623c",
		"time": 1444981086,
		"longitude": -80.09118412563276,
		"latitude": 40.461998020663984
		},
		{
		"_id": "563fe6d2c9f3128c0da0623d",
		"time": 1444981146,
		"longitude": -80.09877987372587,
		"latitude": 40.45286731148913
		},
		...
	]
}
```

## /api/trips/stats/
*Returns an object containing key statistics*

Includes driver names, passenger names, and histogram of which hour trips started

#### Request:
/api/trips/stats/

#### Response:

```
{
  "drivers": [
    {
      "_id": "Alice Aardvark",
      "count": 13
    },
    {
      "_id": "Henry Horse",
      "count": 10
    },
    {
      "_id": "Dave Dog",
      "count": 9
    },
    ...
  ],
  "passengers": [
    {
      "_id": "Fran Fuchsia",
      "count": 11
    },
    {
      "_id": "Beth Brown",
      "count": 4
    },
    {
      "_id": "Inigo Indigo",
      "count": 7
    },
    ...
  ],
  "hours": [
    {
      "_id": 22,
      "count": 2
    },
    {
      "_id": 1,
      "count": 3
    },
    {
      "_id": 9,
      "count": 7
    },
    ...
  ]
}
```

## /api/search/
*Returns trips matching search parameters. Only 1 parameter is required for a valid request*

/api/search/?driver_name=[Driver-Name]&passenger_name=[Passenger-Name]&time_of_day=[Time-of-Day]

Path Variable Key | Value | Notes
--- | --- | ---
driver_name | Alice+Aardvark | Driver name, must be URI encoded. *Optional*
passenger_name | Danielle+Daffodil | Passenger name, must be URI encoded. *Optional*
start_hour | 14 | Searches for trips that started this UTC hour. Any value 0-23 is valid. *Optional*

Includes driver names, passenger names, and histogram of which hour trips started

### Option:
#### /api/search/?all=true
Returns all trips with path array

#### Request:

/api/search/?driver_name=Alice+Aardvark&passenger_name=Danielle+Daffodil

#### Response: 

```
[
  {
    "_id": "563fe6d2c9f3128c0da06248",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 7,
    "end_hour": 7,
    "start_time": 1444981086,
    "end_time": 1444981746,
    "duration_mins": 11,
    "__v": 0
  },
  {
    "_id": "563fe6d2c9f3128c0da0668d",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 7,
    "end_hour": 7,
    "start_time": 1444979286,
    "end_time": 1444979706,
    "duration_mins": 7,
    "__v": 0
  },
  {
    "_id": "563fe6d2c9f3128c0da0657d",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 17,
    "end_hour": 18,
    "start_time": 1445015586,
    "end_time": 1445019186,
    "duration_mins": 60,
    "__v": 0
  },
  {
    "_id": "563fe6d2c9f3128c0da06d90",
    "driver_id": 1,
    "driver_name": "Alice Aardvark",
    "passenger_id": 104,
    "passenger_name": "Danielle Daffodil",
    "start_hour": 9,
    "end_hour": 10,
    "start_time": 1444986426,
    "end_time": 1444990866,
    "duration_mins": 74,
    "__v": 0
  }
]
```

### Request:

/api/search/?start_hour=22&all=true

### Response:

```
[
  {
    "_id": "563fe6d2c9f3128c0da0717d",
    "driver_id": 8,
    "driver_name": "Henry Horse",
    "passenger_id": 109,
    "passenger_name": "Inigo Indigo",
    "start_hour": 22,
    "end_hour": 22,
    "start_time": 1445033046,
    "end_time": 1445034546,
    "duration_mins": 25,
    "__v": 0,
    "path": [
      {
        "_id": "563fe6d2c9f3128c0da07163",
        "time": 1445033046,
        "longitude": -79.94542643965275,
        "latitude": 40.3962723166408
      },
      {
        "_id": "563fe6d2c9f3128c0da07164",
        "time": 1445033106,
        "longitude": -79.95048025606539,
        "latitude": 40.387147768208365
      },
      ...
    ]
  },
  {
    "_id": "563fe6d2c9f3128c0da073ee",
    "driver_id": 9,
    "driver_name": "Iris Iguana",
    "passenger_id": 102,
    "passenger_name": "Beth Brown",
    "start_hour": 22,
    "end_hour": 0,
    "start_time": 1445036226,
    "end_time": 1445041986,
    "duration_mins": 96,
    "__v": 0,
    "path": [
      {
        "_id": "563fe6d2c9f3128c0da0738d",
        "time": 1445036226,
        "longitude": -80.04504945446011,
        "latitude": 40.46896260787359
      },
      {
        "_id": "563fe6d2c9f3128c0da0738e",
        "time": 1445036286,
        "longitude": -80.03607337938526,
        "latitude": 40.4592908621018
      },
      ...
    ]
  }
]
```

## /api/search/geo/
*Returns array of trips that fall within specified bounding box*

Path Variable Key | Value | Notes
--- | --- | ---
latitude_min | Latitude | 40.48989831269914
latitude_max | Latitude | 40.48989831269918
longitude_min | Longitude | -79.87964735936295
longitude_max | Longitude | -79.87964735936291

### Request:

/api/search/geo/?latitude_min=[latitude_min]&latitude_max[latitude_max]&longitude_min=[longitude_min]&longitude_max=[longitude_max]

/api/search/geo/?latitude_min=40.48989831269914&latitude_max=40.48989831269918&longitude_min=-79.87964735936295&longitude_max=-79.87964735936291

### Response:

```
[
  {
    "_id": "564028928b2b9fdc2a327294",
    "driver_id": 3,
    "driver_name": "Carol Cheetah",
    "passenger_id": 101,
    "passenger_name": "Adam Aqua",
    "start_hour": 8,
    "end_hour": 8,
    "start_time": 1444984506,
    "end_time": 1444984566,
    "duration_mins": 1,
    "__v": 0,
    "path": [
      {
        "_id": "564028928b2b9fdc2a327292",
        "time": 1444984506,
        "longitude": -79.87964735936293,
        "latitude": 40.48989831269916
      },
      {
        "_id": "564028928b2b9fdc2a327293",
        "time": 1444984566,
        "longitude": -79.87477469113861,
        "latitude": 40.48821477266711
      }
    ]
  }
]
```