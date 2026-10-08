import type {
  Request,
  Response,
} from "express";

import {
  deleteUserService,
  getAdminStatsService,
  getAdminUsersService,
  updateUserRoleService,
  updateUserStatusService,
} from "../Services/adminService.js";

import type {
  UserRole,
} from "../Models/user.model.js";

const getUserIdParam = (
  req: Request
): string | null => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return null;
  }

  return id;
};

export const getAdminStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats =
      await getAdminStatsService();

    res.status(200).json({
      success: true,
      message:
        "Admin stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve admin stats",
      data: null,
    });
  }
};

export const getAdminUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(
      1,
      parseInt(
        req.query.page as string,
        10
      ) || 1
    );

    const limit = Math.max(
      1,
      parseInt(
        req.query.limit as string,
        10
      ) || 10
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const role =
      typeof req.query.role === "string"
        ? req.query.role
        : undefined;

    const VALID_ROLES = [
      "user",
      "admin",
    ];

    if (
      role &&
      !VALID_ROLES.includes(role)
    ) {
      res.status(400).json({
        success: false,
        message:
          "role must be one of: user, admin.",
        data: null,
      });
      return;
    }

    const result =
      await getAdminUsersService({
        page,
        limit,
        search,
        role:
          role as
            | UserRole
            | undefined,
      });

    res.status(200).json({
      success: true,
      message:
        "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve users",
      data: null,
    });
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message:
        "Authentication required",
      data: null,
    });
    return;
  }

  const id = getUserIdParam(req);

  if (!id) {
    res.status(400).json({
      success: false,
      message:
        "Invalid user id",
      data: null,
    });
    return;
  }

  const { isActive } = req.body;

  if (
    typeof isActive !== "boolean"
  ) {
    res.status(400).json({
      success: false,
      message:
        "isActive must be a boolean.",
      data: null,
    });
    return;
  }

  try {
    const user =
      await updateUserStatusService(
        id,
        req.user.id,
        isActive
      );

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update user status";

    if (message === "User not found") {
      res.status(404).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message === "Invalid user id"
    ) {
      res.status(400).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message ===
      "Administrators cannot modify their own account"
    ) {
      res.status(403).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to update user status",
      data: null,
    });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message:
        "Authentication required",
      data: null,
    });
    return;
  }

  const id = getUserIdParam(req);

  if (!id) {
    res.status(400).json({
      success: false,
      message:
        "Invalid user id",
      data: null,
    });
    return;
  }

  const { role } = req.body;

  if (
    role !== "user" &&
    role !== "admin"
  ) {
    res.status(400).json({
      success: false,
      message:
        "role must be either user or admin.",
      data: null,
    });
    return;
  }

  try {
    const user =
      await updateUserRoleService(
        id,
        req.user.id,
        role
      );

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update user role";

    if (message === "User not found") {
      res.status(404).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message === "Invalid user id"
    ) {
      res.status(400).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message ===
      "Administrators cannot modify their own account"
    ) {
      res.status(403).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to update user role",
      data: null,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message:
        "Authentication required",
      data: null,
    });
    return;
  }

  const id = getUserIdParam(req);

  if (!id) {
    res.status(400).json({
      success: false,
      message:
        "Invalid user id",
      data: null,
    });
    return;
  }

  try {
    await deleteUserService(
      id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete user";

    if (message === "User not found") {
      res.status(404).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message === "Invalid user id"
    ) {
      res.status(400).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    if (
      message ===
      "Administrators cannot modify their own account"
    ) {
      res.status(403).json({
        success: false,
        message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to delete user",
      data: null,
    });
  }
};