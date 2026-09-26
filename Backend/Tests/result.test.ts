import mongoose from "mongoose";
import Poll from "../src/Models/poll.model.js";
import Vote from "../src/Models/vote.model.js";
import { getPollResultsService } from "../src/Services/resultService.js";

describe("Result Service", () => {
  const pollId = new mongoose.Types.ObjectId().toString();
  const requesterId = new mongoose.Types.ObjectId().toString();

  const optionOneId = new mongoose.Types.ObjectId();
  const optionTwoId = new mongoose.Types.ObjectId();

  const createPollMock = (visibility: string, status = "published") => ({
    _id: pollId,
    question: "Test poll",
    status,
    resultsVisibility: visibility,
    options: [
      {
        _id: optionOneId,
        text: "Option A",
      },
      {
        _id: optionTwoId,
        text: "Option B",
      },
    ],
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should allow an admin to view admin-only results", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("admin_only") as any);

    jest.spyOn(Vote, "aggregate").mockResolvedValue([]);

    const result = await getPollResultsService(pollId, requesterId, true);

    expect(result.totalVotes).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  it("should reject a normal user from admin-only results", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("admin_only") as any);

    await expect(
      getPollResultsService(pollId, requesterId, false),
    ).rejects.toThrow("Only administrators can view the results of this poll.");
  });

  it("should reject results before an after-close poll is closed", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("after_close", "published") as any);

    await expect(
      getPollResultsService(pollId, requesterId, false),
    ).rejects.toThrow("Results will be available after the poll is closed.");
  });

  it("should allow results after an after-close poll is closed", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("after_close", "closed") as any);

    jest.spyOn(Vote, "aggregate").mockResolvedValue([]);

    const result = await getPollResultsService(pollId, requesterId, false);

    expect(result.totalVotes).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  it("should reject after-vote results when the user has not voted", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("after_vote") as any);

    jest.spyOn(Vote, "findOne").mockResolvedValue(null);

    await expect(
      getPollResultsService(pollId, requesterId, false),
    ).rejects.toThrow("You must vote on this poll before viewing its results.");
  });

  it("should calculate vote counts and percentages", async () => {
    jest
      .spyOn(Poll, "findById")
      .mockResolvedValue(createPollMock("after_vote") as any);

    jest.spyOn(Vote, "findOne").mockResolvedValue({
      voter: requesterId,
      poll: pollId,
    } as any);

    jest.spyOn(Vote, "aggregate").mockResolvedValue([
      {
        _id: optionOneId,
        votes: 3,
      },
      {
        _id: optionTwoId,
        votes: 1,
      },
    ]);

    const result = await getPollResultsService(pollId, requesterId, false);

    expect(result.totalVotes).toBe(4);

    expect(result.results[0]).toMatchObject({
      option: "Option A",
      votes: 3,
      percentage: 75,
    });

    expect(result.results[1]).toMatchObject({
      option: "Option B",
      votes: 1,
      percentage: 25,
    });
  });
});

