import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  tags: [
    {
      name: {
        type: String,
        trim: true,
      },
    },
  ],
  productImages: [
    {
      image_url: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update 'updatedAt' field
productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.model('Product', productSchema);
export { Product };
