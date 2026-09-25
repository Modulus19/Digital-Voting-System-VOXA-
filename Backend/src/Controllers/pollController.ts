import { Response, Request } from 'express';
import { sendSuccess, sendError } from '../Utils/responses.js';
import {
  createPollService,
  getPollsService,
  getPollByIdService,
  updatePollService,
  deletePollService,
  publishPollService,
  closePollService,
  InvalidPollIdError,
  PollNotDraftError,
  NotPollOwnerError,
  PollHasVotesError,
  PollAlreadyPublishedError,
  PollNotPublishedError,
} from '../Services/pollService.js';

export const createPoll = async (req: Request, res: Response) => {
  try {
    const { question, options, resultsVisibility } = req.body;

    const poll = await createPollService({
      question,
      options,
      resultsVisibility,
      creator: req.user!.id,
    });

    return sendSuccess(res, poll, 'Poll created successfully', 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const getPolls = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const isAdmin = req.user?.role === 'admin';

    const result = await getPollsService({
      page,
      limit,
      requesterId: req.user!.id,
      isAdmin,
    });

    return sendSuccess(res, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const getPollById = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const poll = await getPollByIdService({
      id: req.params.id as string,
      requesterId: req.user!.id,
      isAdmin,
    });

    if (!poll) {
      return sendError(res, 'Poll not found', 404);
    }

    return sendSuccess(res, poll);
  } catch (error) {
    if (error instanceof InvalidPollIdError) {
      return sendError(res, error.message, 400);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const updatePoll = async (req: Request, res: Response) => {
  try {
    const poll = await updatePollService({
      id: req.params.id as string,
      requesterId: req.user!.id,
      isAdmin: req.user?.role === 'admin',
      updates: req.body,
    });

    if (!poll) {
      return sendError(res, 'Poll not found', 404);
    }

    return sendSuccess(res, poll, 'Poll updated successfully');
  } catch (error) {
    if (error instanceof InvalidPollIdError) {
      return sendError(res, error.message, 400);
    }
    if (error instanceof NotPollOwnerError) {
      return sendError(res, error.message, 403);
    }
    if (error instanceof PollNotDraftError) {
      return sendError(res, error.message, 400);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const deletePoll = async (req: Request, res: Response) => {
  try {
    const deleted = await deletePollService({
      id: req.params.id as string,
      requesterId: req.user!.id,
      isAdmin: req.user?.role === 'admin',
    });

    if (!deleted) {
      return sendError(res, 'Poll not found', 404);
    }

    return sendSuccess(res, null, 'Poll deleted successfully');
  } catch (error) {
    if (error instanceof InvalidPollIdError) {
      return sendError(res, error.message, 400);
    }
    if (error instanceof NotPollOwnerError) {
      return sendError(res, error.message, 403);
    }
    if (error instanceof PollHasVotesError) {
      return sendError(res, error.message, 409);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const publishPoll = async (req: Request, res: Response) => {
  try {
    const poll = await publishPollService({
      id: req.params.id as string,
      requesterId: req.user!.id,
      isAdmin: req.user?.role === 'admin',
    });

    if (!poll) {
      return sendError(res, 'Poll not found', 404);
    }

    return sendSuccess(res, poll, 'Poll published successfully');
  } catch (error) {
    if (error instanceof InvalidPollIdError) {
      return sendError(res, error.message, 400);
    }
    if (error instanceof NotPollOwnerError) {
      return sendError(res, error.message, 403);
    }
    if (error instanceof PollAlreadyPublishedError) {
      return sendError(res, error.message, 400);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};

export const closePoll = async (req: Request, res: Response) => {
  try {
    const poll = await closePollService({
      id: req.params.id as string,
      requesterId: req.user!.id,
      isAdmin: req.user?.role === 'admin',
    });

    if (!poll) {
      return sendError(res, 'Poll not found', 404);
    }

    return sendSuccess(res, poll, 'Poll closed successfully');
  } catch (error) {
    if (error instanceof InvalidPollIdError) {
      return sendError(res, error.message, 400);
    }
    if (error instanceof NotPollOwnerError) {
      return sendError(res, error.message, 403);
    }
    if (error instanceof PollNotPublishedError) {
      return sendError(res, error.message, 400);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendError(res, message, 500);
  }
};