var mongoose = require('mongoose');

var monumentSchema = new mongoose.Schema({
  numericIdentifier: Number,
  description: String,
  addresses : [String]/*,
  neighborhood : String*/
});

module.exports = mongoose.model('Monument', monumentSchema);

