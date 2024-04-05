import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/User.interface';
import validator from 'validator';

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [validator.isEmail],
    index: { unique: true }
  },
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  }
}, { timestamps: true });

export default model<UserDocument>("User", userSchema);
