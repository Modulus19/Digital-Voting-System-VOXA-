import type { Request, Response } from 'express';
import { getAdminStatsService, getAdminUsersService } from '../Services/adminService.js';
import type { UserRole } from '../Models/user.model.js';

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getAdminStatsService();

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve admin stats',
      data: null,
    });
  }
};

export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const VALID_ROLES = ['user', 'admin'];
    if (role && !VALID_ROLES.includes(role)) {
      res.status(400).json({
        success: false,
        message: `role must be one of: ${VALID_ROLES.join(', ')}.`,
        data: null,
      });
      return;
    }


    const result = await getAdminUsersService({
      page,
      limit,
      search,
      role: role as UserRole | undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve users',
      data: null,
    });
  }
};