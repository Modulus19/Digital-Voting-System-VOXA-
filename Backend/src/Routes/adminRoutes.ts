import { Router } from 'express';
import { authenticate } from '../Middleware/auth.js';
import { authorize } from '../Middleware/authorize.js';
import { getAdminStats, getAdminUsers } from '../Controllers/adminController.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getAdminStats);
router.get('/users', authenticate, authorize('admin'), getAdminUsers);

export default router;