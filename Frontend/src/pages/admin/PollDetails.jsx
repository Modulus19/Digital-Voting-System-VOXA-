import { Icon } from "@iconify/react";

const PollDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <Icon icon="mdi:arrow-left" />
            Back to Polls
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Poll Details
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage this poll.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
          <Icon icon="mdi:pencil-outline" />
          Edit Poll
        </button>
      </div>

      {/* Poll Information */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Best Programming Language
            </h2>

            <p className="mt-2 text-gray-500">
              Which programming language do you prefer?
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Active
          </span>
        </div>

        <div className="grid gap-4 border-t pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-400">Created by</p>
            <p className="mt-1 font-medium text-gray-800">Wunmi</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Created</p>
            <p className="mt-1 font-medium text-gray-800">
              October 2, 2026
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Ends</p>
            <p className="mt-1 font-medium text-gray-800">
              October 10, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Voting Results */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Voting Results
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            See how users voted on this poll.
          </p>
        </div>

        <div className="space-y-6">
          {/* JavaScript */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">
                JavaScript
              </span>

              <span className="text-sm text-gray-500">
                450 votes · 45%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[45%] rounded-full bg-blue-500"></div>
            </div>
          </div>

          {/* Python */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">
                Python
              </span>

              <span className="text-sm text-gray-500">
                300 votes · 30%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[30%] rounded-full bg-blue-500"></div>
            </div>
          </div>

          {/* Java */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">
                Java
              </span>

              <span className="text-sm text-gray-500">
                150 votes · 15%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[15%] rounded-full bg-blue-500"></div>
            </div>
          </div>

          {/* C++ */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-800">
                C++
              </span>

              <span className="text-sm text-gray-500">
                100 votes · 10%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[10%] rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Votes
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            1,000
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Options
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            4
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Poll Status
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            Active
          </p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Icon icon="mdi:pencil-outline" />
          Edit Poll
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
          <Icon icon="mdi:stop-circle-outline" />
          End Poll
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600">
          <Icon icon="mdi:trash-outline" />
          Delete Poll
        </button>
      </div>
    </div>
  );
};

export default PollDetails;
