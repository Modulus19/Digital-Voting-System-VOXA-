import { Icon } from "@iconify/react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "5,248",
      change: "12.5%",
      icon: "mdi:account-group-outline",
      iconBg: "bg-blue-50",
      iconColor: "text-[#3B82F6]",
    },
    {
      title: "Total Polls",
      value: "1,284",
      change: "8.2%",
      icon: "mdi:poll",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      title: "Total Votes",
      value: "18,492",
      change: "15.4%",
      icon: "mdi:vote-outline",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Active Polls",
      value: "342",
      change: "5.8%",
      icon: "mdi:chart-box-outline",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  const recentPolls = [
    {
      title: "Best programming language?",
      status: "Active",
      votes: 245,
      date: "Oct 2, 2026",
      icon: "mdi:code-tags",
    },
    {
      title: "Favourite social platform?",
      status: "Active",
      votes: 189,
      date: "Oct 1, 2026",
      icon: "mdi:heart-outline",
    },
    {
      title: "Best study method?",
      status: "Closed",
      votes: 421,
      date: "Sep 28, 2026",
      icon: "mdi:book-open-outline",
    },
    {
      title: "Campus food survey",
      status: "Active",
      votes: 156,
      date: "Sep 27, 2026",
      icon: "mdi:food-outline",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back, Admin 👋
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Here's what's happening with Voxa today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon
                  icon={stat.icon}
                  width="22"
                  height="22"
                  className={stat.iconColor}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1">
              <Icon
                icon="mdi:trending-up"
                width="16"
                height="16"
                className="text-green-500"
              />

              <span className="text-xs font-semibold text-green-500">
                {stat.change}
              </span>

              <span className="text-xs text-gray-400">
                from last week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Polls + Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Polls */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Recent Polls
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest polls created on Voxa
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-[#3B82F6] hover:text-blue-700"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400">
                    Poll
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-400">
                    Votes
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-400">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentPolls.map((poll) => (
                  <tr
                    key={poll.title}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
                          <Icon
                            icon={poll.icon}
                            width="17"
                            height="17"
                          />
                        </div>

                        <span className="text-sm font-medium text-[#0F172A]">
                          {poll.title}
                        </span>
                      </div>
                    </td>

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

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {poll.votes}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-400">
                      {poll.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Poll Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Poll Activity
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Total votes over the last 7 days
            </p>
          </div>

          {/* Simple chart */}
          <div className="mt-6">
            <div className="flex h-52 items-end gap-3 border-b border-l border-gray-200 px-3 pb-0">
              {[35, 48, 42, 62, 55, 72, 88].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 items-end justify-center"
                >
                  <div
                    className="w-full max-w-8 rounded-t-md bg-[#3B82F6] transition hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between px-2 text-[10px] text-gray-400">
              <span>Sep 27</span>
              <span>Sep 28</span>
              <span>Sep 29</span>
              <span>Sep 30</span>
              <span>Oct 1</span>
              <span>Oct 2</span>
              <span>Oct 3</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">
                Total votes
              </p>

              <p className="mt-1 text-lg font-bold text-[#0F172A]">
                18,492
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
              <Icon
                icon="mdi:trending-up"
                width="16"
                height="16"
              />
              15.4%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;