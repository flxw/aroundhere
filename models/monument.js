var mongoose = require('mongoose');

var monumentSchema = new mongoose.Schema({
  numericIdentifier: Number,
  description: String,
  addresses : [String],
  submonuments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Monument' }]
});

module.exports = mongoose.model('Monument', monumentSchema);

