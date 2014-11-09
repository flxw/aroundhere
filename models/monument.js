var mongoose = require('mongoose');

var monumentSchema = new mongoose.Schema({
  /*geo: {type: [Number], index: '2d'},*/
  numericIdentifier: Number,
  description: String,
  addresses : [String]/*,
  neighborhood : String*/
});

module.exports = mongoose.model('Monument', monumentSchema);

