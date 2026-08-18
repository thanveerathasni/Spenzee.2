import { Schema, model } from "mongoose";

import { VerificationStatus } from "../shared/enums/VerificationStatus";

export interface IUserVerification {
  email: string;
  status: VerificationStatus;
  verifiedAt?: Date;
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserVerificationSchema = new Schema<IUserVerification>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },
    verifiedAt: Date,
    rejectedReason: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// UserVerificationSchema.index({ email: 1 }, { unique: true });
UserVerificationSchema.index({ status: 1 });

export const UserVerificationModel = model<IUserVerification>(
  "UserVerification",
  UserVerificationSchema,
);
