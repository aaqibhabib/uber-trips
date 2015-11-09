/// <reference path="../typings/tsd.d.ts" />
(function(){
	'use strict'
	
	var app = angular.module('App', ['ui.bootstrap']);

	app.controller('Q1Ctrl', function($scope, $http) {
		let baseUrl = '/api/';
		// Get trips
		$scope.trips = [];
		$http.get(baseUrl + 'trips/').then(function(res){
			$scope.trips = res.data;
		});
	});
	
	app.controller('Q2Ctrl', function($scope, $http) {
		let baseUrl = '/api/';
		// Get trips
		$scope.trips = [];
		$http.get(baseUrl + 'trips/').then(function(res){
			$scope.trips = res.data;
		});
	});
})();