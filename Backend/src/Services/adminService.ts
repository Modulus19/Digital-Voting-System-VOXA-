import User from '../Models/user.model.js';
import Poll from '../Models/poll.model.js';
import Vote from '../Models/vote.model.js';
import { UserRole } from '../Models/user.model.js';

interface AdminStats {
  totalUsers: number;
  totalPolls: number;
  totalVotes: number;
  publishedPolls: number;
  draftPolls: number;
  closedPolls: number;
  activePolls: number;
}

export const getAdminStatsService = async (): Promise<AdminStats> => {
 
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
    Poll.countDocuments({ status: 'draft' }),
    Poll.countDocuments({ status: 'published' }),
    Poll.countDocuments({ status: 'closed' }),
  ]);

  return {
    totalUsers,
    totalPolls,
    totalVotes,
    publishedPolls,
    draftPolls,
    closedPolls,
    // 'published' is the only votable/active state in this app's poll
    // lifecycle (draft -> published -> closed) — confirmed against the
    // actual Poll model rather than assumed.
    activePolls: publishedPolls,
  };
};



const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

interface GetAdminUsersInput {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
}

interface GetAdminUsersResult {
  users: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAdminUsersService = async ({
  page,
  limit,
  search,
  role,
}: GetAdminUsersInput): Promise<GetAdminUsersResult> => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  const filter: any = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { username: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('_id username email role emailVerified createdAt')
      .skip(skip)
      .limit(safeLimit),
    User.countDocuments(filter),
  ]);

  return {
    users: users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
    })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};