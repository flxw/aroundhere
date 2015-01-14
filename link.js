var http = require('http');
var request = require('request')

var crawledWikis = {}
var wikiLinks = [

  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Charlottenburg",
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
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte/Stralauer_Vorstadt",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Adlershof",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Alt-Hohensch%C3%B6nhausen",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Alt-Treptow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Altglienicke",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Baumschulenweg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Biesdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Blankenburg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Blankenfelde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Bohnsdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Borsigwalde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Britz",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Buch",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Buckow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Charlottenburg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Charlottenburg-Nord",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Dahlem",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Falkenberg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Falkenhagener_Feld",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Fennpfuhl",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Franz%C3%B6sisch_Buchholz",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedenau",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichsfelde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichshagen",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichshain",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Frohnau",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Gatow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Gesundbrunnen",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Gropiusstadt",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Gr%C3%BCnau",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Grunewald",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Hakenfelde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Halensee",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Hansaviertel",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Haselhorst",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Heiligensee",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Heinersdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Hellersdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Hermsdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Johannisthal",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Karlshorst",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Karow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Kaulsdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Kladow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Konradsh%C3%B6he",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-K%C3%B6penick",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Kreuzberg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Lankwitz",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichtenberg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichtenrade",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichterfelde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-L%C3%BCbars",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Mahlsdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Malchow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Mariendorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Marienfelde",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-M%C3%A4rkisches_Viertel",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Marzahn",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Moabit",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-M%C3%BCggelheim",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Neu-Hohensch%C3%B6nhausen",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Neuk%C3%B6lln",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Niedersch%C3%B6neweide",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Niedersch%C3%B6nhausen",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Nikolassee",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Obersch%C3%B6neweide",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Pankow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Pl%C3%A4nterwald",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Prenzlauer_Berg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Rahnsdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Reinickendorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Rosenthal",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Rudow",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Rummelsburg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Schmargendorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Schm%C3%B6ckwitz",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Sch%C3%B6neberg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Siemensstadt",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Spandau",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Staaken",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Steglitz",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Tegel",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Tempelhof",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Tiergarten",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Waidmannslust",
  "http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wannsee",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wartenberg",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wedding",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wei%C3%9Fensee",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Westend",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilhelmsruh",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilhelmstadt",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilmersdorf",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Wittenau",
  //"http://de.wikipedia.org//wiki/Liste_der_Kulturdenkmale_in_Berlin-Zehlendorf"


]

var linkData = function(id, topCallback){
  var sites = {}
  //console.log("Started Linking for " + id)
  crawledWikis[id] = 0
  wikiLinks.forEach(function(entry){
    crawlURL(entry, getLinkForId, id, topCallback)
  })

  //getLinkForId(id, sites)
}

function sync(id, topCallback){
  //console.log("Sync, ID " + id + " crawled " + crawledWikis[id] + " of " + wikiLinks.length)
  if(crawledWikis[id] >= wikiLinks.length){

    topCallback({})
  }

}

function crawlURL(url, callback, id, topCallback){
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;

    });
    res.on("end", function() {
      crawledWikis[id] += 1
      callback(id, url, data, topCallback);
    });
  }).on("error", function() {
    //Error case
  });
}

//Regular Expressions for parsing Wikipedia
var regIds  = /<td rowspan.*id="\d{8}|<span.*id="\d{8}/g
var regImages = /src=".*\.jpg"/gi
var possibleLink = /<td[\s\S]*?<\/td>/
var linkExtract = /\/.*?" /
//Regex for Senatsseite Berlin
var yearOfConstructionRegex = /num-Dat.:.*<td/i
var getDate = /\d{4}/
var nextNewTd = /<td.*<\/td>/
var tagContent = />.*</
var monumentsTypeRegex = /Denkmalart:/

function getLinkForId(id, url, html, topCallback){
    var index = html.search(id)
    var linkedData = {}

    if(index > -1) {
      console.log("   Match found in " + url)
      //Define Range of interesting Part for a monumentID
      var startIndex = html.indexOf("href", index)
      var endScopeImg = html.search(getNextId(id, html))

      var monumentHtml = html.slice(startIndex, endScopeImg)

      //EndIndex for getting the SenatBerlin link
      var endIndex = html.indexOf('\"', startIndex + 6)
      var link = html.substring(startIndex + 6, endIndex)
      linkedData.link = link

      //console.log("StartIndex: " + startIndex)
      //console.log("EndIndex ScopeImage: " + endScopeImg)
      //console.log("Endindex SenatLink: " + endIndex)

      //Parse Images from Wikipedia
      var imgLinks = getImageForId(id, monumentHtml)
      linkedData.images = imgLinks

      //Parse for possible Wikidata Link
      var wikiDataLink = getLinkFromHtml(monumentHtml)
      if(wikiDataLink)
        linkedData.wikiDataLink = wikiDataLink

      crawledWikis[id] = 0

      console.log(linkedData)
      request(linkedData.link, function (error, response, body) {
        var indexStartHtml = body.search(id)
        body = body.slice(indexStartHtml)
        //Crawl Data from Senatsseite Berlin
        var yearOfConstruction = getYearOfConstruction(body)
        if(yearOfConstruction)
          linkedData.yearOfConstruction = yearOfConstruction

        var type = typeOfMonument(body)
        if(type)
          linkedData.typeOfMonument = type

        linkedData.monumentId = id
        topCallback(linkedData)
      })



    }else{
      sync(id, topCallback)
      //console.log("No Match found in " + url)
    }


}

exports.linkData = linkData


// private -------------------------------------------------------
var typeOfMonument = function(html){
  try{
    var index = html.search(monumentsTypeRegex)
    if(index > -1){
      html = html.slice(index)
      var nextTd = html.match(nextNewTd)[0]
      var type = nextTd.match(tagContent)[0]
      type = type.slice(1,type.length-1)
      return type

    }
  }catch(error){
    console.log("Error at monumentType: " + error)
  }
  return null
}

var getYearOfConstruction = function(html){
  try{
    var index = html.search(yearOfConstructionRegex)
    if(index > -1){
      html = html.slice(index)
      var date = html.match(getDate)
      return date
    }
  }catch(error){
    console.log("Error at YearOfConstruction: " + error)
  }
  return null
}

var getLinkFromHtml = function(html){
  try{
      var nextColumn = html.match(possibleLink)[0]
      if(nextColumn.match(/a/).length == 1) {

        var link = nextColumn.match(linkExtract)
        link = link[0].slice(0, link.length - 3)
        if(link.slice(-3).match(/jpg|png|gif/))
          link = null
        else
          link = "http://www.dbpedia.org" + link.replace("wiki", "page")
        return link
      }
    }catch(err){
      console.log("Error while parsing for WikiData_link: " + err)
    }



  return null
}

var getImageForId = function(id, html){
  try {
    //console.log(html)
    var images = html.match(regImages)
    for (var i = 0; i < images.length; i++) {
      images[i] = images[i].slice(7)
      images[i] = "http://" + images[i].slice(0, images[i].length - 1)
      images[i] = images[i].replace(/\/.{0,4}px/, "/512px")
    }
    return images
  }catch(error){
    console.log("Error while Parsing image: " + error)
    return null
  }
}


//look for next id
var getNextId = function(id, html){
  var ids = html.match(regIds)
  var idFound = false

  for(var i=0; i<ids.length; i++){
    var curId = ids[i]
    if(idFound)
      return curId //.slice(26)
    if(curId.match(/\d{8}/) == id){
      idFound = true
    }

  }
}