import { Router } from 'express';
import { authenticate } from '../Middleware/auth.js';
import { authorize } from '../Middleware/authorize.js';
import { validateCreatePoll, validateUpdatePoll } from '../Validators/pollValidator.js';
import { createPoll, getPolls, getPollById, updatePoll, deletePoll, publishPoll, closePoll } from '../Controllers/pollController.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), validateCreatePoll, createPoll);
router.get('/', authenticate, getPolls);
router.get('/:id', authenticate, getPollById);
router.patch('/:id', authenticate, authorize('admin'), validateUpdatePoll, updatePoll);
router.delete('/:id', authenticate, authorize('admin'), deletePoll);
router.patch('/:id/publish', authenticate, authorize('admin'), publishPoll);
router.patch('/:id/close', authenticate, authorize('admin'), closePoll);

export default router;