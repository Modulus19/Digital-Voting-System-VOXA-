import { useState } from "react";
import { Icon } from "@iconify/react";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  /*
    There is currently no user-management endpoint
    in the VOXA backend API.

    So we intentionally do not create fake users here.
    Once the backend provides a users endpoint, this page
    can be connected to real data.
  */

  const users = [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" ||
      user.role === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Users
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage users registered on VOXA.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              width="21"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          >
            <option>All Roles</option>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-[#3B82F6]">
                          {user.username
                            ?.slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <span className="text-sm font-medium text-gray-900">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#3B82F6]">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Icon
                          icon="mdi:dots-vertical"
                          width="20"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Icon
                icon="mdi:account-group-outline"
                width="32"
                className="text-[#3B82F6]"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              User management is not connected yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              The VOXA backend does not currently provide an
              endpoint for administrators to retrieve and manage
              users. Once the endpoint is available, users will
              appear here.
            </p>

            {(search || roleFilter !== "All Roles") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All Roles");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Icon
                  icon="mdi:refresh"
                  width="18"
                />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Backend Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Icon
          icon="mdi:information-outline"
          width="21"
          className="mt-0.5 shrink-0 text-[#3B82F6]"
        />

        <div>
          <p className="text-sm font-medium text-blue-900">
            User management API required
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            The UI is ready. The backend will need to provide
            user-listing and user-management endpoints before
            this page can display real users or perform actions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;