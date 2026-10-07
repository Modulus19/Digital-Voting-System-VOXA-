import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AllPolls = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [openMenu, setOpenMenu] = useState(null);

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // =========================
  // FETCH POLLS
  // =========================

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/polls");

      const fetchedPolls =
        response.data.data?.polls || response.data.data || [];

      setPolls(Array.isArray(fetchedPolls) ? fetchedPolls : []);
    } catch (error) {
      console.error("Failed to fetch polls:", error);

      setError(error.response?.data?.message || "Unable to load polls.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Go back to page 1 whenever search or filters change
  useEffect(() => {
    setPage(1);
    setOpenMenu(null);
  }, [search, statusFilter, categoryFilter]);

  // =========================
  // DELETE POLL
  // =========================

  const handleDelete = async (pollId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this poll?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(pollId);

      await api.delete(`/polls/${pollId}`);

      setPolls((currentPolls) =>
        currentPolls.filter((poll) => poll.id !== pollId)
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to delete poll:", error);

      alert(error.response?.data?.message || "Unable to delete poll.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // PUBLISH POLL
  // =========================

  const handlePublish = async (pollId) => {
    try {
      setActionLoading(pollId);

      await api.patch(`/polls/${pollId}/publish`);

      setPolls((currentPolls) =>
        currentPolls.map((poll) =>
          poll.id === pollId ? { ...poll, status: "published" } : poll
        )
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to publish poll:", error);

      alert(error.response?.data?.message || "Unable to publish poll.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // CLOSE POLL
  // =========================

  const handleClose = async (pollId) => {
    try {
      setActionLoading(pollId);

      await api.patch(`/polls/${pollId}/close`);

      setPolls((currentPolls) =>
        currentPolls.map((poll) =>
          poll.id === pollId ? { ...poll, status: "closed" } : poll
        )
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to close poll:", error);

      alert(error.response?.data?.message || "Unable to close poll.");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // FILTERS
  // =========================

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch = poll.question
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      poll.status === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "All Categories" ||
      poll.category === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(Math.ceil(filteredPolls.length / pageSize), 1);

  // Keeps you on a valid page, e.g. after deleting the last poll on page 3
  const safePage = Math.min(page, totalPages);

  const visiblePolls = filteredPolls.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const startItem =
    filteredPolls.length === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(safePage * pageSize, filteredPolls.length);

  // Shows at most 5 page numbers at a time
  const pageNumbers = (() => {
    const end = Math.min(totalPages, Math.max(safePage + 2, 5));
    const start = Math.max(1, end - 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  const goToPage = (newPage) => {
    setPage(newPage);
    setOpenMenu(null);
  };

  // =========================
  // FORMATTERS
  // =========================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCategory = (category) => {
    if (!category) return "Uncategorized";

    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // GET CREATOR NAME
  // =========================

  const getCreatorName = (poll) => {
    return (
      poll.creator?.username ||
      poll.creator?.name ||
      poll.createdBy?.username ||
      poll.createdBy?.name ||
      poll.username ||
      "User"
    );
  };

  // =========================
  // GET VOTE COUNT
  // =========================

  const getVoteCount = (poll) => {
    return poll.totalVotes ?? poll.votesCount ?? poll.voteCount ?? "—";
  };

  // =========================
  // STATUS STYLE
  // =========================

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

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all polls on VOXA.
          </p>
        </div>

        <Link
          to="/polls/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB]"
        >
          <Icon icon="mdi:plus" width="20" />
          Create Poll
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              width="21"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search polls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          >
            <option>All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Politics">Politics</option>
            <option value="Food">Food</option>
            <option value="Sports">Sports</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:alert-circle-outline" width="22" />

            {error}
          </div>

          <button
            type="button"
            onClick={fetchPolls}
            className="font-medium text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading / Table */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <Icon
              icon="mdi:loading"
              width="32"
              className="animate-spin text-[#3B82F6]"
            />

            <p className="text-sm text-gray-500">Loading polls...</p>
          </div>
        </div>
      ) : error ? null : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="min-h-[300px] overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Poll
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Creator
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Votes
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {visiblePolls.length > 0 ? (
                  visiblePolls.map((poll) => (
                    <tr key={poll.id} className="transition hover:bg-gray-50">
                      {/* Poll */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
                            <Icon icon="mdi:poll" width="21" />
                          </div>

                          <div className="max-w-[280px]">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {poll.question}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {poll.options?.length || 0} options
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {getCreatorName(poll)}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {formatCategory(poll.category)}
                        </span>
                      </td>

                      {/* Votes */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {getVoteCount(poll)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            poll.status
                          )}`}
                        >
                          {formatStatus(poll.status)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(poll.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="relative px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={actionLoading === poll.id}
                          onClick={() =>
                            setOpenMenu(openMenu === poll.id ? null : poll.id)
                          }
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === poll.id ? (
                            <Icon
                              icon="mdi:loading"
                              width="21"
                              className="animate-spin"
                            />
                          ) : (
                            <Icon icon="mdi:dots-vertical" width="21" />
                          )}
                        </button>

                        {/* Dropdown */}
                        {openMenu === poll.id && (
                          <div className="absolute right-6 top-14 z-20 w-40 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
                            {/* View */}
                            <Link
                              to={`/admin/polls/${poll.id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Icon icon="mdi:eye-outline" width="18" />
                              View
                            </Link>

                            {/* Publish */}
                            {poll.status === "draft" && (
                              <button
                                type="button"
                                onClick={() => handlePublish(poll.id)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Icon icon="mdi:publish" width="18" />
                                Publish
                              </button>
                            )}

                            {/* Close */}
                            {poll.status === "published" && (
                              <button
                                type="button"
                                onClick={() => handleClose(poll.id)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Icon icon="mdi:lock-outline" width="18" />
                                Close
                              </button>
                            )}

                            {/* Edit */}
                            {poll.status === "draft" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);

                                  navigate(`/admin/polls/${poll.id}/edit`);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Icon icon="mdi:pencil-outline" width="18" />
                                Edit
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(poll.id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Icon icon="mdi:delete-outline" width="18" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Icon
                            icon="mdi:poll"
                            width="24"
                            className="text-gray-400"
                          />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900">
                          No polls found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {startItem}–{endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {filteredPolls.length}
              </span>{" "}
              polls
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <Icon icon="mdi:chevron-left" width="20" />
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToPage(n)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    n === safePage
                      ? "bg-[#3B82F6] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => goToPage(safePage + 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <Icon icon="mdi:chevron-right" width="20" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPolls;