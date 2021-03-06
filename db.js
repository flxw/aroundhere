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
var updatedIds = []

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
                    //res.json([])
                }


                for(var i = 0; i<docs.length; i++){
                    var monument = docs[i]
                    //console.log("Link data for " + monument.belongsToMonument._id)

                    var update = monument.belongsToMonument.lastUpdate == "" ||
                        (new Date(Date.now()).getTime() - monument.belongsToMonument.lastUpdate) /  (1000*3600*24) > 14
                    //Dont update the same id more than one time at once
                    if(!(updatedIds.indexOf(monument.belongsToMonument._id) > -1) && update) {
                        console.log("Update Monument with id: " + monument.belongsToMonument._id)
                        updatedIds.push(monument.belongsToMonument._id)
                        linkData.linkData(monument.belongsToMonument._id, function (data) {
                            var count = 0
                            for(var key in data){
                                count++
                            }
                            if(count>0) {

                                var date = new Date(Date.now()).getTime() + ""
                                db.monuments.update({_id: data.monumentId}, {
                                    $set: {
                                        linkedData: JSON.stringify(data),
                                        lastUpdate: date
                                    }
                                }, function (err, updated) {
                                    if (err || !updated) console.log(err);
                                    console.log("\t" + data.monumentId + " monument updated")
                                    var index = updatedIds.indexOf(data.monumentId)
                                    updatedIds.splice(index, 1)
                                })
                                if (data.description) {
                                    db.monuments.update({_id: data.monumentId}, {$set: {description: data.description}}, function (err, updated) {
                                        if (err || !updated) console.log(err);
                                    })
                                }

                                if (data.label) {
                                    db.monuments.update({_id: data.monumentId}, {$set: {label: data.label}}, function (err, updated) {
                                        if (err || !updated) console.log(err);
                                    })
                                }

                            }

                        })

                    }else
                        countMonuments -= 1

                    var realDic = {}


                    realDic.linkedData = monument.belongsToMonument.linkedData
                    if(realDic.linkedData != "")
                        realDic.linkedData = JSON.parse(realDic.linkedData)
                    realDic.label = monument.belongsToMonument.label
                    realDic.description = monument.belongsToMonument.description
                    realDic.formatted = monument.formatted
                    realDic.geolocation = monument.geolocation


                    monumentReply.push(realDic)

                }



                callback(res, err, monumentReply)


            })
    },
    monument: function(reqData, callback, res){
        monumentSchema
            .find({_id: reqData.monumentId})
            .populate('addresses')
            .exec(function(err, docs){
                var data = {}
                try {
                    for (var key in docs[0]) {
                        data[key] = docs[0][key]
                    }
                    console.log(data)
                }catch(err){
                    console.log("Error in Db-Answer: " + err)
                }
                data = rdf.creatRDF(data)
                callback(res, null, data)

                var monument = docs[0]
                console.log(monument)
                var update = monument.lastUpdate == "" ||
                    (new Date(Date.now()).getTime() - monument.lastUpdate) /  (1000*3600*24) > 14
                //Dont update the same id more than one time at once
                if(update) {
                    console.log("Update Monument with id: " + monument._id)
                    updatedIds.push(monument._id)
                    linkData.linkData(monument._id, function (data) {
                        var count = 0
                        for (var key in data) {
                            count++
                        }
                        if (count > 0) {

                            var date = new Date(Date.now()).getTime() + ""
                            db.monuments.update({_id: data.monumentId}, {
                                $set: {
                                    linkedData: JSON.stringify(data),
                                    lastUpdate: date
                                }
                            }, function (err, updated) {
                                if (err || !updated) console.log(err);
                                console.log("\t" + data.monumentId + " monument updated")
                                var index = updatedIds.indexOf(data.monumentId)
                                updatedIds.splice(index, 1)
                            })
                            if (data.description) {
                                db.monuments.update({_id: data.monumentId}, {$set: {description: data.description}}, function (err, updated) {
                                    if (err || !updated) console.log(err);
                                })
                            }

                            if (data.label) {
                                db.monuments.update({_id: data.monumentId}, {$set: {label: data.label}}, function (err, updated) {
                                    if (err || !updated) console.log(err);
                                })
                            }

                        }

                    })
                }
            })

    },

    search: function(reqData, callback, res){
        monumentSchema
            .find(
                {$text : { $search: reqData.query} }
            )
            .populate("addresses")
            .exec(function(err, docs) {

                var formattedOutput = []
                for(var i=0; i<docs.length ; i++){
                    var currMonument = docs[i]
                    var formattedObject = {}

                    formattedObject.linkedData = currMonument.linkedData
                    if(formattedObject.linkedData != "")
                        formattedObject.linkedData = JSON.parse(formattedObject.linkedData)
                    formattedObject.label = currMonument.label
                    formattedObject.description = currMonument.description
                    formattedObject.addresses = []
                    for(var k=0; k<currMonument.addresses.length; k++) {
                        var addressObject = {}
                        addressObject.formatted = currMonument.addresses[k].formatted
                        addressObject.geolocation = currMonument.addresses[k].geolocation
                        formattedObject.addresses.push(addressObject)
                    }

                    formattedOutput.push(formattedObject)
                }

                callback(res, null, formattedOutput)
            });
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
    },
    search:{
        query: null
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

//Indexes:
/*

db.monuments.dropIndex("description_text")
db.monuments.ensureIndex({label: 'text', description: 'text', linkedData: 'text'})

*/