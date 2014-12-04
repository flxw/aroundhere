var mongoose = require('mongoose');

var monumentSchema = new mongoose.Schema({
  _id: String,
  description: String,
  addresses : [String],
  submonuments : [{ type: mongoose.Schema.Types.String, ref: 'Monument' }],
  dbpedia_link : String
});

module.exports = mongoose.model('Monument', monumentSchema);

