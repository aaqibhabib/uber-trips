'use strict'
// BASE SETUP
// =============================================================================

var filename = process.argv.slice(2);

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

var models = require('./app/models/trip.js');
var Point = models.Point;
var Trip = models.Trip;

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://uber:uber1234@ds039484.mongolab.com:39484/uber'); // connect to our database


// DATA INGESTION
// =============================================================================

if(filename.length === 1) {
	// Clear the DB
	mongoose.connection.collections['trips'].drop( function(err) {
		if (err) {
			console.log("There was an error when attempting to drop the 'trips' collection. Err: " + err);
			return;
		}
		console.log("'trips' collection dropped");
		let path = './' + filename[0];
		console.log("Loading data from: " + path);
		
		
		var uberTrips = require(path);
	
		let dbTrips = uberTrips.map(function (uberTrip) {
			let path = uberTrip.path.map(function(point) {
				return new Point({
					latitude: point[0],
					longitude: point[1],
					time: point[2]
				})
			})
			
			let _len = uberTrip.path.length;
			let startTime = uberTrip.path[0][2];
			let endTime = uberTrip.path[_len - 1][2];
			let durationMins = (endTime - startTime) / 60;
			
			// JS dates takes millisecond epoch, we have seconds epoch
			let startHour = (new Date(uberTrip.path[0][2] * 1000)).getUTCHours();
			let endHour = (new Date(uberTrip.path[_len - 1][2] * 1000)).getUTCHours();
			
			return new Trip({
				driver_id: uberTrip.driver_id,
				driver_name: uberTrip.driver_name,
				passenger_id: uberTrip.passenger_id,
				passenger_name: uberTrip.passenger_name,
				start_hour: startHour,
				end_hour: endHour,
				start_time: startTime,
				end_time: endTime,
				duration_mins: durationMins,
				path: path
			})
		});
		
		for (let dbTrip of dbTrips) {
			dbTrip.save();
		}
	});
}


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'hooray! welcome to the uber api!' });
});

// on routes that end in /trips
// ----------------------------------------------------
router.route('/trips')

// get all the trips (accessed at GET http://localhost:8080/api/trips)
	.get(function (req, res) {
		let query = Trip.find();
		if(req.query.all !== "true") {
			query.select({"path" : 0});
		}

		query.exec(
			function (err, trips) {
			if (err)
				res.send(err);

			res.json(trips);
		});
	});

// on routes that end in /trips/:trip_id
// ----------------------------------------------------
router.route('/trips/:trip_id')

// get the trip with that id
	.get(function (req, res) {
		Trip.findById(req.params.trip_id, function (err, trip) {
			if (err)
				res.send(err);
			res.json(trip);
		});
	})
	
// on routes that end in /search/
// ----------------------------------------------------
router.route('/search/')

// get the trips that meet the requested search params
// driver_name: 'Aaqib Habib', passenger_name: 'Bill Gates', time_of_day: '0-23'
	.get(function (req, res) {
		let driverName = req.query.driver_name;
		let passengerName = req.query.passenger_name;
		let time_of_day = req.query.time_of_day;
		
		let query = Trip.find();
		if(driverName) {
			query.find({'driver_name': driverName});
		}
		if(passengerName){
			query.find({'passenger_name': passengerName});
		}
		if(time_of_day){
			// search for trips that were active during time_of_day (start_hour <= time_of_day <= end_hour)
			query.find({'start_hour' : {$lte : time_of_day}});
			query.find({'start_hour' : {$gte : time_of_day}});
		}
		if(req.query.all !== "true") {
			query.select({"path" : 0});
		}
		query.exec(
			function (err, trips) {
			if (err)
				res.send(err);

			res.json(trips);
		});
	})

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
