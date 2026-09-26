import mongoose from "mongoose";
import Vote from "../src/Models/vote.model.js";
import Poll from "../src/Models/poll.model.js";
import {
  submitVoteService,
  getVoteHistoryService,
} from "../src/Services/voteService.js";

describe("Vote Service", () => {
  const voterId = new mongoose.Types.ObjectId().toString();
  const pollId = new mongoose.Types.ObjectId().toString();
  const optionId = new mongoose.Types.ObjectId().toString();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should reject voting when the poll does not exist", async () => {
    jest.spyOn(Poll, "findById").mockResolvedValue(null);

    await expect(submitVoteService(pollId, voterId, optionId)).rejects.toThrow(
      "Poll not found.",
    );
  });

  it("should reject voting on a poll that is not published", async () => {
    jest.spyOn(Poll, "findById").mockResolvedValue({
      _id: pollId,
      status: "draft",
      options: [{ _id: optionId, text: "Option A" }],
    } as any);

    await expect(submitVoteService(pollId, voterId, optionId)).rejects.toThrow(
      "Voting is only allowed on published polls.",
    );
  });

  it("should reject an option that does not belong to the poll", async () => {
    const differentOptionId = new mongoose.Types.ObjectId().toString();

    jest.spyOn(Poll, "findById").mockResolvedValue({
      _id: pollId,
      status: "published",
      options: [{ _id: optionId, text: "Option A" }],
    } as any);

    await expect(
      submitVoteService(pollId, voterId, differentOptionId),
    ).rejects.toThrow("Selected option does not belong to this poll.");
  });

  it("should reject a user who has already voted", async () => {
    jest.spyOn(Poll, "findById").mockResolvedValue({
      _id: pollId,
      status: "published",
      options: [{ _id: optionId, text: "Option A" }],
    } as any);

    jest.spyOn(Vote, "findOne").mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      voter: voterId,
      poll: pollId,
      selectedOption: optionId,
    } as any);

    await expect(submitVoteService(pollId, voterId, optionId)).rejects.toThrow(
      "You have already voted on this poll.",
    );
  });

  it("should retrieve a user's vote history", async () => {
    const votes = [
      {
        voter: voterId,
        poll: pollId,
        selectedOption: optionId,
      },
    ];

    const sortMock = jest.fn().mockResolvedValue(votes);

    jest.spyOn(Vote, "find").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: sortMock,
      }),
    } as any);

    const result = await getVoteHistoryService(voterId);

    expect(result).toEqual(votes);
    expect(Vote.find).toHaveBeenCalledWith({
      voter: voterId,
    });
  });
});
