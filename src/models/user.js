import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  gender: { type: String, required: true },
  role: { type: String, default: 'user' },
  profilePhoto: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/blossam-bazar.appspot.com/o/images%2Fconsultant%2Fuser.png?alt=media&token=66835751-2c63-49c1-a5fc-baacfea51bf0'
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);
export { User };
