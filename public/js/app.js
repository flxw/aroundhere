'use strict';

// filter settings control
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
      hideFilterPanel()
    } else if (this._ready) {
      L.DomUtil.removeClasses(this._container, "ready")
      L.DomUtil.addClasses(this._container, "active")
      showFilterPanel()
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

// filter settings control
L.Control.Settings = L.Control.extend({
  options: {
    position: 'bottomright',
    icon: 'fa fa-cog',
    strings: {
      title: 'Customize search radius'
    },
  },

  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-filter leaflet-bar leaflet-control');
    this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
    this._link.href = '#';
    this._link.title = this.options.strings.title;
    this._icon = L.DomUtil.create('span', this.options.icon, this._link);
    this._settingsPanel = $('#settingsPanel')

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
      L.DomUtil.removeClasses(this._container, "active")
      this.hideSettingsPanel()
    } else {
      L.DomUtil.removeClasses(this._container, "ready")
      L.DomUtil.addClasses(this._container, "active")
      this.showSettingsPanel()
    }

    this._active = !this._active
  },

  showSettingsPanel: function() {
    if (filterControl._active) {
      filterControl.toggle()
    }

    this._settingsPanel.show()
  },

  hideSettingsPanel: function() {
    this._settingsPanel.hide()
  }
});

L.control.settings = function (options) {
    return new L.Control.Settings(options);
};

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


  var minLatLng = [1000,1000]
  var maxLatLng = [0, 0]

  for (var i = data.length - 1; i >= 0; i--) {
    if (minLatLng[0] > data[i].geolocation.coordinates[0] &&
        minLatLng[1] > data[i].geolocation.coordinates[1]) {
      minLatLng = data[i].geolocation.coordinates
    }

    if (maxLatLng[0] < data[i].geolocation.coordinates[0] &&
        maxLatLng[1] < data[i].geolocation.coordinates[1]) {
      maxLatLng = data[i].geolocation.coordinates
    }
  }

  map.fitBounds([minLatLng, maxLatLng])

  searchResults = data
  displayMonumentsOnMap(data)
}

function showSnackbarMessage(m) {
  snackBar.show()

  map.closePopup()
  snackBar.find('p').text(m)

  window.setTimeout(function() {
    snackBar.hide()
  }, 3500)
}

function onMapClick(e) {
  var popupCoordinates = e.latlng
  var popupContent = $('<div><p>Looking up nearby monuments...</p></div>')

  searchInput.val('')

  var parameters = {
    longitude: e.latlng.lng,
    latitude: e.latlng.lat,
    distance: $('input[name="searchRadius"]').val()
  }

  $.ajax({
    type: 'GET',
    url: '/getNearMonuments',
    data: parameters,
    dataType: 'json',
    timeout: 300,
    context: null,
    success: function(data) {
      searchResults = data
      popupContent.find('p').text(data.length + ' monuments around here')
      setupFiltersWith(data)
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

function showFilterPanel() {
  if (settingsControl._active) {
    settingsControl.toggle()
  }

  filterPanel.show()
}

function hideFilterPanel() {
  filterPanel.hide()
  displayMonumentsOnMap(searchResults)
}

function setupFiltersWith(data) {
  var filterableMonuments = data.filter(function(d) {
    if (d.linkedData !== "") {
      return d
    }
  })

  if (filterableMonuments.length === 0) {
    filterControl.setReady(false)
    return
  } else {
    filterControl.setReady(true)
  }

  var yocFilter = {
    enabled: false,
    from: 111111,
    to: 0
  }

  for (var i = filterableMonuments.length - 1; i >= 0; i--) {
    if (!!filterableMonuments[i].linkedData.yearOfConstruction) {
      yocFilter.enabled = true

      if (yocFilter.from > filterableMonuments[i].linkedData.yearOfConstruction) {
        yocFilter.from = filterableMonuments[i].linkedData.yearOfConstruction
      }

      if (yocFilter.to < filterableMonuments[i].linkedData.yearOfConstruction) {
        yocFilter.to = filterableMonuments[i].linkedData.yearOfConstruction
      }
    }
  }

  initializeYocFilter(yocFilter)
}

function initializeYocFilter(opts) {
  if (opts.enabled) {
    yocFilterElement.show()

    var from = opts.from
    var to = opts.to

    yocFilterElement.find('input[name="from"]').val(from)
    yocFilterElement.find('input[name="from"]').prop('min', from)
    yocFilterElement.find('input[name="from"]').prop('max', to - 1)

    // zepto does some weird variable mangling here...
    var from = parseInt(opts.from)
    var to = parseInt(opts.to)

    yocFilterElement.find('input[name="to"]').val(to)
    yocFilterElement.find('input[name="to"]').prop('min', from + 1)
    yocFilterElement.find('input[name="to"]').prop('max', to)
  } else {
    yocFilterElement.hide()
  }
}

function applyFilters() {
  var filteredData = []

  if (isElementVisible(yocFilterElement)) {
    var fromYoc = parseInt(yocFilterElement.find('input[name="from"]').val())
    var toYoc   = parseInt(yocFilterElement.find('input[name="to"]').val())


    for (var i = searchResults.length - 1; i >= 0; i--) {
      var currentMonument = searchResults[i]

      if (currentMonument.linkedData) {
        var yoc = parseInt(currentMonument.linkedData.yearOfConstruction)
        if (fromYoc <= yoc && yoc <= toYoc) {
          filteredData.push(currentMonument)
        }
      }
    }
  }

  displayMonumentsOnMap(filteredData)
}

function isElementVisible(e) {
  return e.css('display') !== 'none'
}

// map setup
var map = L.map('map', { zoomControl: false })
var popup = L.popup()
var monumentMarkers = L.featureGroup()
var filterControl = L.control.filter()
var settingsControl = L.control.settings()

var filterPanel = $('#filterPanel')
var settingsPanel = $('#settingsPanel')
var snackBar = $('.snackbar')
var yocFilterElement = $('#yearOfConstructionFilter')
var searchInput = $('#searchInput')

var searchResults = []
var currentPositionMarker = null
var latestResults = null

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
settingsControl.addTo(map)

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
searchInput.keyup(function(event) {
  if (event.keyCode == 13) {
    $("#searchButton").click();
  }
});

$('#searchButton').click(function(event) {
  var searchText = searchInput.val()

  if (searchText === '') {
    return
  }

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

// year of construction filter setup
$('#applyFilterButton').on('click', applyFilters)
