var http = require('http');

var wikiLinks = [
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Alexanderplatz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Alt-Berlin",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Alt-K%C3%B6lln",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Dorotheenstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Friedrich-Wilhelm-Stadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Friedrichstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Friedrichswerder",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Luisenstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Neuk%C3%B6lln_am_Wasser",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Oranienburger_Vorstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Rosenthaler_Vorstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Spandauer_Vorstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Stralauer_Vorstadt"
]

var linkData = function(){
  wikiLinks.forEach(function(entry){
    console.log(entry)
    crawlURL(entry)
  })
}

function crawlURL(url){
  var client = http.createClient(80, url);
  request = client.request();
  request.on('response', function( res ) {
      res.on('data', function( data ) {
          console.log( data );
      } );
  } );
  request.end();
}



exports.linkData = linkData