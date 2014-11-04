var map = null

function initialize() {
	var mapProp = {
	  center:new google.maps.LatLng(52.521918,13.413215),
	  zoom:11,
	  mapTypeId:google.maps.MapTypeId.ROADMAP
  }

	map = new google.maps.Map(document.getElementById("googleMap"), mapProp)

	addMarker(52.521918, 13.413215, "Alexanderplatz");
}

function addMarker(latitude, longitude, description) {
	var pos = new google.maps.LatLng(latitude, longitude)

	var marker = new google.maps.Marker({
		position: pos
	});

	marker.setMap(map);

	var infowindow = new google.maps.InfoWindow({
		content: description
	});

	google.maps.event.addListener(marker,'click',function() {
		infowindow.open(map,marker)
	});
}

google.maps.event.addDomListener(window, 'load', initialize)