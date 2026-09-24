import { Router } from "express";
import { getMe } from "../Controllers/userController.js";
import { authenticate } from "../Middleware/auth.js";

const router = Router();

router.get("/me", authenticate, getMe);

export default router;