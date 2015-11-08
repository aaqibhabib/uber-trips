'use strict'
let _ = require('lodash');
var fs = require('fs');
let newData = [];
let oldData = require('./trips100.json');

for (let trip of oldData) {
	let newTrip = _.cloneDeep(trip);
	let newStartHour = Math.floor(Math.random() * 23) + 0;
	let newStartMin = Math.floor(Math.random() * 59) + 0;
	let tripStartDateTime = new Date(trip.path[0][2] * 1000);
	tripStartDateTime.setUTCHours(newStartHour);
	tripStartDateTime.setUTCMinutes(newStartMin);
	
	console.log('----------------------');
	newTrip.path.forEach(function(item, i){
		// increment by 1 min
		item[2] = (tripStartDateTime.valueOf() / 1000) + (60 * i);
		console.log(item[2]);
	})
	newData.push(newTrip);
}

var outputFilename = './trips100-ah.json';

fs.writeFile(outputFilename, JSON.stringify(newData, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
}); 