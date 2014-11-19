var mongoose = require('mongoose');

var monumentCoordinateSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  belongsToMonument: { type: mongoose.Schema.Types.ObjectId, ref: 'Monument' }
});

module.exports = mongoose.model('MonumentCoordinate', monumentCoordinateSchema);

