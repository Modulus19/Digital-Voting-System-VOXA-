import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { sendError } from '../utils/responses.js';

// Restricts a route to specific roles. Must run after `authenticate`,
// since it depends on req.user already being set.
export const authorize = (...allowedRoles: Array<'admin' | 'voter'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Not authorized to perform this action', 403);
    }

    next();
  };
};