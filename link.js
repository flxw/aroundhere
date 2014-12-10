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

var linkData = function(id, topCallback){
  var sites = {}
  wikiLinks.forEach(function(entry){
    crawlURL(entry, getLinkForId, id, topCallback)
  })

  //getLinkForId(id, sites)
}

function crawlURL(url, callback, id, topCallback){
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;

    });
    res.on("end", function() {
      callback(id, url, data, topCallback);
    });
  }).on("error", function() {
    //Error case
  });
}

var regIds  = /id="\d{8}/g
var regImages = /src=".*\.jpg"/g

function getLinkForId(id, url, html, topCallback){
    var index = html.search(id)

    if(index > -1) {
      var startIndex = html.indexOf("href", index)

      var endIndex = html.indexOf('\"', startIndex + 6)

      var link = html.substring(startIndex + 6, endIndex)

      var endScopeImg = html.search(getNextId(id, html))
      var imgLinks = getImageForId(id, html.slice(startIndex, endScopeImg))

      topCallback({link: link, images: imgLinks})
    }


}

exports.linkData = linkData


// private -------------------------------------------------------

var getImageForId = function(id, html){
  console.log(html)
  var images = html.match(regImages)
  console.log(images)
  for(var i=0; i<images.length; i++){
    images[i] = images[i].slice(7)
    images[i] = "http://"+images[i].slice(0,images[i].length-1)
    images[i] = images[i].replace(/\/.{0,4}px/, "/512px")
  }
  return images
}


//look for next id
var getNextId = function(id, html){
  var ids = html.match(regIds)
  var idFound = false
  var nextId = null
  ids.forEach(function(curId){
    if(idFound)
      nextId = curId.slice(4)
    if(curId.slice(4) == id)
      idFound = true
  })
  return nextId
}