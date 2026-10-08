import User, {
  type IUser,
  type UserRole,
} from "../Models/user.model.js";
import Poll from "../Models/poll.model.js";
import Vote from "../Models/vote.model.js";

interface AdminStats {
  totalUsers: number;
  totalPolls: number;
  totalVotes: number;
  publishedPolls: number;
  draftPolls: number;
  closedPolls: number;
  activePolls: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface GetAdminUsersInput {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
}

export interface GetAdminUsersResult {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const toAdminUser = (user: IUser): AdminUser => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const ensureValidUserId = (
  userId: string
): void => {
  if (!/^[a-fA-F0-9]{24}$/.test(userId)) {
    throw new Error("Invalid user id");
  }
};

const ensureNotSelf = (
  targetUserId: string,
  adminUserId: string
): void => {
  if (targetUserId === adminUserId) {
    throw new Error(
      "Administrators cannot modify their own account"
    );
  }
};

export const getAdminStatsService =
  async (): Promise<AdminStats> => {
    const [
      totalUsers,
      totalPolls,
      totalVotes,
      draftPolls,
      publishedPolls,
      closedPolls,
    ] = await Promise.all([
      User.countDocuments(),
      Poll.countDocuments(),
      Vote.countDocuments(),
      Poll.countDocuments({
        status: "draft",
      }),
      Poll.countDocuments({
        status: "published",
      }),
      Poll.countDocuments({
        status: "closed",
      }),
    ]);

    return {
      totalUsers,
      totalPolls,
      totalVotes,
      publishedPolls,
      draftPolls,
      closedPolls,

      // VOXA's current poll lifecycle is:
      // draft -> published -> closed.
      // Therefore, published polls are the active polls.
      activePolls: publishedPolls,
    };
  };

export const getAdminUsersService = async ({
  page,
  limit,
  search,
  role,
}: GetAdminUsersInput): Promise<GetAdminUsersResult> => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(
    100,
    Math.max(1, limit)
  );

  const skip =
    (safePage - 1) * safeLimit;

  const filter: Record<
    string,
    unknown
  > = {};

  if (role) {
    filter.role = role;
  }

  if (search?.trim()) {
    const safeSearch =
      escapeRegex(search.trim());

    filter.$or = [
      {
        username: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        email: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] =
    await Promise.all([
      User.find(filter)
        .select(
          "_id username email role emailVerified isActive createdAt"
        )
        .skip(skip)
        .limit(safeLimit),

      User.countDocuments(filter),
    ]);

  return {
    users: users.map(toAdminUser),

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(
        total / safeLimit
      ),
    },
  };
};

export const updateUserStatusService =
  async (
    targetUserId: string,
    adminUserId: string,
    isActive: boolean
  ): Promise<AdminUser> => {
    ensureValidUserId(targetUserId);
    ensureNotSelf(
      targetUserId,
      adminUserId
    );

    const user =
      await User.findByIdAndUpdate(
        targetUserId,
        {
          $set: {
            isActive,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return toAdminUser(user);
  };

export const updateUserRoleService =
  async (
    targetUserId: string,
    adminUserId: string,
    role: UserRole
  ): Promise<AdminUser> => {
    ensureValidUserId(targetUserId);
    ensureNotSelf(
      targetUserId,
      adminUserId
    );

    if (
      role !== "user" &&
      role !== "admin"
    ) {
      throw new Error(
        "role must be either user or admin"
      );
    }

    const user =
      await User.findByIdAndUpdate(
        targetUserId,
        {
          $set: {
            role,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return toAdminUser(user);
  };

export const deleteUserService =
  async (
    targetUserId: string,
    adminUserId: string
  ): Promise<void> => {
    ensureValidUserId(targetUserId);
    ensureNotSelf(
      targetUserId,
      adminUserId
    );

    const deletedUser =
      await User.findByIdAndDelete(
        targetUserId
      );

    if (!deletedUser) {
      throw new Error(
        "User not found"
      );
    }
  };