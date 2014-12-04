'use strict';

angular.module('aroundhere').controller('CurrentlocationController', ['$geolocation', '$scope', function($geolocation, $scope) {
  $geolocation.watchPosition({
    timeout: 60000,
    maximumAge: 5000,
    enableHighAccuracy: true
  })

  initializeMap()
  $scope.$on('$geolocation.position.changed', handlePositionUpdate)

  // google map part --------------------------
  var map, marker

  function handlePositionUpdate(event,position) {
    console.log('CurrentlocationController: UPDATED POSITION', position)
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

    map.setCenter(pos)

    marker.setMap(null)
    marker = new google.maps.Marker({
      position: pos,
      map: map
    })
  }

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
}])