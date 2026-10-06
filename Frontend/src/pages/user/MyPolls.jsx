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

        const myPolls = allPolls.filter((poll) => {
          const creatorId =
            typeof poll.creator === "object"
              ? poll.creator?.id || poll.creator?._id
              : poll.creator;

          return String(creatorId) === String(userId);
        });

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
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16 sm:py-24">
        <Loading size="large" />
      </div>
    );
  }

  if (error && polls.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Error
          message={error}
          onRetry={() =>
            setRetryCount((count) => count + 1)
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      {/* Header */}
      <header className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Polls
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
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
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-blue-600 text-white
              transition-all duration-200
              hover:scale-105 hover:bg-blue-700
              active:scale-95
            "
          >
            <Icon icon="mdi:plus" className="text-xl" />
          </button>
        )}
      </header>

      {/* Non-blocking action error */}
      {error && polls.length > 0 && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="min-w-0 text-sm leading-5 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="
              flex h-7 w-7 shrink-0 items-center justify-center
              rounded-md text-red-500
              transition-colors duration-200
              hover:bg-red-100
            "
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      )}

      {/* Filters */}
      {polls.length > 0 && (
        <div className="mb-5 sm:mb-7">
          <FilterPills
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}

      {/* Empty account */}
      {polls.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 sm:mb-5 sm:h-14 sm:w-14">
            <Icon
              icon="mdi:poll-box-outline"
              className="text-2xl text-blue-600 sm:text-3xl"
            />
          </div>

          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            You haven't created any polls yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Create your first poll and start collecting votes.
          </p>

          <button
            type="button"
            onClick={() => navigate("/polls/create")}
            className="
              mt-6 inline-flex min-h-11 w-full items-center
              justify-center gap-2 rounded-lg bg-blue-600
              px-5 py-2.5 text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-blue-700 active:scale-[0.98]
              sm:w-auto
            "
          >
            <Icon icon="mdi:plus" />
            Create your first poll
          </button>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center sm:px-6 sm:py-14">
          <Icon
            icon="mdi:filter-outline"
            className="mx-auto mb-3 text-2xl text-slate-400"
          />

          <p className="text-sm text-slate-500">
            No {activeFilter.toLowerCase()} polls found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {filteredPolls.map((poll) => {
            const isWorking = actionLoading === poll.id;

            return (
              <article
                key={poll.id}
                className="
                  flex min-w-0 flex-col rounded-xl
                  border border-slate-200 bg-white p-4
                  shadow-sm transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  sm:min-h-[260px] sm:p-5
                "
              >
                {/* Status + category */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className={`
                      shrink-0 rounded-full px-2.5 py-1
                      text-[11px] font-semibold capitalize sm:px-3 sm:text-xs
                      ${
                        statusStyles[poll.status] ||
                        "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {poll.status}
                  </span>

                  <div className="flex min-w-0 items-center gap-1.5 text-xs capitalize text-slate-500">
                    <Icon
                      icon={
                        categoryIcons[poll.category] ||
                        categoryIcons.others
                      }
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {poll.category}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <h2 className="line-clamp-2 break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                  {poll.question}
                </h2>

                {/* Metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 sm:mt-5 sm:gap-x-5">
                  {poll.votesCount !== null &&
                    poll.votesCount !== undefined && (
                      <span className="flex items-center gap-1.5">
                        <Icon icon="mdi:vote-outline" />

                        {poll.votesCount.toLocaleString()}{" "}
                        {poll.votesCount === 1
                          ? "vote"
                          : "votes"}
                      </span>
                    )}

                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:format-list-bulleted" />

                    {poll.options?.length ?? 0}{" "}
                    {(poll.options?.length ?? 0) === 1
                      ? "option"
                      : "options"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:calendar-outline" />

                    Ends {formatDate(poll.closesAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 sm:mt-auto sm:pt-5">
                  {poll.status === "draft" && (
                    <>
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          navigate(`/polls/${poll.id}/edit`)
                        }
                        className="
                          min-h-9 rounded-lg border border-slate-200
                          px-3 py-2 text-xs font-semibold text-slate-700
                          transition-all duration-200
                          hover:bg-slate-50 active:scale-[0.98]
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          openConfirmation("publish", poll)
                        }
                        className="
                          min-h-9 rounded-lg bg-blue-600
                          px-3 py-2 text-xs font-semibold text-white
                          transition-all duration-200
                          hover:bg-blue-700 active:scale-[0.98]
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
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
                        className="
                          min-h-9 rounded-lg border border-slate-200
                          px-3 py-2 text-xs font-semibold text-slate-700
                          transition-all duration-200
                          hover:bg-slate-50 active:scale-[0.98]
                        "
                      >
                        View
                      </button>

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          openConfirmation("close", poll)
                        }
                        className="
                          min-h-9 rounded-lg border border-slate-200
                          px-3 py-2 text-xs font-semibold text-slate-700
                          transition-all duration-200
                          hover:bg-slate-50 active:scale-[0.98]
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
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
                      className="
                        min-h-9 rounded-lg border border-slate-200
                        px-3 py-2 text-xs font-semibold text-slate-700
                        transition-all duration-200
                        hover:bg-slate-50 active:scale-[0.98]
                      "
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
                    className="
                      ml-auto inline-flex min-h-9 items-center gap-1
                      rounded-lg px-2.5 py-2 text-xs font-semibold
                      text-red-500 transition-all duration-200
                      hover:bg-red-50 active:scale-[0.98]
                      disabled:cursor-not-allowed disabled:opacity-50
                      sm:px-3
                    "
                  >
                    <Icon icon="mdi:trash-can-outline" />
                    <span className="hidden xs:inline sm:inline">
                      Delete
                    </span>
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
        variant={
          confirmAction?.type === "delete"
            ? "danger"
            : confirmAction?.type === "publish"
            ? "primary"
            : "neutral"
        }
      />
    </div>
  );
}