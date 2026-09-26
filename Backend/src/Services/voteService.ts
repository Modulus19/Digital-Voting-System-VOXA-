import mongoose from "mongoose";
import Vote from "../Models/vote.model.js";
import Poll from "../Models/poll.model.js";

export class VoteServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "VoteServiceError";
    this.statusCode = statusCode;
  }
}

export const submitVoteService = async (
  pollId: string,
  voterId: string,
  selectedOption: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    throw new VoteServiceError("Invalid poll ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(voterId)) {
    throw new VoteServiceError("Invalid voter ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(selectedOption)) {
    throw new VoteServiceError("Invalid selected option ID.", 400);
  }

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new VoteServiceError("Poll not found.", 404);
  }

  if (poll.status !== "published") {
    throw new VoteServiceError(
      "Voting is only allowed on published polls.",
      400,
    );
  }

  const optionExists = poll.options.some(
    (option) => option._id.toString() === selectedOption,
  );

  if (!optionExists) {
    throw new VoteServiceError(
      "Selected option does not belong to this poll.",
      400,
    );
  }

  const existingVote = await Vote.findOne({
    voter: voterId,
    poll: pollId,
  });

  if (existingVote) {
    throw new VoteServiceError("You have already voted on this poll.", 409);
  }

  try {
    const vote = await Vote.create({
      voter: voterId,
      poll: pollId,
      selectedOption,
    });

    return vote;
  } catch (error: any) {
    // Protect against the unique database index catching a race condition.
    if (error?.code === 11000) {
      throw new VoteServiceError("You have already voted on this poll.", 409);
    }

    throw error;
  }
};

export const getVoteHistoryService = async (voterId: string) => {
  if (!mongoose.Types.ObjectId.isValid(voterId)) {
    throw new VoteServiceError("Invalid voter ID.", 400);
  }

  const votes = await Vote.find({ voter: voterId })
    .populate({
      path: "poll",
      select: "question options status resultsVisibility creator",
    })
    .sort({ createdAt: -1 });

  return votes;
};
