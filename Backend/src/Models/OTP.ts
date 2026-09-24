import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export type OTPPurpose = "email_verification" | "password_reset";

export interface IOTP extends Document {
  user: Types.ObjectId;
  email: string;
  otpHash: string;
  purpose: OTPPurpose;
  attempts: number;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["email_verification", "password_reset"],
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verifiedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

const OTP: Model<IOTP> =
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", otpSchema);

export default OTP;