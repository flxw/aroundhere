var mongoose = require('mongoose')
var config = require('./config.js');
var linkData = require("./link.js")

//models ----------------------------------------
var address = require('./models/address.js')
var monument = require('./models/monument.js')

// configuration --------------------------------
mongoose.connect(config.db.url)


var requests = {
    nearby: function(data, callback, res){
        address
            .find()//{geolocation: {$near : {$geometry: {type:'Point', coordinates: [parseFloat(data.lat),parseFloat(data.long)]}, $maxDistance: parseFloat(data.distance)}}})
            .populate('belongsToMonument')
            .exec(function(err, docs){
                callback(res, err, docs)

            })
    },
    monument: function(data, callback, res){
        linkData.linkData(data.monumentId, function(data){
            callback(res, null, data)

        })

    }
}

//Values that equal null are mandatory fields for the request
var requestData = {
    nearby:{
        lat: null,
        long: null,
        distance: 1000
    },
    monument:{
        monumentId: null
    }

}

var handleRequest = function(res, request, data, callback){
    var dataValid = confirmData(data, request)
    if(dataValid)
        requests[request](data, callback, res)
    else
        callback(res, null, {error: "Some arguments in your request were missing!"})

}

var confirmData = function(data, request){
    for(key in requestData[request]){
        if(!(key in data) )
            if(! (requestData[request][key] === null) )
                data[key] = requestData[request][key]
            else
                return false

    }
    return true

}

exports.handleRequest = handleRequest