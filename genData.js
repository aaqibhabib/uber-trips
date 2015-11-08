'use strict'
let _ = require('lodash');
var fs = require('fs');
let newData = [];
let oldData = require('./trips100.json');

for (let trip of oldData) {
	let newTrip = _.cloneDeep(trip);
	let newStartHour = Math.floor(Math.random() * 23) + 0;
	let newStartMin = Math.floor(Math.random() * 59) + 0;
	console.log('----------------------');
	newTrip.path.forEach(function(item, i){
		let tripDate = new Date(item[2] * 1000);
		tripDate.setUTCHours(newStartHour);
		tripDate.setUTCMinutes((newStartMin + i) % 60);
		console.log(tripDate.valueOf() /1000);
		item[2] = tripDate.valueOf() / 1000;
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