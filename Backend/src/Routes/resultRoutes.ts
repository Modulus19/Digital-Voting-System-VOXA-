import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import { getPollResults } from "../Controllers/resultController.js";

const router = Router();

router.get("/polls/:pollId/results", authenticate, getPollResults);

export default router;
