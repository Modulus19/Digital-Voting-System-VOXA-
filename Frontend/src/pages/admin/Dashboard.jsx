import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalPolls: 0,
    totalVotes: 0,
    publishedPolls: 0,
    draftPolls: 0,
    closedPolls: 0,
    activePolls: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsUnavailable, setStatsUnavailable] = useState(false);
  const [activity, setActivity] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      setStatsUnavailable(false);

      const [statsRes, pollsRes, activityRes] = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/polls"),
        api.get("/admin/stats/activity?period=7d"),
      ]);

      // Polls are required; if this fails, show the error state
      if (pollsRes.status === "rejected") {
        setError(
          pollsRes.reason?.response?.data?.message ||
            "Unable to load polls."
        );
        return;
      }

      const pollsData = pollsRes.value.data.data;
      const list = pollsData?.polls || pollsData || [];
      const fetchedPolls = Array.isArray(list) ? list : [];
      setPolls(fetchedPolls);
      if (activityRes.status === "fulfilled") {
        const activityList = activityRes.value.data.data?.activity;
        setActivity(Array.isArray(activityList) ? activityList : null);
      } else {
        setActivity(null);
      }

      if (statsRes.status === "fulfilled") {
        const stats = statsRes.value.data.data || {};
        setAdminStats({
          totalUsers: stats.totalUsers ?? 0,
          totalPolls: stats.totalPolls ?? 0,
          totalVotes: stats.totalVotes ?? 0,
          publishedPolls: stats.publishedPolls ?? 0,
          draftPolls: stats.draftPolls ?? 0,
          closedPolls: stats.closedPolls ?? 0,
          activePolls: stats.activePolls ?? 0,
        });
      } else {
        // Backend stats not ready: derive what we can from the polls
        console.warn(
          "Stats unavailable:",
          statsRes.reason?.response?.status
        );

        const countByStatus = (s) =>
          fetchedPolls.filter((p) => p.status === s).length;

        const totalVotes = fetchedPolls.reduce(
          (sum, p) =>
            sum +
            (p.votesCount ?? p.totalVotes ?? p.voteCount ?? 0),
          0
        );

        setAdminStats({
          totalUsers: 0,
          totalPolls: fetchedPolls.length,
          totalVotes,
          publishedPolls: countByStatus("published"),
          draftPolls: countByStatus("draft"),
          closedPolls: countByStatus("closed"),
          activePolls: countByStatus("published"),
        });
        setStatsUnavailable(true);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /*
    Sort newest polls first
  */
  const recentPolls = useMemo(() => {
    return [...polls]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [polls]);

  /*
    Get the number of polls created in the last 7 days.
  */
  const weeklyActivity = useMemo(() => {
    // Real votes per day from the backend
    if (activity) {
      return activity.map((item) => ({
        date: new Date(`${item.date}T00:00:00`),
        count: item.votes ?? 0,
      }));
    }

    // Fallback: polls created per day
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = polls.filter((poll) => {
      if (!poll.createdAt) return false;

      const createdAt = new Date(poll.createdAt);

      return createdAt >= date && createdAt < nextDate;
  }).length;

  days.push({ date, count });
  }

  return days;
}, [polls, activity]);

  const maxWeeklyActivity = Math.max(
    ...weeklyActivity.map((day) => day.count),
    1
  );

  /*
    Average votes per poll
  */
  const averageVotesPerPoll =
    adminStats.totalPolls > 0
      ? (
          adminStats.totalVotes /
          adminStats.totalPolls
        ).toFixed(1)
      : "0.0";

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatCategory = (category) => {
    if (!category) return "Uncategorized";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const getStatusStyle = (status) => {
    if (status === "published") {
      return "bg-green-50 text-green-600";
    }

    if (status === "draft") {
      return "bg-yellow-50 text-yellow-600";
    }

    if (status === "closed") {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-gray-100 text-gray-600";
  };

  /*
    Loading state
  */
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="mdi:loading"
            width="34"
            className="animate-spin text-[#3B82F6]"
          />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /*
    Error state
  */
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <Icon
            icon="mdi:alert-circle-outline"
            width="24"
            className="mt-0.5 text-red-500"
          />

          <div>
            <h2 className="font-semibold text-red-700">
              Unable to load dashboard
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB]"
            >
              <Icon
                icon="mdi:refresh"
                width="18"
              />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your VOXA voting platform.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Icon
            icon="mdi:refresh"
            width="19"
          />
          Refresh
        </button>
      </div>

      {statsUnavailable && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          <Icon
            icon="mdi:information-outline"
            width="20"
            className="mt-0.5 shrink-0"
          />
          <p>
            Live admin stats aren't available yet. Poll numbers below are
            calculated from your polls list, and user count is hidden.
          </p>
        </div>
      )}

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {statsUnavailable ? "—" : adminStats.totalUsers}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Registered users
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:account-group-outline"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Total Polls */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Polls
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {adminStats.totalPolls}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                All polls created
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Icon
                icon="mdi:poll"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Total Votes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Votes
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {adminStats.totalVotes}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Votes submitted
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Icon
                icon="mdi:vote-outline"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Active Polls */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Polls
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {adminStats.activePolls}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Currently active
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Icon
                icon="mdi:chart-timeline-variant"
                width="23"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Published Polls */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Published Polls
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {adminStats.publishedPolls}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Icon
                icon="mdi:check-circle-outline"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Draft Polls */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Draft Polls
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {adminStats.draftPolls}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
              <Icon
                icon="mdi:file-document-edit-outline"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Closed Polls */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Closed Polls
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {adminStats.closedPolls}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Icon
                icon="mdi:lock-outline"
                width="23"
              />
            </div>
          </div>
        </div>

        {/* Average Votes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Average Votes / Poll
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {averageVotesPerPoll}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:chart-line"
                width="23"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity + Recent Polls */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Weekly Activity */}
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Poll Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {activity
                ? "Votes submitted over the last 7 days."
                : "Polls created over the last 7 days."}
            </p>
          </div>

          <div className="flex h-56 items-end gap-1.5 sm:gap-3">
            {weeklyActivity.map((day) => {
              const height =
                day.count === 0
                  ? 4
                  : Math.max(
                      (day.count /
                        maxWeeklyActivity) *
                        100,
                      8
                    );

              return (
                <div
                  key={day.date.toISOString()}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-medium text-gray-500">
                    {day.count}
                  </span>

                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-[#3B82F6] transition-all"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="text-[11px] text-gray-400">
                    {day.date.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Polls */}
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Polls
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recently created polls.
              </p>
            </div>

            <Link
              to="/admin/polls"
              className="text-sm font-medium text-[#3B82F6] hover:text-[#2563EB]"
            >
              View all
            </Link>
          </div>

          {recentPolls.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentPolls.map((poll) => {
                const pollVotes =
                  poll.votesCount ??
                  poll.totalVotes ??
                  poll.voteCount;

                return (
                  <Link
                    key={poll.id}
                    to={`/admin/polls/${poll.id}`}
                    className="flex items-center justify-between gap-4 py-4 transition hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
                        <Icon
                          icon="mdi:poll"
                          width="20"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {poll.question}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatCategory(
                              poll.category
                            )}
                          </span>

                          <span className="text-gray-300">
                            •
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDate(
                              poll.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                          poll.status
                        )}`}
                      >
                        {formatStatus(
                          poll.status
                        )}
                      </span>

                      <span className="text-xs text-gray-400">
                        {pollVotes ?? "—"}{" "}
                        {pollVotes === 1
                          ? "vote"
                          : pollVotes !== undefined
                            ? "votes"
                            : ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Icon
                  icon="mdi:poll"
                  width="24"
                  className="text-gray-400"
                />
              </div>

              <p className="text-sm font-medium text-gray-900">
                No polls yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create a poll to see it here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access common admin actions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/polls/create"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:plus"
                width="21"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Create Poll
              </p>

              <p className="text-xs text-gray-500">
                Create a new poll
              </p>
            </div>
          </Link>

          <Link
            to="/admin/polls"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:poll"
                width="21"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Manage Polls
              </p>

              <p className="text-xs text-gray-500">
                View all polls
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;