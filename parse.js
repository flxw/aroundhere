'use strict';

var fs       = require('fs')
var mongoose = require('mongoose')
var config   = require('./config')
var Monument = require('./models/monument.js')

var monumentStringlist = fs.readFileSync('./denkmalliste.txt').toString().replace(/\r/g,'').split('\n')

//var addressExpression = new RegExp('^[A-Za-zßäöüÄÖÜ -]+ ([0-9]+(-|/)[0-9]+|[0-9]+)[A-Z]{0,1}')
var addressExpression = new RegExp('^[A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}')
var addressTextExpression = new RegExp('^[A-Za-zßäöüÄÖÜ -]+ ')
var descriptionExpression = new RegExp('[a-zA-ZäöüÄÖÜ]{3,}[„“()-., a-zA-ZäöüÄÖÜ1-9]*$')
var createdMonuments = 0
var failedDescriptionExtractions = 0

mongoose.connect(config.db.url)


for (var i = 0, len = monumentStringlist.length; i < len; ++i) {
  if(/^[0-9]{8}/.test(monumentStringlist[i])) {
    var monument = new Monument
    createdMonuments++

    monument.numericIdentifier = parseInt(monumentStringlist[i])

    // loop through block until newline appears
    for (; (monumentStringlist[i] !== '') && (i < len); ++i) {
      var currentLine = monumentStringlist[i].trim()
      var address, description

      if (addressExpression.test(currentLine)) {
        address = addressExpression.exec(currentLine)[0]
        monument.addresses.push(address)

        if (monument.addresses.length == 1) {
          try {
            monument.description = descriptionExpression.exec(currentLine)[0]
          } catch(e) {
            console.log('FAILED TO EXTRACT DESCRIPTION FROM: ' +  currentLine)
            failedDescriptionExtractions++
          }
        }
      }
    }

    monument.save()
  }
}

console.log('Extracted ' + createdMonuments + ' monuments')
console.log('Failed to get descriptions for ' + failedDescriptionExtractions + ' of them')

mongoose.disconnect()