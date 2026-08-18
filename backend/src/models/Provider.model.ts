import { Schema, model, type Types } from "mongoose";

import { CommerceStatus } from "../shared/enums/CommerceStatus";
import { ProviderStatus } from "../shared/enums/ProviderStatus";

export interface IProvider {
  brandName: string;
  email: string;
  phone: string;
  primaryCategory: string;
  companyName?: string;
  websiteUrl?: string;
  gstNumber?: string;
  licenseNumber?: string;
  socialLinks?: string[];
  profileImage?: string;
  description?: string;
  hasAcceptedTerms: boolean;

  password?: string;

  status: ProviderStatus;
  commerceStatus: CommerceStatus;

  commerceEnabled: boolean;
  commerceEnabledAt?: Date;

  commerceApprovedBy?: Types.ObjectId;
  commerceRejectedReason?: string;

  commissionPercentage?: number;
  isCommerceFrozen: boolean;

  lastLoginAt?: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    brandName: {
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
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    primaryCategory: {
      type: String,
      required: true,
    },
    companyName: String,
    websiteUrl: String,
    gstNumber: String,
    licenseNumber: String,
    socialLinks: [String],
    profileImage: String,
    description: String,

    hasAcceptedTerms: {
      type: Boolean,
      required: true,
    },

    password: {
      type: String,
      select: false,
    },

    status: {
      type: String,
      enum: Object.values(ProviderStatus),
      default: ProviderStatus.PENDING,
    },

    commerceStatus: {
      type: String,
      enum: Object.values(CommerceStatus),
      default: CommerceStatus.PENDING,
    },

    commerceEnabled: {
      type: Boolean,
      default: false,
    },

    commerceEnabledAt: Date,

    commerceApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    commerceRejectedReason: String,

    commissionPercentage: Number,

    isCommerceFrozen: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ProviderSchema.index({ email: 1 }, { unique: true });
ProviderSchema.index({ status: 1 });
ProviderSchema.index({ commerceStatus: 1 });

export const ProviderModel = model<IProvider>("Provider", ProviderSchema);
