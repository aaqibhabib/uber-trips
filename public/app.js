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
					url += '&driver_name=' + $scope.drivers[$scope.selectedDriver];
				}
				if($scope.selectedPassenger){
					url += '&passenger_name=' + $scope.passengers[$scope.selectedPassenger];
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
})();