import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => String(v).length >= 10 && String(v).length <= 15,
        message: 'Phone number must be between 10 and 15 digits.',
      },
    },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    profilePhoto: {
      type: String
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const User = mongoose.model('User', userSchema);
export { User };
