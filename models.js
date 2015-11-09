/// <reference path="../typings/tsd.d.ts" />
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema({
	latitude: Number,
	longitude: Number,
	time: Number
})

var TripSchema = new Schema({
	driver_id: Number,
	driver_name: String,
	passenger_id: Number,
	passenger_name: String,
	start_time: Number,
	end_time: Number,
	start_hour: Number,
	end_hour: Number,
	duration_mins: Number,
	path: [PointSchema]
});

exports.Trip = mongoose.model('Trip', TripSchema);
exports.Point = mongoose.model('Point', PointSchema);