var linkData = require("./link.js")

var init = function(app){
  app.route('/')
  .get(function(req, res) {
    res.render('index.html')
  })

  app.get("/backend/id/*", function(req, res){
      linkData.linkData()
  })
}

exports.init = init