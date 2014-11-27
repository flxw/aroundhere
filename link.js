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

var linkData = function(id){
  var sites = {}
  wikiLinks.forEach(function(entry){
    crawlURL(entry, getLinkForId, id)
  })

  //getLinkForId(id, sites)

}

function crawlURL(url, callback, id){
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;

    });
    res.on("end", function() {
      callback(id, url, data);
    });
  }).on("error", function() {
    //Error case
  });
}

function getLinkForId(id, url, html){
    var index = html.search(id)

    if(index > -1) {
      var startIndex = html.indexOf("href", index)

      var endIndex = html.indexOf('\"', startIndex + 6)

      var link = html.substring(startIndex + 6, endIndex)
      console.log(link)
    }


}

exports.linkData = linkData