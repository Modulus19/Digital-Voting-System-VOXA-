import { Schema, model, Document, Types } from 'mongoose';

export interface IVote extends Document {
  voter: Types.ObjectId;
  poll: Types.ObjectId;
  selectedOption: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    voter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    poll: {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
    },
    selectedOption: {
      // No `ref` — this points at a sub-document inside poll.options[],
      // not a top-level collection. See discussion above for why.
      type: Schema.Types.ObjectId,
      required: true,
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
        return ret;
      },
    },
  }
);

// DB-level guarantee: one vote per user per poll, enforced by MongoDB
// itself, independent of any application-level duplicate-vote check.
voteSchema.index({ voter: 1, poll: 1 }, { unique: true });

export default model<IVote>('Vote', voteSchema);