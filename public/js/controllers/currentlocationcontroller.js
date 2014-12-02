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
      console.log('UPDATED POSITION', x)
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

      var marker = new google.maps.Marker({
        position: pos,
        map: map
      })
    }

    $scope.$on('$geolocation.position.changed', handlePositionUpdate)

    // google map part --------------------------
    var map

    function initializeMap() {
      var mapProp = {
        center:new google.maps.LatLng(52.521918,13.413215),
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById("googleMap"), mapProp)
    }

    google.maps.event.addDomListener(window, 'load', initializeMap)
  }])