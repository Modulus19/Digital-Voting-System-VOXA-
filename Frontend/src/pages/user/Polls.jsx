import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import SearchBar from "../../components/common/SearchBar";
import FilterPills from "../../components/common/FilterPills";
import PollList from "../../components/polls/PollList";
import CategorySidebar from "../../components/polls/CategorySidebar";
import api from "../../services/api";

const FILTERS = ["All", "Trending", "Recents", "Ending Soon"];
const POLLS_PER_PAGE = 5;

export default function Polls() {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPolls = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/polls");
        const fetchedPolls =
          response.data.data.polls || [];

        const pollsWithVoteCounts =
          await Promise.all(
            fetchedPolls.map(async (poll) => {
              try {
                const resultsResponse =
                  await api.get(
                    `/polls/${poll.id}/results`
                  );

                return {
                  ...poll,
                  votesCount:
                    resultsResponse.data.data
                      .totalVotes ?? null,
                };
              } catch (error) {
                const statusCode =
                  error.response?.status;

                if (statusCode === 403) {
                  return {
                    ...poll,
                    votesCount: null,
                  };
                }

                console.error(
                  `Unable to load vote count for poll ${poll.id}:`,
                  error
                );

                return {
                  ...poll,
                  votesCount: null,
                };
              }
            })
          );

        if (!cancelled) {
          setPolls(pollsWithVoteCounts);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load polls."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPolls();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredPolls = polls
    // Draft polls must never appear on the public Polls page
    .filter((poll) => poll.status !== "draft")
    .filter((poll) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        poll.question
          .toLowerCase()
          .includes(search) ||
        poll.category
          .toLowerCase()
          .includes(search) ||
        poll.options.some((option) =>
          option.text
            .toLowerCase()
            .includes(search)
        );

      const matchesCategory =
        !selectedCategory ||
        poll.category ===
          selectedCategory.toLowerCase();

      return (
        matchesSearch && matchesCategory
      );
    })
    .filter((poll) =>
      activeFilter === "Trending"
        ? poll.trending
        : true
    )
    .sort((a, b) => {
      if (activeFilter === "Recents") {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      }

      if (activeFilter === "Ending Soon") {
        return (
          new Date(a.closesAt) -
          new Date(b.closesAt)
        );
      }

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPolls.length /
        POLLS_PER_PAGE
    )
  );

  const visiblePolls = filteredPolls.slice(
    (currentPage - 1) * POLLS_PER_PAGE,
    currentPage * POLLS_PER_PAGE
  );

  function changeFilter(filter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function retry() {
    setIsLoading(true);
    setError(null);
    setRetryCount(
      (count) => count + 1
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      {/* Header */}
      <header className="mb-5 sm:mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
              Polls
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
              Discover polls, share your opinion
              and see what people think.
            </p>
          </div>

          <button
            type="button"
            aria-label="Create a poll"
            title="Create Poll"
            onClick={() =>
              navigate("/polls/create")
            }
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full bg-slate-200
              text-text-heading
              transition-all duration-200
              hover:scale-105 hover:bg-slate-300
              active:scale-95
            "
          >
            <Icon
              icon="mdi:plus"
              width={24}
            />
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-8">
        {/* Poll content */}
        <section className="min-w-0">
          {/* Search */}
          <SearchBar
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(
                event.target.value
              );
              setSelectedCategory(null);
              setActiveFilter("All");
              setCurrentPage(1);
            }}
            placeholder="Search polls..."
          />

          {/* Filter */}
          <div className="my-4 flex items-center justify-between sm:my-5">
            <FilterPills
              filters={FILTERS}
              activeFilter={activeFilter}
              onFilterChange={changeFilter}
            />
          </div>

          {/* Categories — mobile/tablet */}
          <div className="mb-5 lg:hidden">
            <CategorySidebar
              selectedCategory={
                selectedCategory
              }
              onCategoryChange={(
                category
              ) => {
                setSelectedCategory(
                  category
                );
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Polls */}
          <div className="transition-opacity duration-300">
            <PollList
              polls={visiblePolls}
              isLoading={isLoading}
              error={error}
              onRetry={retry}
              hasFilters={
                Boolean(
                  searchTerm.trim()
                ) ||
                Boolean(
                  selectedCategory
                ) ||
                activeFilter !== "All"
              }
            />
          </div>

          {/* Pagination */}
          {!isLoading &&
            !error &&
            totalPages > 1 && (
              <nav
                aria-label="Poll pagination"
                className="mt-6 flex items-center justify-between gap-3 sm:justify-center sm:gap-4"
              >
                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                  className="
                    min-w-0 flex-1 rounded-lg
                    border border-border
                    px-3 py-2 text-xs
                    font-medium text-text-heading
                    transition-all duration-200
                    hover:bg-slate-50
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:flex-none sm:px-4 sm:text-sm
                  "
                >
                  Previous
                </button>

                <span className="shrink-0 text-xs text-slate-500 sm:text-sm">
                  {currentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                  className="
                    min-w-0 flex-1 rounded-lg
                    border border-border
                    px-3 py-2 text-xs
                    font-medium text-text-heading
                    transition-all duration-200
                    hover:bg-slate-50
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:flex-none sm:px-4 sm:text-sm
                  "
                >
                  Next
                </button>
              </nav>
            )}
        </section>

        {/* Categories — desktop */}
        <aside className="hidden lg:block lg:pt-16">
          <CategorySidebar
            selectedCategory={
              selectedCategory
            }
            onCategoryChange={(
              category
            ) => {
              setSelectedCategory(
                category
              );
              setCurrentPage(1);
            }}
          />
        </aside>
      </div>
    </div>
  );
}