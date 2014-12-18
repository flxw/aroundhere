var mongoose = require('mongoose')
var config = require('./config.js');
var linkData = require("./link.js")
var rdf = require("./moduleRDF.js")

//models ----------------------------------------
var address = require('./models/address.js')
var monument = require('./models/monument.js')

// configuration --------------------------------
mongoose.connect(config.db.url)


var requests = {
    nearby: function(reqData, callback, res){

        address
            .find({
                geolocation: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(reqData.latitude), parseFloat(reqData.longitude)]
                        }, $maxDistance: parseFloat(reqData.distance)
                    }
                }
            })
            .populate('belongsToMonument')
            .exec(function (err, docs) {
                var countMonuments = docs.length

                var monumentReply = []
                var syncCount = 0
                var sync = function(monument){
                    syncCount += 1
                    monumentReply.push(monument)
                    //console.log("synced for " + monument.mon.belongsToMonument._id + " count " + syncCount  + " of " + countMonuments)
                    if(syncCount == countMonuments){
                        callback(res, err, monumentReply)
                    }
                }

                if (docs.length === 0) {
                    console.log('no data yet!')
                    res.json([])
                }


                docs.forEach(function(monument){
                    //console.log("Link data for " + monument.belongsToMonument._id)
                    linkData.linkData(monument.belongsToMonument._id, function(data) {
                        var aggregatedData = {}
                        try {
                            aggregatedData["mon"] = monument
                            aggregatedData["linkedData"] = data

                        } catch (err) {
                            console.log("Error in Db-Answer: " + err)
                        }
                        sync(aggregatedData)

                    })
                })


            })
    },
    monument: function(reqData, callback, res){
        linkData.linkData(reqData.monumentId, function(data){
            console.log(reqData.monumentId)
            monument
                .find({_id: reqData.monumentId})
                .populate('addresses')
                .exec(function(err, docs){
                    console.log(err)
                    console.log(docs)
                    try {
                        for (var key in docs[0]) {
                            data[key] = docs[0][key]
                        }
                        console.log(data)
                    }catch(err){
                        console.log("Error in Db-Answer: " + err)
                    }
                    if(reqData.type == 'rdf')
                        data = rdf.creatRDF(data)
                    callback(res, null, data)
                })
        })

    }
}

//Values that equal null are mandatory fields for the request
var requestData = {
    nearby:{
        latitude: null,
        longitude: null,
        distance: 1000
    },
    monument:{
        monumentId: null,
        type: "rdf"
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
    for(var key in requestData[request]){
        if(!(key in data) )
            if(! (requestData[request][key] === null) )
                data[key] = requestData[request][key]
            else
                return false

    }
    return true

}

exports.handleRequest = handleRequest