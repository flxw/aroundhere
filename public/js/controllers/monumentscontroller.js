angular.module('aroundhere').controller('MonumentsController', ['$scope', '$http', '$geolocation', 'MapService', 'MonumentService', '$location', function($scope, $http, $geolocation,  $map, $monuments, $location) {
  $scope.isLoading = false
  $scope.monumentAddresses = $monuments.getLastRequestResult()

  $scope.lookForNearbyMonuments = function() {
    $scope.isLoading = true

    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $monuments.getSurroundingFor(currentLong, currentLat, 200).then(setMonumentList)
  }

  $scope.showMonumentDetails = function(index) {
    $location.path('/monument/' + $scope.monumentAddresses[index].mon.belongsToMonument._id)
  }

  function setMonumentList(l) {
    $scope.monumentAddresses = l
    $scope.isLoading = false
  }
}])