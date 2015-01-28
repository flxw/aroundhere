'use strict';
!function(a,b){"function"==typeof define&&define.amd?define(["leaflet"],a):"object"==typeof exports&&(module.exports=a(require("leaflet"))),"undefined"!=typeof b&&b.L&&(b.L.Locate=a(L))}(function(a){return a.Control.Locate=a.Control.extend({options:{position:"topleft",drawCircle:!0,follow:!1,stopFollowingOnDrag:!1,remainActive:!1,markerClass:a.circleMarker,circleStyle:{color:"#136AEC",fillColor:"#136AEC",fillOpacity:.15,weight:2,opacity:.5},markerStyle:{color:"#136AEC",fillColor:"#2A93EE",fillOpacity:.7,weight:2,opacity:.9,radius:5},followCircleStyle:{},followMarkerStyle:{},icon:"fa fa-map-marker",iconLoading:"fa fa-spinner fa-spin",circlePadding:[0,0],metric:!0,onLocationError:function(a){alert(a.message)},onLocationOutsideMapBounds:function(a){a.stop(),alert(a.options.strings.outsideMapBoundsMsg)},setView:!0,keepCurrentZoomLevel:!1,showPopup:!0,strings:{title:"Show me where I am",popup:"You are within {distance} {unit} from this point",outsideMapBoundsMsg:"You seem located outside the boundaries of the map"},locateOptions:{maxZoom:1/0,watch:!0}},initialize:function(b){a.Map.addInitHook(function(){this.options.locateControl&&(this.locateControl=a.control.locate(),this.addControl(this.locateControl))});for(var c in b)"object"==typeof this.options[c]?a.extend(this.options[c],b[c]):this.options[c]=b[c];a.extend(this.options.locateOptions,{setView:!1})},_activate:function(){this.options.setView&&(this._locateOnNextLocationFound=!0),this._active||this._map.locate(this.options.locateOptions),this._active=!0,this.options.follow&&this._startFollowing(this._map)},_deactivate:function(){this._map.stopLocate(),this._map.off("dragstart",this._stopFollowing),this.options.follow&&this._following&&this._stopFollowing(this._map)},drawMarker:function(b){void 0===this._event.accuracy&&(this._event.accuracy=0);var c=this._event.accuracy;this._locateOnNextLocationFound&&(this._isOutsideMapBounds()?this.options.onLocationOutsideMapBounds(this):b.fitBounds(this._event.bounds,{padding:this.options.circlePadding,maxZoom:this.options.keepCurrentZoomLevel?b.getZoom():this.options.locateOptions.maxZoom}),this._locateOnNextLocationFound=!1);var d,e;if(this.options.drawCircle)if(d=this._following?this.options.followCircleStyle:this.options.circleStyle,this._circle){this._circle.setLatLng(this._event.latlng).setRadius(c);for(e in d)this._circle.options[e]=d[e]}else this._circle=a.circle(this._event.latlng,c,d).addTo(this._layer);var f,g;this.options.metric?(f=c.toFixed(0),g="meters"):(f=(3.2808399*c).toFixed(0),g="feet");var h;h=this._following?this.options.followMarkerStyle:this.options.markerStyle,this._marker?this.updateMarker(this._event.latlng,h):this._marker=this.createMarker(this._event.latlng,h).addTo(this._layer);var i=this.options.strings.popup;this.options.showPopup&&i&&this._marker.bindPopup(a.Util.template(i,{distance:f,unit:g}))._popup.setLatLng(this._event.latlng),this._toggleContainerStyle()},createMarker:function(a,b){return this.options.markerClass(a,b)},updateMarker:function(a,b){this._marker.setLatLng(a);for(o in b)this._marker.options[o]=b[o]},removeMarker:function(){this._layer.clearLayers(),this._marker=void 0,this._circle=void 0},onAdd:function(b){var c=a.DomUtil.create("div","leaflet-control-locate leaflet-bar leaflet-control");this._layer=new a.LayerGroup,this._layer.addTo(b),this._event=void 0;var d={};return a.extend(d,this.options.markerStyle,this.options.followMarkerStyle),this.options.followMarkerStyle=d,d={},a.extend(d,this.options.circleStyle,this.options.followCircleStyle),this.options.followCircleStyle=d,this._link=a.DomUtil.create("a","leaflet-bar-part leaflet-bar-part-single",c),this._link.href="#",this._link.title=this.options.strings.title,this._icon=a.DomUtil.create("span",this.options.icon,this._link),a.DomEvent.on(this._link,"click",a.DomEvent.stopPropagation).on(this._link,"click",a.DomEvent.preventDefault).on(this._link,"click",function(){var a=void 0===this._event||this._map.getBounds().contains(this._event.latlng)||!this.options.setView||this._isOutsideMapBounds();!this.options.remainActive&&this._active&&a?this.stop():this.start()},this).on(this._link,"dblclick",a.DomEvent.stopPropagation),this._resetVariables(),this.bindEvents(b),c},bindEvents:function(a){a.on("locationfound",this._onLocationFound,this),a.on("locationerror",this._onLocationError,this),a.on("unload",this.stop,this)},start:function(){this._activate(),this._event?this.drawMarker(this._map):this._setClasses("requesting")},stop:function(){this._deactivate(),this._cleanClasses(),this._resetVariables(),this.removeMarker()},_onLocationError:function(a){3==a.code&&this.options.locateOptions.watch||(this.stop(),this.options.onLocationError(a))},_onLocationFound:function(a){this._event&&this._event.latlng.lat===a.latlng.lat&&this._event.latlng.lng===a.latlng.lng&&this._event.accuracy===a.accuracy||this._active&&(this._event=a,this.options.follow&&this._following&&(this._locateOnNextLocationFound=!0),this.drawMarker(this._map))},_startFollowing:function(){this._map.fire("startfollowing",this),this._following=!0,this.options.stopFollowingOnDrag&&this._map.on("dragstart",this._stopFollowing,this)},_stopFollowing:function(){this._map.fire("stopfollowing",this),this._following=!1,this.options.stopFollowingOnDrag&&this._map.off("dragstart",this._stopFollowing),this._toggleContainerStyle()},_isOutsideMapBounds:function(){return void 0===this._event?!1:this._map.options.maxBounds&&!this._map.options.maxBounds.contains(this._event.latlng)},_toggleContainerStyle:function(){this._container&&this._setClasses(this._following?"following":"active")},_setClasses:function(b){"requesting"==b?(a.DomUtil.removeClasses(this._container,"active following"),a.DomUtil.addClasses(this._container,"requesting"),a.DomUtil.removeClasses(this._icon,this.options.icon),a.DomUtil.addClasses(this._icon,this.options.iconLoading)):"active"==b?(a.DomUtil.removeClasses(this._container,"requesting following"),a.DomUtil.addClasses(this._container,"active"),a.DomUtil.removeClasses(this._icon,this.options.iconLoading),a.DomUtil.addClasses(this._icon,this.options.icon)):"following"==b&&(a.DomUtil.removeClasses(this._container,"requesting"),a.DomUtil.addClasses(this._container,"active following"),a.DomUtil.removeClasses(this._icon,this.options.iconLoading),a.DomUtil.addClasses(this._icon,this.options.icon))},_cleanClasses:function(){a.DomUtil.removeClass(this._container,"requesting"),a.DomUtil.removeClass(this._container,"active"),a.DomUtil.removeClass(this._container,"following"),a.DomUtil.removeClasses(this._icon,this.options.iconLoading),a.DomUtil.addClasses(this._icon,this.options.icon)},_resetVariables:function(){this._active=!1,this._locateOnNextLocationFound=this.options.setView,this._following=!1}}),a.Map.addInitHook(function(){this.options.locateControl&&(this.locateControl=a.control.locate(),this.addControl(this.locateControl))}),a.control.locate=function(b){return new a.Control.Locate(b)},function(){var b=function(b,c,d){d=d.split(" "),d.forEach(function(d){a.DomUtil[b].call(this,c,d)})};a.DomUtil.addClasses=function(a,c){b("addClass",a,c)},a.DomUtil.removeClasses=function(a,c){b("removeClass",a,c)}}(),a.Control.Locate},window);

// custom settings control
L.Control.Filter = L.Control.extend({
  options: {
    position: 'bottomright',
    icon: 'fa fa-filter',
    strings: {
      title: 'Filter the results'
    },
  },

  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-filter leaflet-bar leaflet-control');

    this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
    this._link.href = '#';
    this._link.title = this.options.strings.title;
    this._icon = L.DomUtil.create('span', this.options.icon, this._link);

    this._active = false
    this._ready  = false

    L.DomEvent
    .on(this._link, 'click', L.DomEvent.stopPropagation)
    .on(this._link, 'click', L.DomEvent.preventDefault)
    .on(this._link, 'click', function() { this.toggle() }, this)
    .on(this._link, 'dblclick', L.DomEvent.stopPropagation);

    return this._container;
  },

  toggle: function() {
    if (this._active) {
      L.DomUtil.addClasses(this._container, "ready")
      L.DomUtil.removeClasses(this._container, "active")
      hideSettingsPanel()
    } else if (this._ready) {
      L.DomUtil.removeClasses(this._container, "ready")
      L.DomUtil.addClasses(this._container, "active")
      showSettingsPanel()
    }
    this._active = !this._active
  },

  setReady: function(b) {
    this._ready = b

    if (b) {
      L.DomUtil.addClasses(this._container, "ready")
    } else {
      L.DomUtil.removeClasses(this._container, "ready")
    }
  }
});

L.control.filter = function (options) {
    return new L.Control.Filter(options);
};

function lookForMonumentsAt(lat, long) {
  var parameters = {
    longitude: long,
    latitude: lat,
    distance: 200
  }

  $.ajax({
    type: 'GET',
    url: '/getNearMonuments',
    data: parameters,
    dataType: 'json',
    timeout: 300,
    context: null,
    success: thisIsRussia,
    error: noOneTalksToTheMachineLikeThat
  })

  $.getJSON('/getNearMonuments', parameters, thisIsRussia)
}

function displayMonumentsOnMap(data) {
  monumentMarkers.clearLayers()

  data.forEach(function(monument, monumentIndex) {
    var marker = L.marker(monument.geolocation.coordinates, {
      title: monument.formatted,
      riseOnHover: true,
      maxWidth: 400
    })

    var markerPop = L.popup({
      closeOnClick: true,
      closeButton: false,
      autoPanPaddingTopLeft: [50, 100],
      autoPanPaddingBottomRight: [50, 100],
      autoPan: true
    })

    var popContent = $('<div></div>')

    if (monument.linkedData) {
      popContent.append('<h3>#' + monument.linkedData.monumentId + '</h3>')
    } else {
      popContent.append('<h3>' + monument.formatted + '</h3>')
    }

    if (monument.description !== "") {
      popContent.append($('<p>' + monument.description + '</p>'))
    }

    if (monument.linkedData) {
      if (monument.linkedData.yearOfConstruction) {
        popContent.append($('<p>Built in ' + monument.linkedData.yearOfConstruction + '</p>'))
      }

      if (monument.linkedData.link) {
        popContent.append($('<a href="' + monument.linkedData.link + '">More info here</a>'))
      }

      if (monument.linkedData.images) {
        var slider = $("<div class='slider'></div>")

        for (var i = monument.linkedData.images.length - 1; i >= 0; i--) {
          var imageUrl = monument.linkedData.images[i]

          slider.append("<img src='" + imageUrl + "'>")
        }

        slider.appendTo(popContent)
      }
    } else {
      console.info('received monument data without linked data :(')
    }

    markerPop.setContent(popContent[0])
    marker.bindPopup(markerPop)
    monumentMarkers.addLayer(marker)
  })
}

function preprocessSearchResults(data) {
  for (var i = data.length - 1; i >= 0; i--) {
    data[i].formatted = data[i].addresses[0].formatted
    data[i].geolocation = data[i].addresses[0].geolocation
  }

  displayMonumentsOnMap(data)
}

function showSnackbarMessage(m) {
  snackBar.show()

  map.closePopup()
  snackBar.find('p').text(m)

  window.setTimeout(function() {
    snackBar.hide()
  }, 5000)
}

function onMapClick(e) {
  var popupCoordinates = e.latlng
  var popupContent = $('<div><p>Looking up nearby monuments...</p></div>')

  var parameters = {
    longitude: e.latlng.lng,
    latitude: e.latlng.lat,
    distance: 200
  }

  $.ajax({
    type: 'GET',
    url: '/getNearMonuments',
    data: parameters,
    dataType: 'json',
    timeout: 300,
    context: null,
    success: function(data) {
      popupContent.find('p').text(data.length + ' monuments around here')
      displayMonumentsOnMap(data)
    },
    error: function(e) {
      showSnackbarMessage('The server does not answer')
    }
  })

  popup
  .setLatLng(popupCoordinates)
  .setContent(popupContent[0])
  .openOn(map);
}

function showSettingsPanel() {
  settingsPanel.show()
}

function hideSettingsPanel() {
  settingsPanel.hide()
}

// map setup
var map = L.map('map', { zoomControl: false })
var popup = L.popup()
var monumentMarkers = L.featureGroup()
var currentPositionMarker = null
var latestResults = null
var filterControl = L.control.filter()
var settingsPanel = $('#settingsPanel')
var snackBar = $('.snackbar')

map.doubleClickZoom.disable()
L.control.zoom({ position: 'bottomright' }).addTo(map)
L.control.locate({
  position: 'bottomright',
  showPopup: false,
  drawCircle: false,
  follow: true,
  stopFollowingOnDrag: true,
  remainActive: true,
  markerStyle: {
    color: '#ffffff',
    fillColor: '#4285f4',
    fillOpacity: 1,
    weight: 2,
    opacity: 1,
    radius: 5
  },
  onLocationError: function(err) {
    map.setView([52.514034, 13.405692], 15)
    showSnackbarMessage('Unable to determine your location')
  }
}).addTo(map).start()
filterControl.addTo(map)

L.tileLayer('http://{s}.tiles.mapbox.com/v4/flxw.kp7l6kii/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmx4dyIsImEiOiI0VVU0dzhRIn0.XmpvrFDuyTCOPJnMB5mkpA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

map.addLayer(monumentMarkers)

map.on('dblclick', onMapClick)

map.locate({
  watch: false,
  maximumAge: 5000
})

// search bar setup
var searchInput = $('#searchInput')
searchInput.keyup(function(event) {
  if (event.keyCode == 13) {
    $("#searchButton").click();
  }
});

$('#searchButton').click(function(event) {
  var searchText = searchInput.val()

  var parameters = {
    query: searchText
  }

  $.ajax({
    type: 'GET',
    url: '/search',
    data: parameters,
    dataType: 'json',
    timeout: 300,
    context: null,
    success: preprocessSearchResults,
    error: function(e) {
      showSnackbarMessage('The server does not answer')
    }
  })
})

// settings panel setup
filterControl.setReady(true)