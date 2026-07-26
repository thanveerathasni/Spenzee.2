import { Schema, model, type Types } from "mongoose";
import { AddressType } from "../shared/enums/AddressType";

export interface IAddress {
    user: Types.ObjectId;
    type: AddressType;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(AddressType),
            default: AddressType.HOME,
        },
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

AddressSchema.index({ user: 1 });

export const AddressModel = model<IAddress>("Address", AddressSchema);