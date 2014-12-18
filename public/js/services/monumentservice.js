angular.module('aroundhere').factory('MonumentService', ['$http', '$q', function($http, $q) {
  var monuments = {}

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
        monuments[m[i].mon.belongsToMonument._id] = m[i]
      }

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
    getSingleMonument: getSingleMonument
  }
}])