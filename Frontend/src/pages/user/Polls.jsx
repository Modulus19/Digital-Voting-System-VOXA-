import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import SearchBar from "../../components/common/SearchBar";
import FilterPills from "../../components/common/FilterPills";
import PollList from "../../components/polls/PollList";
import CategorySidebar from "../../components/polls/CategorySidebar";

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

        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/polls`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load polls.");
        }

        if (!cancelled) {
          setPolls(data.data.polls);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message || "Failed to load polls.");
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
    .filter((poll) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        poll.question.toLowerCase().includes(search) ||
        poll.category.toLowerCase().includes(search) ||
        // poll.description.toLowerCase().includes(search) ||
        poll.options.some((option) =>
          option.text.toLowerCase().includes(search)
        );

      const matchesCategory =
        !selectedCategory ||
        poll.category === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .filter((poll) =>
      activeFilter === "Trending" ? poll.trending : true
    )
    .sort((a, b) => {
      if (activeFilter === "Recents") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (activeFilter === "Ending Soon") {
        return new Date(a.closesAt) - new Date(b.closesAt);
      }

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolls.length / POLLS_PER_PAGE)
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
    setRetryCount((count) => count + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">

      {/* Header — follows the same columns as the main content */}
      <div className="mb-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">
              Polls
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Discover polls, share your opinion and see what people think.
            </p>
          </div>

          <button
            type="button"
            aria-label="Create a poll"
            onClick={() => navigate("/polls/create")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300"
          >
            <Icon icon="mdi:plus" width={24} />
          </button>
        </div>

        {/* Keeps header aligned with the category column */}
        <div className="hidden lg:block" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
        <section className="min-w-0">
          <SearchBar
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setSelectedCategory(null);
              setActiveFilter("All");
              setCurrentPage(1);
            }}
            placeholder="Search polls..."
          />

          <div className="my-5">
            <FilterPills
              filters={FILTERS}
              activeFilter={activeFilter}
              onFilterChange={changeFilter}
            />
          </div>

          <PollList
            polls={visiblePolls}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            hasFilters={
              Boolean(searchTerm.trim()) ||
              Boolean(selectedCategory) ||
              activeFilter !== "All"
            }
          />

          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-500">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {/* Category column remains in the same position */}
        <div className="lg:pt-20">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}