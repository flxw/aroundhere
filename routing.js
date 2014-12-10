var db = require("./db.js")
var modUrl = require("url")

var init = function(app){
  app.route('/')
  .get(function(req, res) {
    res.render('index.html')
  })

  app.get("/backend/id/*", function(req, res){
      var url = modUrl.parse(req.url)
      var routeElem = getRoutes(url.pathname)
      var id = routeElem[routeElem.length-1]
      linkData.linkData(id)
      res.send("Everything is fine")
  })

    app.get("/backend/monuments/", function(req, res){
        var data = req.query
        console.log(data)
        db.handleRequest(res, "nearby", data, dbCallback)
    })

    app.get("/monument/*", function(req, res){
        var url = modUrl.parse(req.url)
        var routeElem = getRoutes(url.pathname)
        var id = routeElem[routeElem.length-1]
        db.handleRequest(res, "monument", {monumentId: id}, rdfCallback)
    })
}

var dbCallback = function(_res, err, docs){
    _res.set('Content-Type', 'application/json')
    _res.send(JSON.stringify(docs))
}

var rdfCallback = function(_res, err, rdf){
    _res.set('Content-Type', "text/plain")//'application/x-turtle')
    _res.send(rdf)
}


var getRoutes = function(path){
    var routes = path.split("/")
    return routes
}

exports.init = init