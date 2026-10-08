
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import paths from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";
import { getUserStats } from "../../services/authApi"; 

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ pollsVoted: 0, majoritySidePercentage: null });
  const [loadingStats, setLoadingStats] = useState(true);

  // ALL HOOKS ARE CALLED FIRST 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserStats();
        const statsData = response?.data || response;
        setStats({
          pollsVoted: statsData?.pollsVoted ?? 0,
          majoritySidePercentage: statsData?.majoritySidePercentage ?? null,
        });
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Safe early return for loading state
  if (authLoading || !user) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  
  const getInitials = (name) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format 
 const rawDate = user?.createdAt || user?.created_at || user?.joinedAt || user?.dateJoined;
 const memberSince = rawDate 
    ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : "September 2026";
 const username = user?.username || (user?.email ? user.email.split('@')[0] : "User");

  return (
    <div className="h-[calc(100vh-64px)] py-4 px-2 sm:px-4 -mx-4 sm:-mx-6">
      <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 relative flex flex-col items-center justify-center">
        
        <Link to={paths.user.home || "/"} className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Content */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-violet-500 flex items-center justify-center mb-5">
            <span className="text-white text-3xl font-semibold tracking-wide">
    {getInitials(username)}
  </span>
          </div>

          {/* Name */}
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {username}
          </h1>

          {/* Email */}
          <p className="text-sm text-gray-500 mb-0.5">
            {user?.email || ""}
          </p>

          {/* Member since */}
          <p className="text-xs text-gray-400 mb-8">
            Member since {memberSince}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-16 border-t border-b border-gray-100 py-5 mb-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {loadingStats ? "..." : stats.pollsVoted}
              </p>
              <p className="text-xs text-gray-500 mt-1">Polls voted</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {loadingStats ? "..." : (stats.majoritySidePercentage !== null ? `${stats.majoritySidePercentage}%` : "—")}
              </p>
              <p className="text-xs text-gray-500 mt-1">Majority side</p>
            </div>
          </div>

          <Link

            to="/login"
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Log out
          </Link>
          
        </div>
      </div>
    </div>
  );
}