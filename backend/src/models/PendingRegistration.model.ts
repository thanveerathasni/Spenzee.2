import { Schema, model } from "mongoose";

export interface IPendingRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expiresAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
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
    },
    expiresAt: {
      type: Date,
      required: true,
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

PendingRegistrationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

PendingRegistrationSchema.index({
  deletedAt: 1,
});

export const PendingRegistrationModel = model<IPendingRegistration>(
  "PendingRegistration",
  PendingRegistrationSchema,
);
