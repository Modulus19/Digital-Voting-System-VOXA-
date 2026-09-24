import Poll, { IPoll, PollStatus, ResultsVisibility } from '../Models/poll.model.js';
import { Types, connection } from 'mongoose';


interface CreatePollInput {
  question: string;
  options: { text: string }[];
  resultsVisibility: ResultsVisibility;
  creator: string;
}

export const createPollService = async (
  input: CreatePollInput
): Promise<IPoll> => {
  return Poll.create(input);
};

interface GetPollsInput {
  page: number;
  limit: number;
  isAdmin: boolean;
}

interface GetPollsResult {
  polls: IPoll[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPollsService = async ({
  page,
  limit,
  isAdmin,
}: GetPollsInput): Promise<GetPollsResult> => {
  const skip = (page - 1) * limit;
  const filter: { status?: { $in: PollStatus[] } } = isAdmin
     ? {}
     : { status: { $in: ['published', 'closed'] } };

  const [polls, total] = await Promise.all([
    Poll.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Poll.countDocuments(filter),
  ]);

  return {
    polls,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

interface GetPollByIdInput {
  id: string;
  isAdmin: boolean;
}

export const getPollByIdService = async ({
  id,
  isAdmin,
}: GetPollByIdInput): Promise<IPoll | null> => {

  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }
  const poll = await Poll.findById(id);

  if (!poll) return null;

  
  if (!isAdmin && poll.status === 'draft') return null;

  return poll;
};

 interface UpdatePollInput {
   id: string;
  requesterId: string;
   updates: Partial<{
     question: string;
     options: { text: string }[];
     resultsVisibility: ResultsVisibility;
   }>;
 }

 export const updatePollService = async ({
   id,
  requesterId,
   updates,
 }: UpdatePollInput): Promise<IPoll | null> => {
   if (!Types.ObjectId.isValid(id)) {
     throw new InvalidPollIdError('Invalid poll ID format');
   }

   const poll = await Poll.findById(id);
   if (!poll) return null;

  if (!poll.creator.equals(requesterId)) {
    throw new NotPollOwnerError('Only the poll creator can edit this poll');
  }

   if (poll.status !== 'draft') {
     throw new PollNotDraftError('Only draft polls can be edited');
   }

  const allowedFields = ['question', 'options', 'resultsVisibility'] as const;
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      (poll as any)[field] = updates[field];
    }
  }
   return poll.save();
 };

interface DeletePollInput {
  id: string;
  requesterId: string;
}

export const deletePollService = async ({
  id,
  requesterId,
}: DeletePollInput): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return false;

  if (!poll.creator.equals(requesterId)) {
    throw new NotPollOwnerError('Only the poll creator can delete this poll');
  }

  // Votes collection is owned by a different module (not yet built as of
  // this writing) — queried by raw collection name rather than a Mongoose
  // model import, since no Vote model file exists in this codebase yet.
  // Assumes: collection name "votes", field "poll" referencing Poll._id.
  // CONFIRM these two assumptions with whoever owns the votes module.
  if (!connection.db) {
    throw new Error('Database connection not established');
  }
  const voteCount = await connection.db
    .collection('votes')
    .countDocuments({ poll: poll._id });

  if (voteCount > 0) {
    throw new PollHasVotesError(
      'Cannot delete a poll that already has votes. Close it instead.'
    );
  }

  await poll.deleteOne();
  return true;
};

 
interface PublishPollInput {
  id: string;
  requesterId: string;
}

export const publishPollService = async ({
  id,
  requesterId,
}: PublishPollInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!poll.creator.equals(requesterId)) {
    throw new NotPollOwnerError('Only the poll creator can publish this poll');
  }

  if (poll.status !== 'draft') {
    throw new PollAlreadyPublishedError(
      'Only draft polls can be published'
    );
  }

  poll.status = 'published';
  return poll.save();
};

interface ClosePollInput {
  id: string;
  requesterId: string;
}

export const closePollService = async ({
  id,
  requesterId,
}: ClosePollInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!poll.creator.equals(requesterId)) {
    throw new NotPollOwnerError('Only the poll creator can close this poll');
  }

  if (poll.status !== 'published') {
    throw new PollNotPublishedError(
      'Only published polls can be closed'
    );
  }

  poll.status = 'closed';
  return poll.save();
};

export class InvalidPollIdError extends Error {}
export class PollNotDraftError extends Error {}
export class NotPollOwnerError extends Error {}
export class PollHasVotesError extends Error {}
export class PollAlreadyPublishedError extends Error {}
export class PollNotPublishedError extends Error {}