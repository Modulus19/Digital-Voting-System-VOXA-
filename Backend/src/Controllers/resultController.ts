import type { Request, Response } from "express";
import {
  getPollResultsService,
  ResultServiceError,
} from "../Services/resultService.js";
import { sendError, sendSuccess } from "../Utils/responses.js";

export const getPollResults = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pollId = req.params.pollId;

    if (typeof pollId !== "string") {
      sendError(res, "Invalid poll ID.", 400);
      return;
    }

    const results = await getPollResultsService(
      pollId,
      req.user!.id,
      req.user!.role === "admin",
    );

    sendSuccess(res, results, "Poll results retrieved successfully");
  } catch (error) {
    if (error instanceof ResultServiceError) {
      sendError(res, error.message, error.statusCode);
      return;
    }

    console.error("Get poll results error:", error);
    sendError(res, "Failed to retrieve poll results.", 500);
  }
};
