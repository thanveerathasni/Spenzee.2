import { Schema, model, type Types } from "mongoose";

export interface IProviderResetPasswordToken {
  provider: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderResetPasswordTokenSchema =
  new Schema<IProviderResetPasswordToken>(
    {
      provider: {
        type: Schema.Types.ObjectId,
        ref: "Provider",
        required: true,
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

ProviderResetPasswordTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export const ProviderResetPasswordTokenModel =
  model<IProviderResetPasswordToken>(
    "ProviderResetPasswordToken",
    ProviderResetPasswordTokenSchema,
  );
