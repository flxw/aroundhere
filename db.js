var mongoose = require('mongoose')
var config = require('./config.js');

//models ----------------------------------------
var address = require('./models/address.js')
var monument = require('./models/monument.js')

// configuration --------------------------------
mongoose.connect(config.db.url)

var handleRequest = function(res, callback){
    monument.find({}, function(err, docs){
        callback(res, err, docs)
    })
}


exports.handleRequest = handleRequest