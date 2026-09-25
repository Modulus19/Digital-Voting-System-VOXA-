import { Router } from 'express';
import { authenticate } from '../Middleware/auth.js';
import { validateCreatePoll, validateUpdatePoll } from '../Validators/pollValidator.js';
import {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  publishPoll,
  closePoll,
} from '../Controllers/pollController.js';

const router = Router();

router.post('/', authenticate, validateCreatePoll, createPoll);
router.get('/', authenticate, getPolls);
router.get('/:id', authenticate, getPollById);
router.patch('/:id', authenticate, validateUpdatePoll, updatePoll);
router.delete('/:id', authenticate, deletePoll);
router.patch('/:id/publish', authenticate, publishPoll);
router.patch('/:id/close', authenticate, closePoll);

export default router