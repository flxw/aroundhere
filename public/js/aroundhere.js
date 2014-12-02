'use strict';

// ----------------------------------------------

var app = angular.module('aroundhere', ['ngGeolocation', 'ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:  'CurrentlocationController',
      templateUrl: '/js/views/index.html'
    })
    .otherwise({
      redirectTo: '/'
    })
}])