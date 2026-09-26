import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { sendError } from "../Utils/responses.js";

export const validateVote = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { selectedOption } = req.body;
  const pollId = req.params.pollId;

  const errors: string[] = [];

  if (typeof pollId !== "string" || !mongoose.Types.ObjectId.isValid(pollId)) {
    errors.push("A valid poll ID is required.");
  }

  if (
    !selectedOption ||
    typeof selectedOption !== "string" ||
    !mongoose.Types.ObjectId.isValid(selectedOption)
  ) {
    errors.push("A valid selected option ID is required.");
  }

  if (errors.length > 0) {
    sendError(res, errors.join(" "), 400);
    return;
  }

  next();
};
