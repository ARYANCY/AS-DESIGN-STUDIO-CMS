const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  serviceImage:{
    url:String,
    filename:String,

  },
  pricing: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Service', serviceSchema);
