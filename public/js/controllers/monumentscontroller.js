angular.module('aroundhere').controller('MonumentsController', ['$scope', '$http', '$geolocation', 'MapService', 'MonumentService', function($scope, $http, $geolocation,  $map, $monuments) {
  $scope.isLoading = false
  $scope.monuments = [
    {
      name: 'Activate the action button to see monuments around you!'
    }
  ]

  $scope.lookForNearbyMonuments = function() {
    $scope.isLoading = true

    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $monuments.getSurroundingFor(currentLong, currentLat, 10000)
      .then(setMonumentList)
  }

  function setMonumentList(l) {
    $scope.monuments = l
    $scope.isLoading = false
  }
}])