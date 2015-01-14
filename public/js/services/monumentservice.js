angular.module('aroundhere').factory('MonumentService', ['$http', '$q', function($http, $q) {
  var monuments = {}
  var lastRequestResult = []

  function getLastRequestResult() {
    return lastRequestResult
  }

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

    $http(request).success(function(m) {
      for (var i = 0; i < m.length; ++i) {
        monuments[m[i].linkedData.monumentId] = m[i]
      }

      lastRequestResult = JSON.parse(JSON.stringify(m))

      deferred.resolve(m)
    })

    return deferred.promise
  }

  function getSingleMonument(id) {
    if (id in monuments) {
      return monuments[id]
    } else {
      console.log('need to get this from api')
      return []
    }
  }

  return {
    getSurroundingFor: getSurroundingFor,
    getSingleMonument: getSingleMonument,
    getLastRequestResult: getLastRequestResult
  }
}])