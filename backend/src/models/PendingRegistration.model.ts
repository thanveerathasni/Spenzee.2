import mongoose, {
  type Document,
  type Model,
  Schema,
} from "mongoose";

export interface IPendingRegistration
  extends Document {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  expiresAt: Date;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const pendingRegistrationSchema =
  new Schema<IPendingRegistration>(
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
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      deletedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    },
  );

// indexes 


pendingRegistrationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

pendingRegistrationSchema.index({
  email: 1,
});

pendingRegistrationSchema.index({
  deletedAt: 1,
});

export const PendingRegistrationModel: Model<IPendingRegistration> =
  mongoose.model<IPendingRegistration>(
    "PendingRegistration",
    pendingRegistrationSchema,
  );