'use strict';

var mongoose     = require('mongoose')
var config       = require('./config.js')
var Monument     = require('./models/monument.js')
var Address      = require('./models/address.js')
var swig         = require('swig')
var rdfTemplate  = swig.compileFile('views/monument.ttl')

mongoose.connect(config.db.url)

Monument.find({}, function(err, monuments) {
  if (err || monuments === undefined) {
    return
  }

  Address.find({_id: {$in: monuments[0].addresses}}, function(err, addresses) {
    if (err || addresses === undefined) {
      return
    }

    console.log(rdfTemplate({monument:monuments[0], addresses: addresses}))
    mongoose.disconnect()
  })
})

