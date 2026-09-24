import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responses.js';

const VALID_RESULTS_VISIBILITY = ['after_vote', 'after_close', 'admin_only'];

export const validateCreatePoll = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { question, options, resultsVisibility } = req.body;
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
  const { question, options, resultsVisibility } = req.body;
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

  if (errors.length > 0) {
    return sendError(res, errors.join(' '), 400);
  }

  next();
};