import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  profileTitle?: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CLIENT', 'FREELANCER', 'ADMIN'], default: 'FREELANCER' },
    profileTitle: { type: String, trim: true },
    bio: { type: String, trim: true },
    skills: { type: [String], default: [] },
    hourlyRate: { type: Number, min: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);