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
		$scope.selctedDriver = 1;
		$scope.selctedPassenger = 1;
		$scope.selectedHour;
		
		$scope.hourRange = new Array(24);
		
		$http.get(baseUrl + 'trips/stats/').then(function(res){
			$scope.stats = res.data;
			$scope.drivers = res.data.drivers.map(function(driver){
				return driver['_id'];
			});
			// $scope.drivers.unshift('Choose a driver to filter by');
			
			$scope.passengers = res.data.passengers.map(function(passenger){
				return passenger['_id'];
			});
			// $scope.passengers.unshift('Choose a passenger to filter by');
			
		});
	});
})();