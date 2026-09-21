import { Schema, model, type Types } from "mongoose";

import { VerificationStatus } from "../shared/enums/VerificationStatus";

export interface IProviderVerification {
  provider: Types.ObjectId;
  status: VerificationStatus;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  rejectedReason?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderVerificationSchema = new Schema<IProviderVerification>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    verifiedAt: Date,
    rejectedReason: String,
    remarks: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ProviderVerificationSchema.index({ provider: 1 }, { unique: true });
ProviderVerificationSchema.index({ status: 1 });

export const ProviderVerificationModel = model<IProviderVerification>(
  "ProviderVerification",
  ProviderVerificationSchema,
);
