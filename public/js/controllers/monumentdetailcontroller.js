angular.module('aroundhere').controller('MonumentDetailController', ['$scope', '$location', '$routeParams', 'MonumentService', function($scope, $location, $routeParams, monumentService) {
  $scope.details = monumentService.getSingleMonument($routeParams.monumentId)

  $scope.goBack = function() {
    $location.path('/')
  }
}])