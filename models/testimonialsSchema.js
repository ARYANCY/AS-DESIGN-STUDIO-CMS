const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ratings: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
