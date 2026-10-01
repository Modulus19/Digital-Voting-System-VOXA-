import { Request, Response, NextFunction } from 'express';
import { sendError } from '../Utils/responses.js';
import { VALID_CATEGORIES } from '../Models/poll.model.js';

const VALID_RESULTS_VISIBILITY = ['after_vote', 'after_close', 'admin_only'];

export const validateCreatePoll = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { question, options, resultsVisibility, category, closesAt } = req.body;
  const errors: string[] = [];

  if (typeof question !== 'string' || question.trim().length === 0) {
    errors.push('Question is required and must be a non-empty string.');
  }

  if (!Array.isArray(options) || options.length < 2) {
    errors.push('At least 2 options are required.');
  } else {
    const hasInvalidOption = options.some(
      (opt) => typeof opt?.text !== 'string' || opt.text.trim().length === 0
    );
    if (hasInvalidOption) {
      errors.push('Every option must have non-empty text.');
    }
  }

  if (
    typeof resultsVisibility !== 'string' ||
    !VALID_RESULTS_VISIBILITY.includes(resultsVisibility)
  ) {
    errors.push(
      `resultsVisibility must be one of: ${VALID_RESULTS_VISIBILITY.join(', ')}.`
    );
  }

 if (typeof category !== 'string' || !(VALID_CATEGORIES as readonly string[]).includes(category)) {
   errors.push(
     `category must be one of: ${VALID_CATEGORIES.join(', ')}.`
    );
  }

  if (typeof closesAt !== 'string' || isNaN(Date.parse(closesAt))) {
    errors.push('closesAt must be a valid date.');
  } else if (new Date(closesAt).getTime() <= Date.now()) {
    errors.push('closesAt must be a date in the future.');
  }

  if (errors.length > 0) {
    return sendError(res, errors.join(' '), 400);
  }

  next();
};



export const validateUpdatePoll = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { question, options, resultsVisibility, category, closesAt } = req.body;
  const errors: string[] = [];

  if (question !== undefined) {
    if (typeof question !== 'string' || question.trim().length === 0) {
      errors.push('Question must be a non-empty string.');
    }
  }

  if (options !== undefined) {
    if (!Array.isArray(options) || options.length < 2) {
      errors.push('At least 2 options are required.');
    } else {
      const hasInvalidOption = options.some(
        (opt) => typeof opt?.text !== 'string' || opt.text.trim().length === 0
      );
      if (hasInvalidOption) {
        errors.push('Every option must have non-empty text.');
      }
    }
  }

  if (resultsVisibility !== undefined) {
    if (
      typeof resultsVisibility !== 'string' ||
      !VALID_RESULTS_VISIBILITY.includes(resultsVisibility)
    ) {
      errors.push(
        `resultsVisibility must be one of: ${VALID_RESULTS_VISIBILITY.join(', ')}.`
      );
    }
  }

  if (category !== undefined) {
   if (typeof category !== 'string' || !(VALID_CATEGORIES as readonly string[]).includes(category)) {
      errors.push(
        `category must be one of: ${VALID_CATEGORIES.join(', ')}.`
      );
    }
  }

  if (closesAt !== undefined) {
    if (typeof closesAt !== 'string' || isNaN(Date.parse(closesAt))) {
      errors.push('closesAt must be a valid date.');
    } else if (new Date(closesAt).getTime() <= Date.now()) {
      errors.push('closesAt must be a date in the future.');
    }
  }

  if (errors.length > 0) {
    return sendError(res, errors.join(' '), 400);
  }

  next();
};