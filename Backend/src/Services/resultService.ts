import mongoose from "mongoose";
import Poll from "../Models/poll.model.js";
import Vote from "../Models/vote.model.js";

export class ResultServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ResultServiceError";
    this.statusCode = statusCode;
  }
}

export const getPollResultsService = async (
  pollId: string,
  requesterId: string,
  isAdmin: boolean,
) => {
  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    throw new ResultServiceError("Invalid poll ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(requesterId)) {
    throw new ResultServiceError("Invalid requester ID.", 400);
  }

  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new ResultServiceError("Poll not found.", 404);
  }

  // Admins can always see results.
  if (!isAdmin) {
    if (poll.resultsVisibility === "admin_only") {
      throw new ResultServiceError(
        "Only administrators can view the results of this poll.",
        403,
      );
    }

    if (poll.resultsVisibility === "after_close") {
      if (poll.status !== "closed") {
        throw new ResultServiceError(
          "Results will be available after the poll is closed.",
          403,
        );
      }
    }

    if (poll.resultsVisibility === "after_vote") {
      const userVote = await Vote.findOne({
        voter: requesterId,
        poll: pollId,
      });

      if (!userVote) {
        throw new ResultServiceError(
          "You must vote on this poll before viewing its results.",
          403,
        );
      }
    }
  }

  const voteCounts = await Vote.aggregate([
    {
      $match: {
        poll: new mongoose.Types.ObjectId(pollId),
      },
    },
    {
      $group: {
        _id: "$selectedOption",
        votes: { $sum: 1 },
      },
    },
  ]);

  const totalVotes = voteCounts.reduce((total, item) => total + item.votes, 0);

  const results = poll.options.map((option) => {
    const optionVotes =
      voteCounts.find((item) => item._id.toString() === option._id.toString())
        ?.votes ?? 0;

    const percentage =
      totalVotes === 0
        ? 0
        : Number(((optionVotes / totalVotes) * 100).toFixed(2));

    return {
      optionId: option._id.toString(),
      option: option.text,
      votes: optionVotes,
      percentage,
    };
  });

  return {
    poll: {
      id: poll._id.toString(),
      question: poll.question,
      status: poll.status,
      resultsVisibility: poll.resultsVisibility,
    },
    totalVotes,
    results,
  };
};
