var http = require('http');
var request = require('request')
var sparql = require("sparql")
var jsonld = require("jsonld")

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
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Adlershof",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Alt-Hohensch%C3%B6nhausen",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Alt-Treptow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Altglienicke",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Baumschulenweg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Biesdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Blankenburg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Blankenfelde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Bohnsdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Borsigwalde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Britz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Buch",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Buckow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Charlottenburg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Charlottenburg-Nord",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Dahlem",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Falkenberg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Falkenhagener_Feld",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Fennpfuhl",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Franz%C3%B6sisch_Buchholz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedenau",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichsfelde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichshagen",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Friedrichshain",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Frohnau",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Gatow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Gesundbrunnen",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Gropiusstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Gr%C3%BCnau",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Grunewald",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Hakenfelde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Halensee",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Hansaviertel",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Haselhorst",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Heiligensee",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Heinersdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Hellersdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Hermsdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Johannisthal",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Karlshorst",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Karow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Kaulsdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Kladow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Konradsh%C3%B6he",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-K%C3%B6penick",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Kreuzberg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Lankwitz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichtenberg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichtenrade",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Lichterfelde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-L%C3%BCbars",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mahlsdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Malchow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mariendorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Marienfelde",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-M%C3%A4rkisches_Viertel",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Marzahn",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Mitte",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Moabit",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-M%C3%BCggelheim",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Neu-Hohensch%C3%B6nhausen",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Neuk%C3%B6lln",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Niedersch%C3%B6neweide",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Niedersch%C3%B6nhausen",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Nikolassee",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Obersch%C3%B6neweide",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Pankow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Pl%C3%A4nterwald",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Prenzlauer_Berg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Rahnsdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Reinickendorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Rosenthal",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Rudow",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Rummelsburg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Schmargendorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Schm%C3%B6ckwitz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Sch%C3%B6neberg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Siemensstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Spandau",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Staaken",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Steglitz",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Tegel",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Tempelhof",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Tiergarten",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Waidmannslust",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wannsee",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wartenberg",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wedding",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wei%C3%9Fensee",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Westend",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilhelmsruh",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilhelmstadt",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wilmersdorf",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Wittenau",
  "http://de.wikipedia.org/wiki/Liste_der_Kulturdenkmale_in_Berlin-Zehlendorf"


]
var crawledSites = {}

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
  //console.log("nothing found " + crawledWikis[id] + "/" + wikiLinks.length)
  if(crawledWikis[id] >= wikiLinks.length){
    topCallback({})
  }

}

function crawlURL(url, callback, id, topCallback){
  //console.log("Crawling for id: " + id + " following url \n" + url)
  if(url in crawledSites) {
    //callback(url + " already crawled")
    callback(id, url, crawledSites[url], topCallback);
  }else {
    http.get(url, function (res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;

      });
      res.on("end", function () {
        crawledWikis[id] += 1
        crawledSites[url] = data
        callback(id, url, data, topCallback);
      });
    }).on("error", function () {
      //Error case
    });
  }
}

//Regular Expressions for parsing Wikipedia
var regIds  = /<td rowspan.*id="\d{8}|<span.*id="\d{8}/g
var regImages = /src=".*\.jpg"/gi
var possibleLink = /<td[\s\S]*?<\/td>/
var containedLinks = /<a.*<\/a/g
var getLinkAim = /href=".*?"/g
var linkExtract = /\/.*?" /
var columnsRegex = /<td.*<\/td/g
var allTags = /<.*?>/g
//Regex for Senatsseite Berlin
var yearOfConstructionRegex = /num-Dat.:.*<td/i
var getDate = /\d{4}/
var nextNewTd = /<td.*<\/td>/
var tagContent = />.*</
var monumentsTypeRegex = /Denkmalart:/

function getLinkForId(id, url, html, topCallback){
    try{

    var index = html.search(id)
    var linkedData = {}
    var waitFor = 0

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

      //Parse all Links of Monument of tablerow
      var links = getLinksOfTableRow(monumentHtml)

      var monumentDescription = getMonumentDescription(monumentHtml)
      if(monumentDescription)
        linkedData.description = monumentDescription

      var monumentLabel = getMonumentLabel(monumentHtml)
      if(monumentLabel)
        linkedData.label = monumentLabel

      //Parse for possible Wikidata Link
      if(links[2])
        linkedData.wikiDataLink =  links["2"]

      //Evaluate Descriptionlinks (3rd column) for possible architects
      if(links[3]){
        waitFor++

        parseLinksForArchitects(links[3], function(data){
          linkedData.architects = []
          var count = 0
          var sync = function(){
            count += 1
            if(data.length == count)
              waitFor--
          }

          data.forEach(function(architect){
            getInfosForArchitect(architect, function(info){
              linkedData.architects.push(info)
              sync()
            })
          })

        })
      }



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

        while(waitFor > 0){}
        crawledWikis[id] = 0
        topCallback(linkedData)
      })



    }else{

      sync(id, topCallback)
      //console.log("No Match found in " + url)
    }

    }catch(error){

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
      var date = html.match(getDate)[0]
      return date
    }
  }catch(error){
    console.log("Error at YearOfConstruction: " + error)
  }
  return null
}

var officialDescription = function(){
  var columns = html.match(columnsRegex)
  console.log(columns[1])
}

var getLinksOfTableRow = function(html){
  try{
    var links = html.match(containedLinks)

    var points = []
    for(var i= 0; i<links.length; i++){
      var link = links[i]
      var url = link.match(getLinkAim)
      for(var l=0; l<url.length ; l++){
        url[l] = url[l].slice(6, url[l].length-1)
        //if(url.indexOf("/wiki/") == 0)
        //  url = "http://de.wikipedia.org" + url
        points.push(url[l])
      }

    }

    var columns = html.match(columnsRegex)
    var columnsLinks = {}

    for(var j=0; j<columns.length ; j++){
      for(var k=0; k<points.length; k++){
        var index = columns[j].indexOf(points[k])
        if(index > -1){
          if(columnsLinks[j+2]) {
            if (!Array.isArray(columnsLinks[j + 2])) {
              columnsLinks[j + 2] = [columnsLinks[j + 2], points[k]]
            } else
              columnsLinks[j + 2].push(points[k])
          }else
            columnsLinks[j+2] = points[k]
        }
      }
    }

    for(var key in columnsLinks){
      if(!Array.isArray(columnsLinks[key]))
        columnsLinks[key] = "http://de.dbpedia.org" + columnsLinks[key].replace("wiki", "page")
      else
        for(var j=0; j<columnsLinks[key].length; j++){
          columnsLinks[key][j] = "http://de.dbpedia.org" + columnsLinks[key][j].replace("wiki", "page")
        }
    }

    return columnsLinks
  }catch(error){
    console.log("Error While Parsing Links for ID")
  }

}

var parseLinksForArchitects = function(wikipediaLink, callback){
  try{

    var architects = []
    var countReplys = 0

    var sync = function(){
      countReplys += 1
      if(countReplys == wikipediaLink.length){
        callback(architects)
      }
    }

    wikipediaLink.forEach(function(link){
      getPropertyForEntity(link, "rdfs:comment", function(data, url){
        var regex = /architekt/i
        var match = data.match(regex)
        if( match )
          architects.push(url)
        sync()
      })
    })


    }catch(err){
      console.log("Error while parsing descriptionLinks for Architects: " + err)
      callback([])
    }
}

var getPropertyForEntity = function(url, property, handleData){
    _url = url.split("/")
    var entity = _url[_url.length-1]

    var client = new sparql.Client("http://de.dbpedia.org/sparql")
    client.query('select*{dbpedia-de:' + entity + " " + property +' ?label}', function(err, res){
      var value = ""
      try{
        var diffLanguages = res.results.bindings
        for(var i=0; i<diffLanguages.length; i++){
          if(diffLanguages[i].label["xml:lang"] == "de" || diffLanguages[i].label["xml:lang"] == "en"){
            value = diffLanguages[i].label.value
            break
          }
        }
      }catch(error){
        console.log("\t Error on parsing from dbpedia")
      }

      handleData(value, url, property)
    })

}

var performSPARQL = function(query, handleData){

  var client = new sparql.Client("http://de.dbpedia.org/sparql")
  client.query(query, function(err, res){
    var value = {}
    try{
      var values = res.results.bindings[0]
      for(var key in values){
        value[key] = values[key].value
      }
    }catch(error){
      console.log("\t Error on parsing from dbpedia")
    }

    handleData(value)
  })

}

var getInfosForArchitect = function(url, handleData){
  _url = url.split("/")
  var architect = _url[_url.length-1]
  var query = "PREFIX dbo: <http://dbpedia.org/ontology/>" +
      "select*{"+
      "dbpedia-de:" + architect + " rdfs:comment ?comment."+
      "dbpedia-de:" + architect + " foaf:name ?name."+
      "dbpedia-de:" + architect + " dbo:birthDate ?birth."+
      "dbpedia-de:" + architect + " dbo:deathDate ?death."+
      "dbpedia-de:" + architect + " dbo:abstract ?abstract."+
      "}"


  performSPARQL(query, function(info){
    info.url = url
    handleData(info)
  })

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

var getMonumentDescription = function(html){
  try{
    var columns = getTableColumns(html)
    if(columns[1]){
      return columns[1]
    }else
      return null
  }catch(error){
    console.log("Error while Parsing MonumentDescription")
  }
}

var getMonumentLabel = function(html){
  try{
    var columns = getTableColumns(html)
    if(columns[0]){
      return columns[0]
    }else
      return null
  }catch(error){
    console.log("Error while Parsing MonumentLable")
  }
}

var getTableColumns = function(html){
  try{

    var columns = html.match(columnsRegex)
    var newColumns = []
    for(var i=0; i<columns.length; i++){
        var currColumn = columns[i]
        var noContent = currColumn.match(allTags)
        for(var j=0; j<noContent.length; j++){
          currColumn = currColumn.replace(noContent[j], "")
        }
        currColumn = currColumn.replace("</td", "")
        newColumns.push(currColumn)
    }

    return newColumns
  }catch(error){
    console.log("Error while Parsing TableColumns' content")
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