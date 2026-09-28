import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ICertificate {
  id: string;
  title: string;
  issuedBy: string;
  year: string;
}

export interface IFreelancerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  headline?: string;
  hourlyRate?: number;
  description?: string;
  skills: string[];
  education: IEducation[];
  certificates: ICertificate[];
  github?: string;
  linkedin?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FreelancerProfileSchema = new Schema<IFreelancerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // එක් User කෙනෙකුට තනි Profile එකක් පමණක් හිමිවේ
    },
    headline: {
      type: String,
      default: '',
    },
    hourlyRate: {
      type: Number,
      default: 20,
    },
    description: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        id: { type: String },
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
      },
    ],
    certificates: [
      {
        id: { type: String },
        title: { type: String },
        issuedBy: { type: String },
        year: { type: String },
      },
    ],
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const FreelancerProfile =
  mongoose.models.FreelancerProfile ||
  mongoose.model<IFreelancerProfile>('FreelancerProfile', FreelancerProfileSchema);