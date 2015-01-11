'use strict';

angular.module('aroundhere').controller('MonumentsController', ['$scope', '$geolocation', 'MapService', 'MonumentService', '$location', function($scope, $geolocation,  $map, $monuments, $location) {
  $scope.isLoading = false
  $scope.monumentAddresses = prepareDataForThreeColumnDisplay($monuments.getLastRequestResult())

  if ($scope.monumentAddresses.length !== 0) {
    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude
    $map.showMonumentsAroundCurrentPosition(currentLat, currentLong, $scope.monumentAddresses)
  }

  $scope.lookForNearbyMonuments = function() {
    $scope.isLoading = true

    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $monuments.getSurroundingFor(currentLong, currentLat, 100).then(setMonumentList)
  }

  $scope.showMonumentDetails = function(index) {
    $location.path('/monument/' + $scope.monumentAddresses[index].mon.belongsToMonument._id)
  }

  function setMonumentList(l) {
    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $map.showMonumentsAroundCurrentPosition(currentLat, currentLong, l)

    $scope.monumentAddresses = prepareDataForThreeColumnDisplay(l)
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