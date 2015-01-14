'use strict';

angular.module('aroundhere').factory('MapService', ['$http', 'GoogleApiService', function($http, googleApiService) {
  var currentPositionMarker = null
  var mapContainer = document.querySelector('#map')
  var mapArea = angular.element(document.querySelector('#map > img'))[0]

  function showMonumentsAroundCurrentPosition(currentLat, currentLong, monuments) {
    var currentCoordinates = currentLat +  ',' + currentLong
    var imageUrl = googleApiService.staticMapServiceUrl
    var monumentMarkers = 'size:small%7color:red'

    for (var i = 0; i < monuments.length; ++i) {
      monumentMarkers += '|' + monuments[i].geolocation.coordinates[0]
      monumentMarkers += ',' + monuments[i].geolocation.coordinates[1]
    }

    imageUrl +=  '?center=' + currentCoordinates
    imageUrl += '&zoom=15'
    imageUrl += '&size=' + mapContainer.clientWidth + 'x' + mapContainer.clientHeight
    imageUrl += '&markers=color:0x2196f3|' + currentCoordinates

    if (monuments.length > 0) {
      imageUrl += '&markers=' + monumentMarkers
    }

    mapArea.src = imageUrl
  }

  function showMonumentAndCurrentPosition(currentLat, currentLong, monumentLat, monumentLong) {
    var currentCoordinates = currentLat +  ',' + currentLong
    var monumentCoordinates = monumentLat + ',' + monumentLong
    var imageUrl = googleApiService.staticMapServiceUrl
    var monumentMarkers = 'color:red'

    imageUrl +=  '?center=' + currentCoordinates
    imageUrl += '&zoom=15'
    imageUrl += '&size=' + mapContainer.clientWidth + 'x' + mapContainer.clientHeight
    imageUrl += '&markers=color:0x2196f3|' + currentCoordinates
    imageUrl += '&markers=size:small%7color:red|' + monumentCoordinates

    mapArea.src = imageUrl
  }

 return {
  showMonumentsAroundCurrentPosition: showMonumentsAroundCurrentPosition,
  showMonumentAndCurrentPosition: showMonumentAndCurrentPosition
 }
}])