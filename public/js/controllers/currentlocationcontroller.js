'use strict';

angular.module('aroundhere').controller('CurrentlocationController', ['$geolocation', '$scope', '$http', 'MapService', function($geolocation, $scope, $http, map) {
  $scope.currentLocation = ''
  $geolocation.watchPosition({
    timeout: 6000,
    maximumAge: 5000,
    enableHighAccuracy: true
  })

  $scope.$on('$geolocation.position.changed', handlePositionUpdate)

  function handlePositionUpdate(event,position) {
    map.setCurrentPosition(position.coords.latitude, position.coords.longitude)

    var request = {
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      /*headers: {
        'Content-Type': undefined
      },*/
      params: {
        key: 'AIzaSyAYfnpR4oWhEB6dnCb2Qr2puVPjsLt8j2I',
        latlng: position.coords.latitude + ',' + position.coords.longitude
      }
    }

    $http(request).success(function(data) {
      $scope.currentLocation = data.results[0].formatted_address
    })
  }
}])