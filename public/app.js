/// <reference path="../typings/tsd.d.ts" />
(function(){
	'use strict'
	
	var app = angular.module('App', ['ui.bootstrap']);
	var baseUrl = '/api/';
	
	app.controller('Q1Ctrl', function($scope, $http) {
		$scope.maxSize = 10;
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		
		// Get trips
		$scope.trips = [];
		$http.get(baseUrl + 'trips/').then(function(res){
			$scope.trips = res.data;
			$scope.totalItems = res.data.length;
		});
		

	});
	
	app.controller('Q2Ctrl', function($scope, $http) {
		// $scope.selectedDriver;
		// $scope.selectedPassenger;
		// $scope.selectedHour;
		$scope.trips = [];
		
		$scope.drivers = [];
		$scope.passengers = [];
		$scope.hourRange = new Array(24);
		
		$http.get(baseUrl + 'trips/stats/').then(function(res){
			$scope.stats = res.data;
			$scope.drivers = res.data.drivers.map(function(driver){
				return driver['_id'];
			});
			
			$scope.passengers = res.data.passengers.map(function(passenger){
				return passenger['_id'];
			});
			
			$scope.update = function () {
				console.log(`Driver: ${$scope.selectedDriver}, Passenger: ${$scope.selectedPassenger}, Hour: ${$scope.selectedHour}`);
				
				// NOTE: Angular will do encodeUri, no need to do manually do it.
				var url = baseUrl + '/search/?';
				if($scope.selectedDriver){
					url += '&driver_name=' + $scope.selectedDriver;
				}
				if($scope.selectedPassenger){
					url += '&passenger_name=' + $scope.selectedPassenger;
				}
				if($scope.selectedHour){
					url += '&start_hour=' + $scope.selectedHour;
				}
				
				if($scope.selectedDriver || $scope.selectedPassenger || $scope.selectedHour) {
					$http.get(url).then(function(res){
						$scope.trips = res.data;
					});
				} else {
					$scope.trips = [];
				}
			}
		});
	});
	
	app.controller('Q3Ctrl', function($scope, $http) {
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
		
		$scope.search = function(){
			var longMin = $scope.longitudeMin;
			var longMax =  $scope.longitudeMax;
			var latMin = $scope.latitudeMin;
			var latMax = $scope.latitudeMax;
			console.log('LongMin: ' + longMin + ', LongMax: ' + longMax + ', latMin: ' + latMin + ', LatMax: ' + latMax)
			
			if(longMin && longMax && latMin && latMax){
				var url = baseUrl + 'search/geo/?';	
				url += 'latitude_min=' + latMin + '&latitude_max=' + latMax + 
				'&longitude_min='+ longMin  + '&longitude_max=' + longMax;
				
				$http.get(url).then(function(res){
					$scope.trips = res.data;
				}).catch(function( err ){
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
		
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
	});
	
	app.controller('Q4Ctrl', function($scope, $http) {
		$scope.showGraph = function () {
			$http.get(baseUrl + 'trips/stats/').then(function (res) {
				showDriverGraph(res.data.drivers);
				showPassengerGraph(res.data.passengers);
				showHourGraph(res.data.hours);
			})
		}
		
		function showDriverGraph (data) {
			var chartData = data.sort(function (a, b){
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
		
		function showPassengerGraph (data) {
			var chartData = data.sort(function (a, b){
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
		
		function showHourGraph (data) {
			var chartData = data.sort(function (a, b){
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
	
})();