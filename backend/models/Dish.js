const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
dishSchema.index({ category: 1 });
dishSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dish', dishSchema); 