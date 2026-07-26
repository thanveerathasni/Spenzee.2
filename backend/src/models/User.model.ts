import { Schema, model } from "mongoose";
import { AuthProvider } from "../shared/enums/AuthProvider";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    authProvider: AuthProvider;
    phone?: string;
    profilePicture?: string;
    isVerified: boolean;
    isActive: boolean;
    lastLoginAt?: Date;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
            select: false,
        },
        authProvider: {
            type: String,
            enum: Object.values(AuthProvider),
            default: AuthProvider.LOCAL,
        },
        phone: {
            type: String,
            trim: true,
        },
        profilePicture: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLoginAt: {
            type: Date,
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

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ deletedAt: 1 });

export const UserModel = model<IUser>("User", UserSchema);