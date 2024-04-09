import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

// Define the interface for the User document
interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  validatePassword(password: string): Promise<boolean>;
}

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

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (err) {
    return next(err as Error);
  }
});

// Method to validate password
userSchema.methods.validatePassword = async function (password: string) {
  return await bcryptjs.compare(password, this.password);
};

// Register the schema with Mongoose
const User = model<UserDocument>("User", userSchema);

export default User;
