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

// Export the User model
export default model<UserDocument>("User", userSchema);

// Example usage
const User = model<UserDocument>("User");

const user = new User({ email: 'example@example.com', username: 'exampleUser', password: 'password' });
user.save()
  .then(savedUser => {
    console.log(savedUser);
    // Now you can call validatePassword
    user.validatePassword('password')
      .then(isValid => {
        console.log('Is password valid?', isValid);
      })
      .catch(error => {
        console.error(error);
      });
  })
  .catch(error => {
    console.error(error);
  });
