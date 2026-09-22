import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGig extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTimeDays: number;
  coverImage?: string;
  freelancerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GigSchema = new Schema<IGig>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a gig title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [5, 'Price must be at least $5'],
    },
    deliveryTimeDays: {
      type: Number,
      required: [true, 'Please specify delivery time in days'],
      default: 3,
    },
    coverImage: {
      type: String,
      default: '',
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Gig: Model<IGig> =
  mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);