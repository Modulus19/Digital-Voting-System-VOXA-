import { useState } from "react";
import { Icon } from "@iconify/react";

const AllPolls = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [openMenu, setOpenMenu] = useState(null);

  const polls = [
    {
      id: 1,
      title: "Best programming language?",
      creator: "Wunmi",
      category: "Technology",
      votes: 245,
      status: "Active",
      date: "Oct 2, 2026",
      icon: "mdi:code-tags",
    },
    {
      id: 2,
      title: "Favourite social platform?",
      creator: "Samuel",
      category: "Technology",
      votes: 189,
      status: "Active",
      date: "Oct 1, 2026",
      icon: "mdi:heart-outline",
    },
    {
      id: 3,
      title: "Campus elections 2026",
      creator: "Peace",
      category: "Politics",
      votes: 532,
      status: "Closed",
      date: "Sep 28, 2026",
      icon: "mdi:vote-outline",
    },
    {
      id: 4,
      title: "Best study method?",
      creator: "Tolu",
      category: "Education",
      votes: 421,
      status: "Closed",
      date: "Sep 27, 2026",
      icon: "mdi:book-open-outline",
    },
    {
      id: 5,
      title: "Favourite social platform?",
      creator: "Deborah",
      category: "Technology",
      votes: 189,
      status: "Active",
      date: "Sep 25, 2026",
      icon: "mdi:account-heart-outline",
    },
    {
      id: 6,
      title: "Best food on campus?",
      creator: "Michael",
      category: "Food",
      votes: 143,
      status: "Active",
      date: "Sep 23, 2026",
      icon: "mdi:food-outline",
    },
    {
      id: 7,
      title: "Best football team?",
      creator: "Daniel",
      category: "Sports",
      votes: 316,
      status: "Closed",
      date: "Sep 21, 2026",
      icon: "mdi:soccer",
    },
  ];

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(search.toLowerCase()) ||
      poll.creator.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      poll.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      poll.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Polls
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all polls created on Voxa.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <Icon
            icon="mdi:plus"
            width="18"
            height="18"
          />
          Create Poll
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              width="19"
              height="19"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search polls..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#3B82F6]"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#3B82F6]"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Closed</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#3B82F6]"
          >
            <option>All Categories</option>
            <option>Technology</option>
            <option>Education</option>
            <option>Politics</option>
            <option>Food</option>
            <option>Sports</option>
          </select>
        </div>
      </div>

      {/* Polls Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Poll
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Creator
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Votes
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Created
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPolls.map((poll) => (
                <tr
                  key={poll.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50/50 last:border-0"
                >
                  {/* Poll */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
                        <Icon
                          icon={poll.icon}
                          width="18"
                          height="18"
                        />
                      </div>

                      <span className="max-w-[220px] truncate text-sm font-medium text-[#0F172A]">
                        {poll.title}
                      </span>
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {poll.creator}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {poll.category}
                    </span>
                  </td>

                  {/* Votes */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {poll.votes}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        poll.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {poll.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {poll.date}
                  </td>

                  {/* Actions */}
                  <td className="relative px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === poll.id ? null : poll.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Poll actions"
                    >
                      <Icon
                        icon="mdi:dots-vertical"
                        width="20"
                        height="20"
                      />
                    </button>

                    {openMenu === poll.id && (
                      <div className="absolute right-5 top-12 z-20 w-36 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Icon
                            icon="mdi:eye-outline"
                            width="17"
                          />
                          View
                        </button>

                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Icon
                            icon="mdi:pencil-outline"
                            width="17"
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Icon
                            icon="mdi:delete-outline"
                            width="17"
                          />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPolls.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Icon
                icon="mdi:poll"
                width="24"
                height="24"
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No polls found
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredPolls.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              Showing 1-{filteredPolls.length} of 50 polls
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                <Icon
                  icon="mdi:chevron-left"
                  width="18"
                />
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3B82F6] text-xs font-semibold text-white"
              >
                1
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
              >
                2
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
              >
                3
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                <Icon
                  icon="mdi:chevron-right"
                  width="18"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPolls;