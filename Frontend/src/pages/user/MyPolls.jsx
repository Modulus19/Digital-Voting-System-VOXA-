import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { useAuth } from "../../context/AuthContext";
import {
  getPolls,
  deletePoll,
  publishPoll,
  closePoll,
} from "../../services/pollApi";

import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterPills from "../../components/common/FilterPills";

const FILTERS = ["All", "Published", "Drafts", "Closed"];

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  closed: "bg-slate-100 text-slate-600",
};

const categoryIcons = {
  education: "mdi:school-outline",
  technology: "mdi:laptop",
  sports: "mdi:soccer",
  lifestyle: "mdi:heart-outline",
  food: "mdi:food-outline",
  others: "mdi:dots-horizontal-circle-outline",
};

export default function MyPolls() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.id;

  const [polls, setPolls] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadPolls = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPolls();

        if (cancelled) return;

        const allPolls = response?.data?.polls ?? [];

        const myPolls = allPolls.filter(
          (poll) => String(poll.creator) === String(user.id)
        );

        setPolls(myPolls);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load polls:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your polls. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPolls();

    return () => {
      cancelled = true;
    };
  }, [userId, retryCount]);

  const filteredPolls = useMemo(() => {
    if (activeFilter === "All") return polls;

    const status =
      activeFilter === "Drafts"
        ? "draft"
        : activeFilter.toLowerCase();

    return polls.filter((poll) => poll.status === status);
  }, [polls, activeFilter]);

  const openConfirmation = (type, poll) => {
    setConfirmAction({ type, poll });
  };

  const closeConfirmation = () => {
    if (actionLoading) return;
    setConfirmAction(null);
  };

  const handleConfirmedAction = async () => {
    if (!confirmAction) return;

    const { type, poll } = confirmAction;

    try {
      setActionLoading(poll.id);

      if (type === "delete") {
        await deletePoll(poll.id);

        setPolls((current) =>
          current.filter((item) => item.id !== poll.id)
        );
      }

      if (type === "publish") {
        await publishPoll(poll.id);

        setPolls((current) =>
          current.map((item) =>
            item.id === poll.id
              ? { ...item, status: "published" }
              : item
          )
        );
      }

      if (type === "close") {
        await closePoll(poll.id);

        setPolls((current) =>
          current.map((item) =>
            item.id === poll.id
              ? { ...item, status: "closed" }
              : item
          )
        );
      }

      setConfirmAction(null);
    } catch (err) {
      console.error(`${type} poll failed:`, err);

      setError(
        err.response?.data?.message ||
          `Unable to ${type} this poll. Please try again.`
      );

      setConfirmAction(null);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "No end date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getConfirmationContent = () => {
    if (!confirmAction) return {};

    const { type, poll } = confirmAction;

    if (type === "delete") {
      return {
        title: "Delete poll?",
        message: `Are you sure you want to delete "${poll.question}"? This action cannot be undone.`,
        confirmText: "Delete Poll",
      };
    }

    if (type === "publish") {
      return {
        title: "Publish poll?",
        message:
          "Once published, this poll will be available for voting and can no longer be edited.",
        confirmText: "Publish Poll",
      };
    }

    return {
      title: "Close poll?",
      message:
        "Closing this poll will stop voters from submitting new votes.",
      confirmText: "Close Poll",
    };
  };

  const confirmationContent = getConfirmationContent();

  if (loading) {
    return (
      <div className="py-24">
        <Loading size="large" />
      </div>
    );
  }

  if (error && polls.length === 0) {
    return (
      <Error
        message={error}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Polls
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {polls.length === 0
              ? "You haven't created any polls yet."
              : `${polls.length} ${
                  polls.length === 1 ? "poll" : "polls"
                } created by you`}
          </p>
        </div>

        {polls.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/polls/create")}
            title="Create Poll"
            aria-label="Create Poll"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <Icon icon="mdi:plus" className="text-xl" />
          </button>
        )}
      </div>

      {/* Non-blocking action error */}
      {error && polls.length > 0 && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      )}

      {polls.length > 0 && (
        <div className="mb-7">
          <FilterPills 
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}

      {/* Empty account */}
      {polls.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Icon
              icon="mdi:poll-box-outline"
              className="text-3xl text-blue-600"
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            You haven't created any polls yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Create your first poll and start collecting votes.
          </p>

          <button
            type="button"
            onClick={() => navigate("/polls/create")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Icon icon="mdi:plus" />
            Create your first poll
          </button>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <p className="text-sm text-slate-500">
            No {activeFilter.toLowerCase()} polls found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredPolls.map((poll) => {
            const isWorking = actionLoading === poll.id;

            return (
              <article
                key={poll.id}
                className="flex min-h-[260px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Status/category */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyles[poll.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {poll.status}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs capitalize text-slate-500">
                    <Icon
                      icon={
                        categoryIcons[poll.category] ||
                        categoryIcons.others
                      }
                    />
                    {poll.category}
                  </div>
                </div>

                {/* Question */}
                <h2 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
                  {poll.question}
                </h2>

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:vote-outline" />
                    {(poll.votesCount ?? 0).toLocaleString()} votes
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:format-list-bulleted" />
                    {poll.options?.length ?? 0} options
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:calendar-outline" />
                    Ends {formatDate(poll.closesAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                  {poll.status === "draft" && (
                    <>
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          navigate(`/polls/${poll.id}/edit`)
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          openConfirmation("publish", poll)
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Publish
                      </button>
                    </>
                  )}

                  {poll.status === "published" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/polls/${poll.id}`)
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          openConfirmation("close", poll)
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Close
                      </button>
                    </>
                  )}

                  {poll.status === "closed" && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/polls/${poll.id}`)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Results
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isWorking}
                    onClick={() =>
                      openConfirmation("delete", poll)
                    }
                    className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Icon icon="mdi:trash-can-outline" />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(confirmAction)}
        onClose={closeConfirmation}
        onConfirm={handleConfirmedAction}
        title={confirmationContent.title}
        message={confirmationContent.message}
        confirmText={
          actionLoading
            ? "Please wait..."
            : confirmationContent.confirmText
        }
      />
    </div>
  );
}