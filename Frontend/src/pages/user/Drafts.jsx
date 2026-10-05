import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { useAuth } from "../../context/AuthContext";
import { getPolls, deletePoll } from "../../services/pollApi";

import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import ConfirmModal from "../../components/common/ConfirmModal";

const DRAFT_FILTERS = [
  "All",
  "Education",
  "Technology",
  "Sports",
  "Lifestyle",
  "Food",
  "Others",
];

const categoryIcons = {
  education: "mdi:school-outline",
  technology: "mdi:code-tags",
  sports: "mdi:soccer",
  lifestyle: "mdi:party-popper",
  food: "mdi:food-outline",
  others: "mdi:dots-horizontal-circle-outline",
};

export default function Drafts() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.id;

  const [drafts, setDrafts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadDrafts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPolls();

        if (cancelled) return;

        const allPolls = response?.data?.polls ?? [];

        const myDrafts = allPolls.filter((poll) => {
          const creatorId =
            typeof poll.creator === "object"
              ? poll.creator?.id || poll.creator?._id
              : poll.creator;

          return (
            String(creatorId) === String(userId) &&
            poll.status === "draft"
          );
        });

        setDrafts(myDrafts);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load drafts:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your drafts. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDrafts();

    return () => {
      cancelled = true;
    };
  }, [userId, retryCount]);

  const filteredDrafts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drafts.filter((poll) => {
      const matchesSearch =
        !query ||
        poll.question?.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        poll.category?.toLowerCase() ===
          activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [drafts, search, activeCategory]);

  const formatCategory = (category) => {
    if (!category) return "Uncategorized";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  const formatEditedTime = (date) => {
    if (!date) return "Recently edited";

    const editedDate = new Date(date);

    if (Number.isNaN(editedDate.getTime())) {
      return "Recently edited";
    }

    const difference = Date.now() - editedDate.getTime();

    const minutes = Math.max(
      0,
      Math.floor(difference / 60000)
    );

    if (minutes < 1) {
      return "Edited just now";
    }

    if (minutes < 60) {
      return `Edited ${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `Edited ${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `Edited ${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return `Edited ${editedDate.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    )}`;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);
      setError("");

      await deletePoll(deleteTarget.id);

      setDrafts((current) =>
        current.filter(
          (poll) => poll.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete draft failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete this draft. Please try again."
      );

      setDeleteTarget(null);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16 sm:py-24">
        <Loading size="large" />
      </div>
    );
  }

  if (error && drafts.length === 0) {
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
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Drafts
        </h1>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          Continue working on polls you haven't published yet.
        </p>
      </header>

      {/* Action error */}
      {error && drafts.length > 0 && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="min-w-0 text-sm leading-5 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors duration-200 hover:bg-red-100"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      )}

      {/* Search + filter */}
      {drafts.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search polls..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={activeCategory}
              onChange={(event) =>
                setActiveCategory(event.target.value)
              }
              aria-label="Filter drafts by category"
              className="
                min-h-10 cursor-pointer appearance-none
                rounded-lg border border-slate-200 bg-white
                py-2.5 pl-4 pr-10 text-xs font-semibold
                text-slate-700 outline-none
                transition-all duration-200
                focus:border-blue-500 focus:ring-2
                focus:ring-blue-100
              "
            >
              {DRAFT_FILTERS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "All" ? "All Drafts" : filter}
                </option>
              ))}
            </select>

            <Icon
              icon="mdi:chevron-down"
              className="
                pointer-events-none absolute right-3 top-1/2
                -translate-y-1/2 text-base text-slate-500
              "
            />
          </div>
        </div>
      )}

      {/* Empty drafts */}
      {drafts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 sm:h-14 sm:w-14">
            <Icon
              icon="mdi:file-document-edit-outline"
              className="text-2xl text-blue-600 sm:text-3xl"
            />
          </div>

          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            No drafts yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Polls you save without publishing will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/polls/create")}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
          >
            <Icon icon="mdi:plus" />
            Create Poll
          </button>
        </div>
      ) : filteredDrafts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center">
          <Icon
            icon="mdi:magnify"
            className="mx-auto mb-3 text-3xl text-slate-400"
          />

          <p className="text-sm text-slate-500">
            No drafts match your search.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {filteredDrafts.map((poll) => {
            const isDeleting = deletingId === poll.id;

            return (
              <article
                key={poll.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:shadow-sm sm:p-5"
              >
                <div className="flex gap-3 sm:gap-5">
                  {/* Category icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-900 sm:h-12 sm:w-12">
                    <Icon
                      icon={
                        categoryIcons[poll.category] ||
                        categoryIcons.others
                      }
                      className="text-3xl"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Question + edited time */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h2 className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                        {poll.question ||
                          "Untitled poll"}
                      </h2>

                      <span className="shrink-0 whitespace-nowrap text-[11px] text-slate-400 sm:text-xs">
                        {formatEditedTime(
                          poll.updatedAt
                        )}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                        {formatCategory(
                          poll.category
                        )}
                      </span>

                      <span className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                        {poll.options?.length ?? 0}{" "}
                        {(poll.options?.length ?? 0) ===
                        1
                          ? "Option"
                          : "Options"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          navigate(
                            `/polls/${poll.id}/edit`
                          )
                        }
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-500 px-3.5 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon icon="mdi:pencil-outline" />

                        Continue editing
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          setDeleteTarget(poll)
                        }
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-500 px-3.5 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon icon="mdi:trash-can-outline" />

                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (!deletingId) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete draft?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${
                deleteTarget.question ||
                "Untitled poll"
              }"? This action cannot be undone.`
            : ""
        }
        confirmText={
          deletingId ? "Deleting..." : "Delete Draft"
        }
      />
    </div>
  );
}