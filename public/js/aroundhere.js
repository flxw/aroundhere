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


var app = angular.module('aroundhere', ['ngGeolocation', 'ngRoute'])

app.controller('GeolocationController', ['$geolocation', '$scope', function($geolocation, $scope) {
    $scope.myCoords = 'wasd';

    $geolocation.getCurrentPosition().then(
      function(p) {
        $scope.myCoords = JSON.stringify(p)
        $scope.myError = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
      }).catch(function(e) {
        console.log(e)
      })
    /*$geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 5000,
      enableHighAccuracy: true
    });*/
  }])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:  'GeolocationController',
      templateUrl: '/js/views/index.html'
    })
    .otherwise({
      redirectTo: '/'
    })
}])