// src/pages/user/Polls.jsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import PollCard from "../../components/polls/PollCard";

const CATEGORIES = [
  { name: "Education", icon: "twemoji:graduation-cap" },
  { name: "Technology", icon: "twemoji:laptop" },
  { name: "Sports", icon: "twemoji:soccer-ball" },
  { name: "Lifestyle", icon: "twemoji:cocktail-glass" },
  { name: "Food", icon: "twemoji:shallow-pan-of-food" },
  { name: "Others", icon: "twemoji:party-popper" },
];

const FILTERS = ["All", "Trending", "Recents", "Ending Soon"];

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
  },
];

const POLLS_PER_PAGE = 2; // small number for now, easy to test pagination with mock data

// TEMP: simulates a real API call — swap this out for
// `api.get('/polls')` from src/services/api.js once ready.
function fetchPollsMock() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // To test the error state manually, uncomment the next line:
      // reject(new Error("Failed to load polls"));
      resolve(MOCK_POLLS);
    }, 800);
  });
}

export default function Polls() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchPollsMock()
      .then((data) => setPolls(data))
      .catch(() => setError("Something went wrong while loading polls. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  // TEMP client-side filtering on mock data — replace with real API
  // search/filter params once the backend confirms them (see task note).
  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPolls.length / POLLS_PER_PAGE));
  const visiblePolls = filteredPolls.slice(
    (currentPage - 1) * POLLS_PER_PAGE,
    currentPage * POLLS_PER_PAGE
  );

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1); // reset to page 1 whenever the search changes
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* LEFT: main content */}
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Polls</h1>
          <p className="text-sm text-muted mt-1">
            Discover polls, share your opinion and see what people think.
          </p>

          {/* Search */}
          <div className="mt-5 relative">
            <Icon
              icon="mdi:magnify"
              width="18"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search polls..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-alt border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filter tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "bg-surface text-muted"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Poll list */}
          <div className="mt-5 flex flex-col gap-4">
            {isLoading ? (
              // Loading state
              <div className="flex flex-col items-center justify-center py-16 text-muted">
                <Icon icon="mdi:loading" width="28" className="animate-spin mb-2" />
                <span className="text-sm">Loading polls...</span>
              </div>
            ) : error ? (
              // Error state
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon="mdi:alert-circle-outline" width="28" className="text-accent mb-2" />
                <p className="text-sm text-muted mb-3">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
                >
                  Try again
                </button>
              </div>
            ) : visiblePolls.length === 0 ? (
              // Empty state (covers both "no polls at all" and "no search results")
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon="mdi:file-search-outline" width="28" className="text-muted mb-2" />
                <p className="text-sm text-muted">
                  {searchTerm
                    ? "No polls found. Try a different search."
                    : "No polls available yet."}
                </p>
              </div>
            ) : (
              // Populated state
              <>
                {visiblePolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-semibold disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="text-sm text-muted">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-semibold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-text-heading mb-4">Categories</h2>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.name} className="flex items-center gap-2 text-sm text-text-heading">
                  <Icon icon={cat.icon} width="18" height="18" />
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Icon icon="mdi:heart" width="20" className="text-accent" />
            </div>
            <p className="text-sm font-semibold text-text-heading">
              Want to share your thoughts?
            </p>
            <p className="text-xs text-muted mt-1">
              Reach out to an admin to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}