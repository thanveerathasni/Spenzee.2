import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
    userId: Types.ObjectId;
    userType: "User" | "Provider" | "Admin";
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        userType: {
            type: String,
            required: true,
            enum: ["User", "Provider", "Admin"],
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

RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>(
    "RefreshToken",
    RefreshTokenSchema
);