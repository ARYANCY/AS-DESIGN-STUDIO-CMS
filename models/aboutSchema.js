const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  image: {
    url:String,
    filename:String,
  },
  title:{
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('About', aboutSchema);
