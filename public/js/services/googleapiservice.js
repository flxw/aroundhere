'use strict';

angular.module('aroundhere').factory('GoogleApiService', [function() {
 return {
  staticMapServiceUrl: 'https://maps.googleapis.com/maps/api/staticmap',
  key: 'AIzaSyAYfnpR4oWhEB6dnCb2Qr2puVPjsLt8j2I'
 }
}])