import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  gigId: mongoose.Types.ObjectId;
  amount: number;
  dueDate: Date;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gigId: {
      type: Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Under Review', 'Completed', 'Cancelled'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);