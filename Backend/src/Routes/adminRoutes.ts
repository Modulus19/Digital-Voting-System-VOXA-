import { Router } from "express";

import {
  authenticate,
} from "../Middleware/auth.js";

import {
  authorize,
} from "../Middleware/authorize.js";

import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "../Controllers/adminController.js";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize("admin"),
  getAdminStats
);

router.get(
  "/users",
  authenticate,
  authorize("admin"),
  getAdminUsers
);

router.patch(
  "/users/:id/status",
  authenticate,
  authorize("admin"),
  updateUserStatus
);

router.patch(
  "/users/:id/role",
  authenticate,
  authorize("admin"),
  updateUserRole
);

router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  deleteUser
);

export default router;