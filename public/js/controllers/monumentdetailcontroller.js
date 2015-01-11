'use strict';

angular.module('aroundhere').controller('MonumentDetailController', ['$scope', '$location', '$routeParams', '$geolocation', 'MapService', 'MonumentService', function($scope, $location, $routeParams, $geolocation, mapService, monumentService) {
  $scope.details = monumentService.getSingleMonument($routeParams.monumentId)

  mapService.showMonumentAndCurrentPosition($geolocation.position.coords.latitude, $geolocation.position.coords.longitude,
    $scope.details.mon.geolocation.coordinates[0], $scope.details.mon.geolocation.coordinates[1])

  $scope.goBack = function() {
    $location.path('/')
  }
}])