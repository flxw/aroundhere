var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  _id: String,
  geolocation: {
    type: { type: String, default: 'Point' },
    coordinates: {type:[Number], index: '2dsphere'}
  },
  belongsToMonument: { type: String, ref: 'Monument' }
});

module.exports = mongoose.model('Address', addressSchema);