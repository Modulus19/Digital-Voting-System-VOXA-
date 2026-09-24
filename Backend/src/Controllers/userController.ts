import type { Request, Response } from "express";
import User from "../Models/user.model.js";

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
      data: null,
    });
    return;
  }

  try {
    const user = await User.findById(req.user.id).select(
      "_id email role emailVerified createdAt updatedAt"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve user",
      data: null,
    });
  }
};