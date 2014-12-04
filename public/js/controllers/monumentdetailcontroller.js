angular.module('aroundhere').controller('MonumentDetailController', ['$scope', '$location', function($scope, $location) {
 $scope.goBack = function() {
  $location.path('/')
 }
}])