import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import api from "../../services/api";
import FilterPills from "../../components/common/FilterPills";
import { CATEGORY_ICONS } from "../../utils/pollConstants";

const FILTERS = ["All", "Active", "Closed"];

const formatCategory = (category) => {
  if (!category) return "";

  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
};

const formatVoteDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const getPollState = (poll) => {
  if (poll?.status === "closed") {
    return "closed";
  }

  if (
    poll?.closesAt &&
    new Date(poll.closesAt) <= new Date()
  ) {
    return "closed";
  }

  return "active";
};

const getTimeRemaining = (closesAt) => {
  if (!closesAt) return null;

  const difference =
    new Date(closesAt).getTime() - Date.now();

  if (difference <= 0) {
    return "Ended";
  }

  const minutes = Math.ceil(
    difference / (1000 * 60)
  );

  if (minutes < 60) {
    return `Ends in ${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    }`;
  }

  const hours = Math.ceil(minutes / 60);

  if (hours < 24) {
    return `Ends in ${hours} ${
      hours === 1 ? "hour" : "hours"
    }`;
  }

  const days = Math.ceil(hours / 24);

  return `Ends in ${days} ${
    days === 1 ? "day" : "days"
  }`;
};

export default function MyVotes() {
  const navigate = useNavigate();

  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [pollResults, setPollResults] = useState({});

  useEffect(() => {
    const fetchVoteHistory = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/votes/history");
        const voteHistory = response.data?.data;

        const history = Array.isArray(voteHistory)
          ? voteHistory
          : Array.isArray(voteHistory?.votes)
            ? voteHistory.votes
            : [];

        setVotes(history);

        const resultsEntries = await Promise.all(
          history.map(async (vote) => {
            const pollId = vote.poll?._id || vote.poll?.id;

            if (!pollId) {
              return null;
            }

            try {
              const resultResponse = await api.get(
                `/polls/${pollId}/results`
              );

              return [
                String(pollId),
                resultResponse.data?.data ?? null,
              ];
            } catch (error) {
              if (error.response?.status === 403) {
                return [String(pollId), null];
              }

              console.error(
                `Failed to load results for poll ${pollId}:`,
                error
              );

              return [String(pollId), null];
            }
          })
        );

        setPollResults(
          Object.fromEntries(resultsEntries.filter(Boolean))
        );
      } catch (error) {
        console.error(
          "Failed to fetch vote history:",
          error
        );

        if (error.response?.status === 401) {
          setErrorMessage(
            "Your session has expired. Please log in again."
          );
        } else if (
          error.response?.status === 403
        ) {
          setErrorMessage(
            "You are not authorized to view your voting history."
          );
        } else if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              "Unable to load your voting history."
          );
        } else {
          setErrorMessage(
            "Network error. Please check your connection and try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoteHistory();
  }, []);

  const normalizedVotes = useMemo(
    () =>
      votes
        .filter((vote) => vote.poll)
        .map((vote) => {
          const poll = vote.poll;

          const selectedOption =
            poll.options?.find(
              (option) =>
                String(option._id || option.id) ===
                String(vote.selectedOption)
            );

          return {
            ...vote,
            poll,
            selectedOption,
            pollState: getPollState(poll),
          };
        }),
    [votes]
  );

  const counts = useMemo(() => {
    const active = normalizedVotes.filter(
      (vote) => vote.pollState === "active"
    ).length;

    const closed = normalizedVotes.filter(
      (vote) => vote.pollState === "closed"
    ).length;

    return {
      total: normalizedVotes.length,
      active,
      closed,
    };
  }, [normalizedVotes]);

  const filteredVotes = useMemo(() => {
    const searchTerms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return normalizedVotes.filter((vote) => {
      const { poll, selectedOption, pollState } =
        vote;

      const searchableText = [
        poll.question,
        poll.category,
        selectedOption?.text,
        ...(poll.options?.map(
          (option) => option.text
        ) ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerms.every((term) =>
          searchableText.includes(term)
        );

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Active" &&
          pollState === "active") ||
        (activeFilter === "Closed" &&
          pollState === "closed");

      return matchesSearch && matchesFilter;
    });
  }, [
    normalizedVotes,
    search,
    activeFilter,
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Votes
          </h1>

          <div className="mt-4 flex flex-wrap gap-8 sm:gap-12">
            <div>
              <p className="text-lg font-bold text-slate-900">
                {counts.total}
              </p>
              <p className="text-xs font-semibold text-slate-700">
                Total Votes
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                {counts.active}
              </p>
              <p className="text-xs font-semibold text-slate-700">
                Active
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                {counts.closed}
              </p>
              <p className="text-xs font-semibold text-slate-700">
                Closed
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:max-w-sm">
          <Icon
            icon="mdi:magnify"
            width={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search polls..."
            className="
              w-full rounded-lg border
              border-slate-200 bg-white
              py-3 pl-10 pr-4 text-sm
              text-slate-800 outline-none
              transition-all duration-200
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-100
            "
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6">
        <FilterPills
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <Icon
            icon="mdi:loading"
            width={30}
            className="animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading your voting history...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !errorMessage &&
        filteredVotes.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 text-center">
            <Icon
              icon="mdi:vote-outline"
              width={38}
              className="text-slate-300"
            />

            <h2 className="mt-3 text-base font-semibold text-slate-800">
              {votes.length === 0
                ? "No votes yet"
                : "No matching votes"}
            </h2>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {votes.length === 0
                ? "Polls you vote on will appear here."
                : "Try changing your search or filter."}
            </p>
          </div>
        )}

      {/* VOTE CARDS */}
      {!loading &&
        !errorMessage &&
        filteredVotes.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            {filteredVotes.map(
              (vote, index) => {
                const {
                  poll,
                  selectedOption,
                  pollState,
                } = vote;

                const pollId = poll._id || poll.id;

                const resultsData =
                  pollResults[String(pollId)];

                const selectedOptionId =
                  selectedOption?._id || selectedOption?.id;

                const selectedResult =
                  resultsData?.results?.find(
                    (result) =>
                      String(result.optionId) ===
                      String(selectedOptionId)
                  );

                const votePercentage =
                  typeof selectedResult?.percentage === "number"
                    ? selectedResult.percentage
                    : null;

                const category = poll.category;

                const timeRemaining =
                  getTimeRemaining(
                    poll.closesAt
                  );

                return (
                  <article
                    key={
                      vote._id ||
                      vote.id ||
                      index
                    }
                    className="
                      rounded-xl border
                      border-slate-200 bg-white
                      p-4 transition-all
                      duration-200
                      hover:shadow-sm
                      sm:p-6
                    "
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {/* CATEGORY ICON */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                        <Icon
                          icon={
                            CATEGORY_ICONS[category] ||
                            CATEGORY_ICONS.others
                          }
                          width={28}
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="break-words text-base font-bold leading-6 text-slate-900">
                              {poll.question ||
                                "Poll"}
                            </h2>

                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                              {category && (
                                <span>
                                  {formatCategory(category)}
                                </span>
                              )}

                              <span className="capitalize">
                                {pollState}
                              </span>
                            </div>
                          </div>

                          {timeRemaining && (
                            <span className="shrink-0 text-xs font-semibold text-slate-600">
                              {timeRemaining}
                            </span>
                          )}
                        </div>

                        {/* SELECTED VOTE */}
                        <div className="mt-5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-slate-800">
                              You voted:{" "}
                              <span className="font-medium">
                                {selectedOption?.text || "Selected option"}
                              </span>
                            </p>

                            {votePercentage !== null && (
                              <span className="text-xs font-semibold text-blue-600">
                                {votePercentage}%
                              </span>
                            )}
                          </div>

                          {votePercentage !== null && (
                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-out"
                                style={{
                                  width: `${Math.min(100, Math.max(0, votePercentage))}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <p className="text-xs text-slate-500">
                            {vote.createdAt
                              ? `Voted on ${formatVoteDate(
                                  vote.createdAt
                                )}`
                              : ""}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/polls/${pollId}`
                              )
                            }
                            className="
                              inline-flex min-h-10
                              w-full items-center
                              justify-center gap-1
                              rounded-lg bg-blue-600
                              px-4 py-2 text-xs
                              font-semibold text-white
                              transition-all duration-200
                              hover:bg-blue-700
                              active:scale-[0.98]
                              sm:w-auto
                            "
                          >
                            {pollState ===
                            "closed"
                              ? "View result"
                              : "View poll"}

                            <Icon
                              icon="mdi:arrow-right"
                              width={16}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
    </main>
  );
}