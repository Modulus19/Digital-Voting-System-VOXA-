import type { Request, Response } from "express";
import {
  getVoteHistoryService,
  submitVoteService,
  VoteServiceError,
} from "../Services/voteService.js";
import { sendError, sendSuccess } from "../Utils/responses.js";

export const submitVote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pollId = req.params.pollId;

    if (typeof pollId !== "string") {
      sendError(res, "Invalid poll ID.", 400);
      return;
    }

    const { selectedOption } = req.body;

    const vote = await submitVoteService(pollId, req.user!.id, selectedOption);

    sendSuccess(res, { vote }, "Vote submitted successfully", 201);
  } catch (error) {
    if (error instanceof VoteServiceError) {
      sendError(res, error.message, error.statusCode);
      return;
    }

    console.error("Submit vote error:", error);
    sendError(res, "Failed to submit vote.", 500);
  }
};

export const getVoteHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const votes = await getVoteHistoryService(req.user!.id);

    sendSuccess(res, { votes }, "Vote history retrieved successfully");
  } catch (error) {
    if (error instanceof VoteServiceError) {
      sendError(res, error.message, error.statusCode);
      return;
    }

    console.error("Vote history error:", error);
    sendError(res, "Failed to retrieve vote history.", 500);
  }
};
