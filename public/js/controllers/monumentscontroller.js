angular.module('aroundhere').controller('MonumentsController', ['$scope', '$http', '$geolocation', 'MapService', 'MonumentService', function($scope, $http, $geolocation,  $map, $monuments) {
  $scope.isLoading = false
  $scope.monuments = [
    {
      _id: 'Activate the action button to see monuments around you!',
      image: 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Wannsee_Am_Sandwerder_Borussia-Monument.JPG/800px-Wannsee_Am_Sandwerder_Borussia-Monument.JPG',
      description: 'Located near the beautiful Wannsee, an astonishing sight!'
    }
  ]

  $scope.lookForNearbyMonuments = function() {
    $scope.isLoading = true

    var currentLat  = $geolocation.position.coords.latitude
    var currentLong = $geolocation.position.coords.longitude

    $monuments.getSurroundingFor(currentLong, currentLat, 10000).then(setMonumentList)
  }

  function setMonumentList(l) {
    $scope.monuments = l
    $scope.isLoading = false
  }
}])