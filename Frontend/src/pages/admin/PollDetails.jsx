import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const AdminPollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError("");

      const [pollResponse, resultsResponse] = await Promise.all([
        api.get(`/polls/${id}`),
        api.get(`/polls/${id}/results`),
      ]);

      const pollData =
        pollResponse.data.data?.poll ||
        pollResponse.data.data;

      const resultData = resultsResponse.data.data;

      setPoll(pollData);
      setResults(resultData?.results || []);
      setTotalVotes(resultData?.totalVotes || 0);
    } catch (error) {
      console.error("Failed to load poll:", error);
      setError("Unable to load poll details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  // Publish poll
  const handlePublish = async () => {
    try {
      setActionLoading(true);

      await api.patch(`/polls/${id}/publish`);

      await fetchPoll();
    } catch (error) {
      console.error("Failed to publish poll:", error);

      alert(
        error.response?.data?.message ||
          "Unable to publish poll."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Close poll
  const handleClose = async () => {
    try {
      setActionLoading(true);

      await api.patch(`/polls/${id}/close`);

      await fetchPoll();
    } catch (error) {
      console.error("Failed to close poll:", error);

      alert(
        error.response?.data?.message ||
          "Unable to close poll."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Delete poll
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this poll?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await api.delete(`/polls/${id}`);

      navigate("/admin/polls");
    } catch (error) {
      console.error("Failed to delete poll:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete poll."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Format category
  const formatCategory = (category) => {
    if (!category) return "Uncategorized";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  // Format status
  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge styling
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

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="mdi:loading"
            width="32"
            className="animate-spin text-[#3B82F6]"
          />

          <p className="text-sm text-gray-500">
            Loading poll...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poll) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <Icon
            icon="mdi:alert-circle-outline"
            width="24"
          />

          <p className="text-sm">
            {error || "Poll not found."}
          </p>
        </div>

        <Link
          to="/admin/polls"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6]"
        >
          <Icon icon="mdi:arrow-left" width="18" />
          Back to Polls
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back to Polls */}
      <Link
        to="/admin/polls"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#3B82F6]"
      >
        <Icon icon="mdi:arrow-left" width="19" />
        Back to Polls
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 lg:flex-row lg:items-start lg:justify-between">

        {/* Poll title */}
        <div>
          <div className="mb-3 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon icon="mdi:poll" width="23" />
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                poll.status
              )}`}
            >
              {formatStatus(poll.status)}
            </span>
          </div>

          <h1 className="max-w-3xl text-2xl font-bold text-gray-900">
            {poll.question}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Created {formatDate(poll.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">

          {/* Publish */}
          {poll.status === "draft" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon
                icon="mdi:publish"
                width="19"
              />

              Publish
            </button>
          )}

          {/* Close */}
          {poll.status === "published" && (
            <button
              type="button"
              onClick={handleClose}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon
                icon="mdi:lock-outline"
                width="19"
              />

              Close Poll
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon
              icon="mdi:delete-outline"
              width="19"
            />

            Delete
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Total Votes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Votes
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalVotes}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Icon
              icon="mdi:vote-outline"
              width="18"
            />

            Votes submitted
          </div>
        </div>

        {/* Options */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Options
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {poll.options?.length || 0}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Icon
              icon="mdi:format-list-bulleted"
              width="18"
            />

            Available choices
          </div>
        </div>

        {/* Category */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Category
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCategory(poll.category)}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Icon
              icon="mdi:tag-outline"
              width="18"
            />

            Poll category
          </div>
        </div>
      </div>

      {/* Poll Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Poll Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Details about this poll.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Category */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Category
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {formatCategory(poll.category)}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {formatStatus(poll.status)}
            </p>
          </div>

          {/* Results Visibility */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Results Visibility
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {poll.resultsVisibility || "—"}
            </p>
          </div>

          {/* Closing Date */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Closes At
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {poll.closesAt
                ? new Date(
                    poll.closesAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No closing date"}
            </p>
          </div>
        </div>
      </div>

      {/* Poll Results */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Poll Results
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current votes for each option.
          </p>
        </div>

        <div className="space-y-5">

          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.optionId}>

                <div className="mb-2 flex items-center justify-between gap-4">

                  <span className="text-sm font-medium text-gray-800">
                    {result.option}
                  </span>

                  <span className="text-sm font-semibold text-gray-700">
                    {result.votes}{" "}
                    {result.votes === 1
                      ? "vote"
                      : "votes"}{" "}
                    ({result.percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#3B82F6] transition-all"
                    style={{
                      width: `${result.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Icon
                  icon="mdi:chart-bar"
                  width="24"
                  className="text-gray-400"
                />
              </div>

              <p className="text-sm font-medium text-gray-900">
                No results yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                This poll has not received any votes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPollDetails;