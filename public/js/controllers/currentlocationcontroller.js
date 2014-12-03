'use strict';

angular.module('aroundhere').controller('CurrentlocationController', ['$geolocation', '$scope', function($geolocation, $scope) {
    $scope.myCoords = $geolocation.position.coords
    $scope.myError = $geolocation.position.error

    $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 5000,
      enableHighAccuracy: true
    })

    function handlePositionUpdate(event,position) {
      console.log('UPDATED POSITION', position)
      $scope.myCoords = position
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

      map.setCenter(pos)

      marker.setMap(null)
      marker = new google.maps.Marker({
        position: pos,
        map: map
      })
    }

    $scope.$on('$geolocation.position.changed', handlePositionUpdate)

    // google map part --------------------------
    var map, marker

    function initializeMap() {
      var mapProp = {
        center:new google.maps.LatLng(52.521918,13.413215),
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById("google-map"), mapProp)

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(52.521918,13.413215),
        map: map
      })
    }

    google.maps.event.addDomListener(window, 'load', initializeMap)
  }])