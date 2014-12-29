'use strict';

angular.module('aroundhere').factory('MapService', [function() {
  var currentPositionMarker = null
  var map = null

  // initialization
  var mapProp = {
    center: new google.maps.LatLng(52.521918,13.413215),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById('google-map'), mapProp)

  // methods
  function setCurrentPosition(latitude, longitude) {
    var oldMarker = currentPositionMarker
    var pos = new google.maps.LatLng(latitude, longitude)

    currentPositionMarker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: '/img/my_position.png'
    })

    if (oldMarker === null) {
      map.setCenter(pos)
    } else {
      oldMarker.setMap(null)
    }
  }

 return {
  setCurrentPosition: setCurrentPosition
 }
}])