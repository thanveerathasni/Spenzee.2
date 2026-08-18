import { Schema, model, type Types } from "mongoose";

export interface IAdmin {
  _id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLoginAt?: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

AdminSchema.index({ isActive: 1 });
AdminSchema.index({ deletedAt: 1 });

export const AdminModel = model<IAdmin>("Admin", AdminSchema);