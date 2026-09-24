import { Schema, model, Document, Types } from 'mongoose';
import crypto from 'crypto';

export type OTPPurpose = 'verify_email' | 'reset_password';

export interface IOTP extends Document {
  user: Types.ObjectId;
  purpose: OTPPurpose;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
  createdAt: Date;
  updatedAt: Date;
  compareCode(candidate: string): boolean;
}

const otpSchema = new Schema<IOTP>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purpose: {
      type: String,
      enum: ['verify_email', 'reset_password'],
      required: true,
    },
    codeHash: {
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
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.codeHash; // never expose the hash, even accidentally
        return ret;
      },
    },
  }
);

// TTL index: MongoDB automatically deletes the document once expiresAt
// passes — expireAfterSeconds: 0 means "expire exactly at the stored
// date/time," not 0 seconds after creation.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static helper — used by whoever builds otpService.ts when generating a
// new code, so the hashing logic lives in exactly one place.
otpSchema.statics.hashCode = function (plainCode: string): string {
  return crypto.createHash('sha256').update(plainCode).digest('hex');
};

otpSchema.methods.compareCode = function (candidate: string): boolean {
  const candidateHash = crypto.createHash('sha256').update(candidate).digest('hex');
  return candidateHash === this.codeHash;
};

export default model<IOTP>('OTP', otpSchema);