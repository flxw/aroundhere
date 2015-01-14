'use strict';

angular.module('aroundhere').controller('MonumentsController', ['$scope', '$geolocation', 'MapService', 'MonumentService', '$location', function($scope, $geolocation,  $map, $monumentService, $location) {
  $scope.isLoading = false
  $scope.monuments = prepareDataForThreeColumnDisplay($monumentService.getLastRequestResult())

  if ($scope.monuments.length !== 0) {
    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude
    $map.showMonumentsAroundCurrentPosition(currentLat, currentLong, $scope.monuments)
  }

  $scope.lookForNearbyMonuments = function() {
    $scope.isLoading = true

    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $monumentService.getSurroundingFor(currentLong, currentLat, 100).then(setMonumentList)
  }

  $scope.showMonumentDetails = function(i, index) {
    $location.path('/monument/' + $scope.monuments[i][index].mon.belongsToMonument._id)
  }

  function setMonumentList(l) {
    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $map.showMonumentsAroundCurrentPosition(currentLat, currentLong, l)

    $scope.monuments = prepareDataForThreeColumnDisplay(l)
    $scope.isLoading = false
  }

  function prepareDataForThreeColumnDisplay(data) {
    var newArr = [];
    var size = Math.ceil(data.length / 3)

    for (var i=0; i<data.length; i+=size) {
      newArr.push(data.slice(i, i+size));
    }

    return newArr;
  }
}])