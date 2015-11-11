/// <reference path="../typings/tsd.d.ts" />
(function () {
	'use strict'
	var app = angular.module('App', ['ui.bootstrap', 'uiGmapgoogle-maps'])
		.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
			GoogleMapApi.configure({
				key: 'AIzaSyBze806-3Y6hyyTbhLgUwqhszaVb-kBVyg',
				libraries: '' // Load with no extra libs, faster
			});
		}]);

	var baseUrl = '/api/';
	
	/**
	 * Question 1
	 * Shows all trips in the system
	 */
	app.controller('Q1Ctrl', function ($scope, $http) {
		$scope.maxSize = 10;
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		
		// Get trips
		$scope.trips = [];
		$http.get(baseUrl + 'trips/').then(function (res) {
			$scope.trips = res.data;
			$scope.totalItems = res.data.length;
		}).catch(function () {
			console.error('Could not get short trip info.');
		});
	});
	
	/**
	 * Question 2
	 * Allows a user to search by driver, passenger, and hour of day
	 */
	app.controller('Q2Ctrl', function ($scope, $http) {
		// $scope.selectedDriver;
		// $scope.selectedPassenger;
		// $scope.selectedHour;
		$scope.trips = [];

		$scope.drivers = [];
		$scope.passengers = [];
		// Shortcut to get i = 0 -> 23
		$scope.hourRange = new Array(24);

		$http.get(baseUrl + 'trips/stats/').then(function (res) {
			$scope.stats = res.data;
			$scope.drivers = res.data.drivers.map(function (driver) {
				return driver['_id'];
			});

			$scope.passengers = res.data.passengers.map(function (passenger) {
				return passenger['_id'];
			});

			$scope.update = function () {
				
				// NOTE: Angular will do encodeUri, no need to do manually do it.
				var url = baseUrl + '/search/?';
				
				// Add selected driver if available
				if ($scope.selectedDriver) {
					url += '&driver_name=' + $scope.selectedDriver;
				}
				
				// Add selected passenger if available
				if ($scope.selectedPassenger) {
					url += '&passenger_name=' + $scope.selectedPassenger;
				}
				
				// Add selected hour if available
				if ($scope.selectedHour) {
					url += '&start_hour=' + $scope.selectedHour;
				}

				// Only need 1 parameter specified
				if ($scope.selectedDriver || $scope.selectedPassenger || $scope.selectedHour) {
					$http.get(url).then(function (res) {
						$scope.trips = res.data;
					});
				} else {
					$scope.trips = [];
				}
			}
		}).catch(function () {
			console.error('Could not get stats info.');
		});
	});
	
	/**
	 * Question 3
	 * Allows a user to search by geo coords (bounding box)
	 */
	app.controller('Q3Ctrl', function ($scope, $http) {
		$scope.longitudeMin = "";
		$scope.longitudeMax = "";
		$scope.latitudeMin = "";
		$scope.latitudeMax = "";
		$scope.trips = [];

		$scope.update = function () {
			$scope.longitudeMin = $scope.longitudeMin.toString().replace(/[^0-9.-]/g, '');
			$scope.longitudeMax = $scope.longitudeMax.toString().replace(/[^0-9.-]/g, '');
			$scope.latitudeMin = $scope.latitudeMin.toString().replace(/[^0-9.-]/g, '');
			$scope.latitudeMax = $scope.latitudeMax.toString().replace(/[^0-9.-]/g, '');
		}

		$scope.search = function () {
			var longMin = $scope.longitudeMin;
			var longMax = $scope.longitudeMax;
			var latMin = $scope.latitudeMin;
			var latMax = $scope.latitudeMax;

			if (longMin && longMax && latMin && latMax) {
				var url = baseUrl + 'search/geo/?';
				url += 'latitude_min=' + latMin + '&latitude_max=' + latMax +
				'&longitude_min=' + longMin + '&longitude_max=' + longMax;

				$http.get(url).then(function (res) {
					$scope.trips = res.data;
				}).catch(function (err) {
					$scope.alerts = [
						{ type: 'danger', msg: 'Something went wrong. Check your inputs.' },
					];
					$scope.trips = [];
				})
			} else {
				$scope.alerts = [
					{ type: 'danger', msg: 'You must specify all input fields.' },
				];
				$scope.trips = [];
			}
		}

		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
	});
	
	/**
	 * Question 4
	 * Shows bar charts of trip stats
	 */
	app.controller('Q4Ctrl', function ($scope, $http) {
		$scope.showGraph = function () {
			$http.get(baseUrl + 'trips/stats/').then(function (res) {
				showDriverGraph(res.data.drivers);
				showPassengerGraph(res.data.passengers);
				showHourGraph(res.data.hours);
			}).catch(function () {
				console.error('Could not get stats info.');
			})
		}

		function showDriverGraph(data) {
			var chartData = data.sort(function (a, b) {
				return a['_id'].localeCompare(b['_id']);
			})
			$scope.chart1 = c3.generate({
				bindto: '#chart1',
				data: {
					json: chartData,
					keys: {
						x: '_id',
						value: ['count'],
					},
					type: 'bar',
					names: {
						count: 'Count',
					}
				},
				axis: {
					x: {
						type: 'category'
					}
				}
			});
		}

		function showPassengerGraph(data) {
			var chartData = data.sort(function (a, b) {
				return a['_id'].localeCompare(b['_id']);
			})
			$scope.chart3 = c3.generate({
				bindto: '#chart2',
				data: {
					json: chartData,
					keys: {
						x: '_id',
						value: ['count'],
					},
					type: 'bar',
					names: {
						count: 'Count',
					}
				},
				axis: {
					x: {
						type: 'category'
					}
				}
			});
		}

		function showHourGraph(data) {
			var chartData = data.sort(function (a, b) {
				return a['_id'] - b['_id'];
			})
			$scope.chart3 = c3.generate({
				bindto: '#chart3',
				data: {
					json: chartData,
					keys: {
						x: '_id',
						value: ['count'],
					},
					type: 'bar',
					names: {
						count: 'Count',
					}
				},
				axis: {
					x: {
						type: 'category'
					}
				}
			});
		}
	});
	
	/**
	 * Quesiton 5
	 * Shows a map of trips taken
	 * Didn't have time to make interactive paths :(
	 */
	app.controller('Q5Ctrl', function ($scope, $http, uiGmapGoogleMapApi) {
		$scope.map = {
			center: {
				latitude: 45,
				longitude: -73
			},
			pan: true,
			zoom: 4,
			refresh: false,
			options: {
				disableDefaultUI: false
			},
			events: {},
			bounds: {},
			polys: [],
			draw: undefined
        };
		
		// Load map, then make query
		uiGmapGoogleMapApi.then(function (maps) {
			$http.get(baseUrl + '/trips?all=true').then(function (res) {
				$scope.map.polys = makePolys(res.data);
			});
		}).catch(function () {
			console.error('Houston, we have a problem. Could not get all trip info.');
		});

		function makePolys(rawTrips) {
			
			// Using D3 to create an array of 10 colors, this way the trips will draw as different colors
			var colors = d3.scale.category10().range();
			// Build trips array
			return rawTrips.map(function (trip, i) {
				// Format loc coords for GMaps, paths are sorted from DB beacuse we entered them sorted.
				var path = trip.path.map(function (path) {
					return {
						"latitude": path.latitude,
						"longitude": path.longitude
					};
				});
				
				// GMap polyline obj
				return {
					"id": trip["_id"],
					"path": path,
					"stroke": {
						"color": colors[i % colors.length],
						"weight": 3
					}
				}
			})
		}

	});

})();