/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxLength: [20, 'Username must be less than 20 characters'],
      unique: [true, 'Username must be unique'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
    },
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      maxLength: [100, 'Full name must be less than 100 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxLength: [50, 'Email must be less than 50 characters'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      match: [/^[0-9]{9,11}$/, 'Please provide a valid phone number'],
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'blocked'],
        message: 'Status must be either active or blocked',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const User = model('User', userSchema);

export default User;
