var mongoose = require('mongoose')
var textSearch = require('mongoose-text-search')

var monumentSchema = new mongoose.Schema({
  _id: String,
  description: String,
  label: String,
  addresses : [{type: mongoose.Schema.Types.ObjectId, ref: 'Address'}],
  submonuments : [{ type: String, ref: 'Monument' }],
  linkedData: String,
  lastUpdate: String
})

monumentSchema.plugin(textSearch)
//monumentSchema.index({description: 'text'})
monumentSchema.index({label: 'text'})

module.exports = mongoose.model('Monument', monumentSchema)

