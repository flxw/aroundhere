'use strict';

var map = null

function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(52.521918,13.413215),
    zoom:11,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById("googleMap"), mapProp)

  addMarker(52.521918, 13.413215, "Alexanderplatz");
}

/*function addMarker(latitude, longitude, description) {
  var pos = new google.maps.LatLng(latitude, longitude)

  var marker = new google.maps.Marker({
    position: pos
  });

  marker.setMap(map);

  var infowindow = new google.maps.InfoWindow({
    content: description
  });

  google.maps.event.addListener(marker,'click',function() {
    infowindow.open(map,marker)
  });
}

google.maps.event.addDomListener(window, 'load', initialize)*/

var app = angular.module('aroundhere', ['ngGeolocation'])

/*app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:  'LoginController',
      templateUrl: '...'
    })
    .otherwise({
      redirectTo: '/'
    })
}])*/

app
  .controller('GeolocationController', ['$geolocation', '$scope', function($geolocation, $scope) {
    $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 250,
      enableHighAccuracy: true
    });

    $scope.myCoords = $geolocation.position.coords; // this is regularly updated
    $scope.myError = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
  }])