angular.module('aroundhere').controller('MonumentDetailController', ['$scope', '$location', function($scope, $location) {
  $scope.details = [{
  }]

  $scope.goBack = function() {
    $location.path('/')
  }
}])