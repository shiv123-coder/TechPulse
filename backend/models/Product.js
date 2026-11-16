const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
      default: 0.0
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      index: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide product image URL'],
      trim: true
    },
    stockCount: {
      type: Number,
      required: [true, 'Please specify stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Text index on name and description for fast search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

