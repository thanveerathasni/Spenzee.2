import { Schema, model } from "mongoose";

export interface IResetPasswordToken {
  deletedAt?: Date | null;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResetPasswordTokenSchema = new Schema<IResetPasswordToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ResetPasswordTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ResetPasswordTokenSchema.index({ email: 1 }, { unique: true });

export const ResetPasswordTokenModel = model<IResetPasswordToken>(
  "ResetPasswordToken",
  ResetPasswordTokenSchema,
);
