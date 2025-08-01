const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  image: {
    url:String,
    filename:String,

  },
  title:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Project', projectSchema);
