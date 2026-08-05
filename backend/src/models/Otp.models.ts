import { Schema, model } from "mongoose";

export interface IOtp {
    email: string;
    code: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
    updatedAt: Date;

    deletedAt: Date | null;
}

const OtpSchema = new Schema<IOtp>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        deletedAt: {
    type: Date,
    default: null,
},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// OtpSchema.index({ email: 1 });
OtpSchema.index({
    deletedAt: 1,
});
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = model<IOtp>("Otp", OtpSchema);