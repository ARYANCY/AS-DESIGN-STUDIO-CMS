const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
    businessName: {
    type: String,
    required: true,
    trim: true
  },
  tagLine: {
    type: String,
    required: true,
    trim: true
  },
  shortIntro: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    url:String,
    filename:String,

  }
})

module.exports = mongoose.model('Hero', heroSchema);