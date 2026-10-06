import { Router } from "express";
import { getMe, getMyStats } from "../Controllers/userController.js";
import { authenticate } from "../Middleware/auth.js";

const router = Router();

router.get("/me", authenticate, getMe);
router.get("/me/stats", authenticate, getMyStats);

export default router;