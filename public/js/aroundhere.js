'use strict';

var app = angular.module('aroundhere', ['ngGeolocation', 'ngRoute', 'ngAnimate'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:  'MonumentsController',
      templateUrl: '/js/views/monuments.html'
    })
    .when('/monument/:monumentId', {
      controller:  'MonumentDetailController',
      templateUrl: '/js/views/monumentdetail.html'
    })
    .otherwise({
      redirectTo: '/'
    })
}])