import { Schema, model, Document, Types } from 'mongoose';

export type PollStatus = 'draft' | 'published' | 'closed';
export type ResultsVisibility = 'after_vote' | 'after_close' | 'admin_only';

export interface IPollOption {
  text: string;
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  status: PollStatus;
  resultsVisibility: ResultsVisibility;
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const pollOptionSchema = new Schema<IPollOption>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const pollSchema = new Schema<IPoll>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [pollOptionSchema],
      required: true,
      validate: {
        validator: (options: IPollOption[]) => options.length >= 2,
        message: 'A poll must have at least 2 options.',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
    resultsVisibility: {
      type: String,
      enum: ['after_vote', 'after_close', 'admin_only'],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export default model<IPoll>('Poll', pollSchema);