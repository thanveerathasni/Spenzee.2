import { Schema, model, Types } from "mongoose";

export interface IProviderPasswordSetupToken {
    provider: Types.ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ProviderPasswordSetupTokenSchema =
    new Schema<IProviderPasswordSetupToken>(
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
        }
    );

ProviderPasswordSetupTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export const ProviderPasswordSetupTokenModel =
    model<IProviderPasswordSetupToken>(
        "ProviderPasswordSetupToken",
        ProviderPasswordSetupTokenSchema
    );