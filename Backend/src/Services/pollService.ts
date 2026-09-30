import Poll, { IPoll, PollStatus, ResultsVisibility,PollCategory } from '../Models/poll.model.js';
import mongoose, { Types, PipelineStage } from 'mongoose';

interface CreatePollInput {
  question: string;
  options: { text: string }[];
  resultsVisibility: ResultsVisibility;
  category: PollCategory;
  closesAt: Date;
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
  requesterId: string;
  isAdmin: boolean;
  search?: string;
  category?: PollCategory;
  sort?: 'recent' | 'trending' | 'ending_soon';
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
  requesterId,
  isAdmin,
  search,
  category,
  sort = 'recent',
}: GetPollsInput): Promise<GetPollsResult> => {
  const skip = (page - 1) * limit;
  const visibilityFilter: any = isAdmin
    ? {}
    : {
        $or: [
          { status: { $in: ['published', 'closed'] } },
          { creator: requesterId },
        ],
      };
    const filter: any = { ...visibilityFilter };

  if (sort === 'ending_soon') {
    filter.status = 'published';
  }

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.question = { $regex: search, $options: 'i' };
  }

  if (sort === 'trending') {
    return getTrendingPolls({ filter, page, limit, skip });
  }

  const sortStage:Record<string, 1 | -1> =
    sort === 'ending_soon' ? { closesAt: 1 } : { createdAt: -1 };   

  const [polls, total] = await Promise.all([
    Poll.find(filter).sort(sortStage).skip(skip).limit(limit),
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

interface GetTrendingPollsInput {
  filter: any;
  page: number;
  limit: number;
  skip: number;
}

const getTrendingPolls = async ({
  filter,
  page,
  limit,
  skip,
}: GetTrendingPollsInput): Promise<GetPollsResult> => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const pipeline: PipelineStage[] = [
    { $match: filter },
    {
      $lookup: {
        from: 'votes',
        let: { pollId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$poll', '$$pollId'] },
              createdAt: { $gte: twentyFourHoursAgo },
            },
          },
        ],
        as: 'recentVotes',
      },
    },
    { $addFields: { voteCount: { $size: '$recentVotes' } } },
    { $match: { voteCount: { $gt: 0 } } },
    { $project: { recentVotes: 0 } },
    { $sort: { voteCount: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const [rawPolls, countResult] = await Promise.all([
    Poll.aggregate(pipeline),
    Poll.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'votes',
          let: { pollId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$poll', '$$pollId'] },
                createdAt: { $gte: twentyFourHoursAgo },
              },
            },
          ],
          as: 'recentVotes',
        },
      },
      { $addFields: { voteCount: { $size: '$recentVotes' } } },
      { $match: { voteCount: { $gt: 0 } } },
      { $count: 'total' },
    ]),
  ]);

  const total = countResult[0]?.total ?? 0;

  const polls = rawPolls.map((doc: any) => {
    const { _id, __v, recentVotes, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  });

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
  requesterId: string;
  isAdmin: boolean;
}

export const getPollByIdService = async ({
  id,
  requesterId,
  isAdmin,
}: GetPollByIdInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!isAdmin && poll.status === 'draft' && !poll.creator.equals(requesterId)) {
    return null;
  }

  return poll;
};

interface UpdatePollInput {
  id: string;
  requesterId: string;
  isAdmin: boolean;
  updates: Partial<{
    question: string;
    options: { text: string }[];
    resultsVisibility: ResultsVisibility;
    category: PollCategory;
    closesAt: Date;
  }>;
}

export const updatePollService = async ({
  id,
  requesterId,
  isAdmin,
  updates,
}: UpdatePollInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!poll.creator.equals(requesterId) && !isAdmin) {
    throw new NotPollOwnerError('Only the poll creator or a site admin can edit this poll');
  }

  if (poll.status !== 'draft') {
    throw new PollNotDraftError('Only draft polls can be edited');
  }

  const allowedFields = ['question', 'options', 'resultsVisibility', 'category', 'closesAt'] as const;
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
  isAdmin: boolean;
}

export const deletePollService = async ({
  id,
  requesterId,
  isAdmin,
}: DeletePollInput): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return false;

  if (!poll.creator.equals(requesterId) && !isAdmin) {
    throw new NotPollOwnerError('Only the poll creator or a site admin can delete this poll');
  }

  if (!isAdmin) {
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const voteCount = await mongoose.connection.db
      .collection('votes')
      .countDocuments({ poll: poll._id });

    if (voteCount > 0) {
      throw new PollHasVotesError(
        'Cannot delete a poll that already has votes. Close it instead.'
      );
    }
  }

  await poll.deleteOne();
  return true;
};

interface PublishPollInput {
  id: string;
  requesterId: string;
  isAdmin: boolean;
}

export const publishPollService = async ({
  id,
  requesterId,
  isAdmin,
}: PublishPollInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!poll.creator.equals(requesterId) && !isAdmin) {
    throw new NotPollOwnerError('Only the poll creator or a site admin can publish this poll');
  }

  if (poll.status !== 'draft') {
    throw new PollAlreadyPublishedError('Only draft polls can be published');
  }

  poll.status = 'published';
  return poll.save();
};

interface ClosePollInput {
  id: string;
  requesterId: string;
  isAdmin: boolean;
}

export const closePollService = async ({
  id,
  requesterId,
  isAdmin,
}: ClosePollInput): Promise<IPoll | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidPollIdError('Invalid poll ID format');
  }

  const poll = await Poll.findById(id);
  if (!poll) return null;

  if (!poll.creator.equals(requesterId) && !isAdmin) {
    throw new NotPollOwnerError('Only the poll creator or a site admin can close this poll');
  }

  if (poll.status !== 'published') {
    throw new PollNotPublishedError('Only published polls can be closed');
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