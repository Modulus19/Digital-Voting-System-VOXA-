import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import SearchBar from "../../components/common/SearchBar";
import PollList from "../../components/polls/PollList";
import CategorySidebar from "../../components/polls/CategorySidebar";
import { useNavigate } from "react-router-dom";

const FILTERS = ["All", "Trending", "Recents", "Ending soon"];
const POLLS_PER_PAGE = 5;

const now = Date.now();

const minutesFromNow = (minutes) =>
  new Date(now + minutes * 60 * 1000).toISOString();

const hoursAgo = (hours) =>
  new Date(now - hours * 60 * 60 * 1000).toISOString();


// TEMP mock data — remove once GET /api/polls is wired up
const MOCK_POLLS = [
  {
    id: "1",
    category: "Others",
    title: "What's the best way to spend a Friday?",
    options: [
      { id: "a", label: "Go clubbing" },
      { id: "b", label: "Netflix and chill" },
      { id: "c", label: "Sleep throughout" },
    ],
    endsInLabel: "Ends in 3 hours",
    votesCount: 1200,
    trending: false,
    createdAt: hoursAgo(5),
    endsAt: minutesFromNow(180),
  },

  {
    id: "2",
    category: "Food",
    title: "Rice or Beans?",
    options: [
      { id: "a", label: "Rice" },
      { id: "b", label: "Beans" },
      { id: "c", label: "I rather eat swallow" },
    ],
    endsInLabel: "Ends in 30 minutes",
    votesCount: 500,
    trending: true,
    createdAt: hoursAgo(2),
    endsAt: minutesFromNow(30),
  },

  {
    id: "3",
    category: "Education",
    title: "Should 8a.m classes be banned?",
    options: [
      { id: "a", label: "Yes" },
      { id: "b", label: "No" },
      { id: "c", label: "Move to 9a.m" },
    ],
    endsInLabel: "Ends in 1 hour",
    votesCount: 1000,
    trending: true,
    createdAt: hoursAgo(1),
    endsAt: minutesFromNow(60),
  },

  {
    id: "4",
    category: "Technology",
    title: "Which device do you use most for studying?",
    options: [
      { id: "a", label: "Laptop" },
      { id: "b", label: "Smartphone" },
      { id: "c", label: "Tablet" },
    ],
    endsInLabel: "Ends in 2 days",
    createdAt: hoursAgo(3),
    endsAt: minutesFromNow(2880),
    votesCount: 850,
    trending: false,
  },

  {
    id: "5",
    category: "Sports",
    title: "What's your favourite sport?",
    options: [
      { id: "a", label: "Football" },
      { id: "b", label: "Basketball" },
      { id: "c", label: "Tennis" },
    ],
    endsInLabel: "Ends in 6 hours",
    createdAt: hoursAgo(0.5),
    endsAt: minutesFromNow(360),
    votesCount: 2100,
    trending: true,
  },

  {
    id: "6",
    category: "Lifestyle",
    title: "How do you prefer to spend your weekends?",
    options: [
      { id: "a", label: "Going out with friends" },
      { id: "b", label: "Staying at home" },
      { id: "c", label: "Learning something new" },
    ],
    endsInLabel: "Ends in 12 hours",
    createdAt: hoursAgo(8),
    endsAt: minutesFromNow(720),
    votesCount: 430,
    trending: false,
  },

];


// TEMP: simulates a real API call — swap this out for
// `api.get('/polls')` from src/services/api.js once ready.
function fetchPollsMock() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_POLLS), 800);
  });
}

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    fetchPollsMock()
      .then((data) => {
        if (!cancelled) {
          setPolls(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load polls.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const filteredPolls = polls
    .filter((poll) => {
      const matchesSearch = poll.title
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesCategory =
        !selectedCategory || poll.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .filter((poll) =>
      activeFilter === "Trending" ? poll.trending : true
    )
    .sort((a, b) => {
      if (activeFilter === "Recents") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (activeFilter === "Ending soon") {
        return new Date(a.endsAt) - new Date(b.endsAt);
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
    setDropdownOpen(false);
  }

  function retry() {
    setIsLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300"
        >
          <Icon icon="mdi:plus" width={24} />
        </button>
      </div>

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

          <div className="relative my-5" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              {activeFilter}
              <Icon
                icon={
                  dropdownOpen
                    ? "mdi:chevron-up"
                    : "mdi:chevron-down"
                }
                width={18}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-border bg-white p-1 shadow-lg">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => changeFilter(filter)}
                    className={`block w-full rounded-lg px-4 py-2 text-left text-sm hover:bg-surface ${
                      activeFilter === filter
                        ? "font-semibold text-primary"
                        : "text-text-heading"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
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
                onClick={() => setCurrentPage((page) => page - 1)}
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
                onClick={() => setCurrentPage((page) => page + 1)}
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>

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