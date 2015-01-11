var mongoose = require('mongoose')

var monumentSchema = new mongoose.Schema({
  _id: String,
  description: String,
  addresses : [{type: mongoose.Schema.Types.ObjectId, ref: 'Address'}],
  submonuments : [{ type: String, ref: 'Monument' }],
  linkedData: String,
  lastUpdate: String
})

module.exports = mongoose.model('Monument', monumentSchema)

