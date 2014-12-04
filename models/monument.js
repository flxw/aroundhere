var mongoose = require('mongoose');

var monumentSchema = new mongoose.Schema({
  _id: String,
  description: String,
  addresses : [{type: String, ref: 'Address'}],
  submonuments : [{ type: String, ref: 'Monument' }],
  dbpedia_link : String
});

module.exports = mongoose.model('Monument', monumentSchema);

