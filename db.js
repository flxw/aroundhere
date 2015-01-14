var mongoose = require('mongoose')
var config = require('./config.js');
var linkData = require("./link.js")
var rdf = require("./moduleRDF.js")
var mongojs = require("mongojs")

//models ----------------------------------------
var address = require('./models/address.js')
var monumentSchema = require('./models/monument.js')

// configuration --------------------------------
mongoose.connect(config.db.url)
var collections = ["addresses", "monuments"]
var db = mongojs.connect(config.db.url, collections);

var requests = {
    nearby: function(reqData, callback, res){
        var updates = []
        var syncCount = 0
        var countMonuments

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
                countMonuments = docs.length

                var monumentReply = []

                if (docs.length === 0) {
                    console.log('no data yet!')
                    res.json([])
                }

                var updatedIds = []
                for(var i = 0; i<docs.length; i++){
                        var monument = docs[i]
                        //console.log("Link data for " + monument.belongsToMonument._id)

                        var update = monument.belongsToMonument.lastUpdate == "" ||
                            (new Date(Date.now()).getTime() - monument.belongsToMonument.lastUpdate) /  (1000*3600*24) > 14
                        //Dont update the same id more than one time at once
                        if(update && !(updatedIds.indexOf(monument.belongsToMonument._id) > -1)) {
                            console.log("Update Monument with id: " + monument.belongsToMonument._id)
                            updatedIds.push(monument.belongsToMonument._id)
                            linkData.linkData(monument.belongsToMonument._id, function (data) {
                                var date = new Date(Date.now()).getTime() + ""

                                db.monuments.update({_id: data.monumentId}, {$set: {linkedData: JSON.stringify(data), lastUpdate: date}}, function(err, updated){
                                    if( err || !updated ) console.log(err);
                                })
                            })

                        }else
                            countMonuments -= 1

                        monumentReply.push(monument)

                }
                callback(res, err, monumentReply)


            })
    },
    monument: function(reqData, callback, res){
        linkData.linkData(reqData.monumentId, function(data){
            console.log(reqData.monumentId)
            monumentSchema
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