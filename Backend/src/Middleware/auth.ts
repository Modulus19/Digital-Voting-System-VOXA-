import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { sendError } from '../utils/responses.js';


const STUB_USER_ID = new Types.ObjectId('64f000000000000000000001');
export interface AuthenticatedRequest extends Request {
  user?: {
    id: Types.ObjectId;
    email: string;
    role: 'admin' | 'voter';
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  if (!req.user) {
    req.user = {
      id: STUB_USER_ID,
      email: 'stub@example.com',
      role: 'admin',
    };
  }

  next();
};