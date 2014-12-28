'use strict';

var app = angular.module('aroundhere', ['ngGeolocation', 'ngRoute'])

app.config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects. (needed for core-image...)
  $sceProvider.enabled(false);
});

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