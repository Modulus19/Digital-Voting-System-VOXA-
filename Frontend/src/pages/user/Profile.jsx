import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import paths from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";
import { getVoteHistory } from "../../services/authApi";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  // const { user } = useAuth();
  const [pollsVotedCount, setPollsVotedCount] = useState(0);
  const [loadingVotes, setLoadingVotes] = useState(true);

  // Fetch vote history to get the accurate count of polls voted
  useEffect(() => {
    const fetchVoteHistory = async () => {
      try {
        const response = await getVoteHistory();
        // Assuming the response data contains the list of votes
        const votes = response.data || response || [];
        setPollsVotedCount(Array.isArray(votes) ? votes.length : 0);
      } catch (error) {
        console.error("Failed to fetch vote history", error);
      } finally {
        setLoadingVotes(false);
      }
    };

    fetchVoteHistory();
  }, [])

  // Generate initials for the avatar
  const getInitials = (name) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format creation date if available, or fallback
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : "N/A";

    // Incase user is still loading
  if (authLoading || !user) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

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
            <span className="text-white text-3xl font-semibold tracking-wide">{getInitials(user?.username)}</span>
          </div>

          {/* Name */}
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {user?.username || "Loading..."}
          </h1>

          {/* Email */}
          <p className="text-sm text-gray-500 mb-0.5">
            {user?.email || "loading@example.com"}
          </p>

          {/* Member since */}
          <p className="text-xs text-gray-400 mb-8">
            Member since {memberSince}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-12 border-t border-b border-gray-100 py-5 mb-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {loadingVotes ? "..." : pollsVotedCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Polls voted</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">4</p>
              <p className="text-xs text-gray-500 mt-1">Trending Joined</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">61%</p>
              <p className="text-xs text-gray-500 mt-1">Majority side</p>
            </div>
          </div>

          {/* Edit Profile */}
          {/* <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
            Edit Profile
          </button> */}

          <Link
            to={paths.user.editProfile}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Edit Profile
          </Link>
          
        </div>
      </div>
    </div>
  );
}