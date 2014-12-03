var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  geolocation: {
    type: { type: String, default: 'Point' },
    coordinates: {type:[Number], index: '2d'}
  },
  formatted: String,
  belongsToMonument: { type: mongoose.Schema.Types.ObjectId, ref: 'Monument' }
});

module.exports = mongoose.model('Address', addressSchema);

