angular.module('aroundhere').factory('MonumentService', ['$http', '$q', function($http, $q) {
  function getSurroundingFor(long, lat, dist) {
    var deferred = $q.defer()

    var request = {
      method: 'GET',
      url: '/getNearMonuments',
      /*headers: {
        'Content-Type': undefined
      },*/
      params: {
        longitude: long,
        latitude: lat,
        distance: dist
      }
    }

    $http(request).success(deferred.resolve)

    return deferred.promise
  }

  return {
    getSurroundingFor: getSurroundingFor
  }
}])