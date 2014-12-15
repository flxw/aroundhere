'use strict';

angular.module('aroundhere').controller('CurrentlocationController', ['$geolocation', '$scope', 'MapService', function($geolocation, $scope, map) {
  $geolocation.watchPosition({
    timeout: 60000,
    maximumAge: 5000,
    enableHighAccuracy: true
  })

  $scope.$on('$geolocation.position.changed', handlePositionUpdate)

  function handlePositionUpdate(event,position) {
    map.setCurrentPosition(position.coords.latitude, position.coords.longitude)
  }
}])