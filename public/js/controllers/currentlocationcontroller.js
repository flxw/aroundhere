'use strict';

angular.module('aroundhere').controller('CurrentlocationController', ['$geolocation', '$scope', 'MapService', function($geolocation, $scope, map) {
  $scope.currentLocation = 'Hasso Plattner Institut'
  $geolocation.watchPosition({
    timeout: 6000,
    maximumAge: 5000,
    enableHighAccuracy: true
  })

  $scope.$on('$geolocation.position.changed', handlePositionUpdate)

  function handlePositionUpdate(event,position) {
    map.setCurrentPosition(position.coords.latitude, position.coords.longitude)
    $scope.currentLocation = position.coords.latitude + ' | ' + position.coords.longitude
  }
}])