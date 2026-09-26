import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import { validateVote } from "../Validators/voteValidator.js";
import { getVoteHistory, submitVote } from "../Controllers/voteController.js";

const router = Router();

router.post("/polls/:pollId/vote", authenticate, validateVote, submitVote);

router.get("/votes/history", authenticate, getVoteHistory);

export default router;
