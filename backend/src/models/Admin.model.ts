import { Schema, model } from "mongoose";

export interface IAdmin {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        firstName: {
            type: String,
            // required: true,
            trim: true,
        },
        lastName: {
            type: String,
            // required: true,
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
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ isActive: 1 });

export const AdminModel = model<IAdmin>("Admin", AdminSchema);