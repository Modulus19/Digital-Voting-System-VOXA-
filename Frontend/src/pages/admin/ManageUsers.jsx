import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const getUserId = (user) => user.id ?? user._id;

  const currentUserId = currentUser?.id ?? currentUser?._id;

  const isSelf = (user) =>
    currentUserId !== undefined &&
    String(getUserId(user)) === String(currentUserId);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setOpenMenu(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (roleFilter !== "All Roles") {
        params.role = roleFilter.toLowerCase();
      }

      const response = await api.get("/admin/users", {
        params,
      });

      const data = response.data?.data;

      setUsers(data?.users || []);

      setPagination((prev) => ({
        ...prev,
        page: data?.pagination?.page || 1,
        limit: data?.pagination?.limit || 10,
        total: data?.pagination?.total || 0,
        totalPages: data?.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error("Manage users error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));

    fetchUsers();
  };

  // =========================
  // ACTIONS
  // =========================

  const handleToggleStatus = async (user) => {
    const userId = getUserId(user);
    const currentlyActive = user.isActive !== false;

    const confirmed = window.confirm(
      currentlyActive
        ? `Deactivate ${getUserName(user)}? They will not be able to log in.`
        : `Reactivate ${getUserName(user)}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(userId);

      await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentlyActive,
      });

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          getUserId(item) === userId
            ? { ...item, isActive: !currentlyActive }
            : item
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Failed to update user status:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (user) => {
    const userId = getUserId(user);
    const newRole = user.role === "admin" ? "user" : "admin";

    const confirmed = window.confirm(
      `Change ${getUserName(user)}'s role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(userId);

      await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          getUserId(item) === userId
            ? { ...item, role: newRole }
            : item
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Failed to update user role:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update user role."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user) => {
    const userId = getUserId(user);

    const confirmed = window.confirm(
      `Delete ${getUserName(user)}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(userId);

      await api.delete(`/admin/users/${userId}`);

      setOpenMenu(null);

      // If that was the last user on this page, go back one page
      if (users.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({
          ...prev,
          page: prev.page - 1,
        }));
      } else {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getUserName = (user) => {
    return (
      user.username ||
      user.name ||
      user.fullName ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  const getInitials = (user) => {
    const name = getUserName(user);

    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          <form
            onSubmit={handleSearch}
            className="relative flex-1"
          >
            <Icon
              icon="mdi:magnify"
              width="21"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
          </form>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);

              setPagination((prev) => ({
                ...prev,
                page: 1,
              }));
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          >
            <option>All Roles</option>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={fetchUsers}
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Click-away layer for the actions menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex min-h-[380px] items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="min-h-[320px] overflow-x-auto">
              <table className="w-full min-w-[900px]">
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

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => {
                    const userId = getUserId(user);
                    const self = isSelf(user);
                    const active = user.isActive !== false;

                    // Open the menu upwards on the last rows so it is not clipped
                    const openUp =
                      users.length > 4 && index >= users.length - 2;

                    return (
                      <tr
                        key={userId}
                        className="transition hover:bg-gray-50"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-[#3B82F6]">
                              {getInitials(user)}
                            </div>

                            <span className="text-sm font-medium text-gray-900">
                              {getUserName(user)}
                              {self && (
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                  You
                                </span>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{user.email || "—"}</div>

                          {user.emailVerified === false && (
                            <span className="mt-1 inline-block rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-600">
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-blue-50 text-[#3B82F6]"
                            }`}
                          >
                            {user.role || "user"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              active
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {active ? "Active" : "Deactivated"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="relative px-6 py-4 text-right">
                          <button
                            type="button"
                            disabled={self || actionLoading === userId}
                            title={
                              self
                                ? "You cannot modify your own account"
                                : undefined
                            }
                            onClick={() =>
                              setOpenMenu(
                                openMenu === userId ? null : userId
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {actionLoading === userId ? (
                              <Icon
                                icon="mdi:loading"
                                width="20"
                                className="animate-spin"
                              />
                            ) : (
                              <Icon
                                icon="mdi:dots-vertical"
                                width="20"
                              />
                            )}
                          </button>

                          {/* Dropdown */}
                          {openMenu === userId && (
                            <div
                              className={`absolute right-6 z-20 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg ${
                                openUp ? "bottom-12" : "top-12"
                              }`}
                            >
                              {/* Activate / Deactivate */}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Icon
                                  icon={
                                    active
                                      ? "mdi:account-off-outline"
                                      : "mdi:account-check-outline"
                                  }
                                  width="18"
                                />
                                {active ? "Deactivate" : "Reactivate"}
                              </button>

                              {/* Change role */}
                              <button
                                type="button"
                                onClick={() => handleChangeRole(user)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Icon
                                  icon="mdi:shield-account-outline"
                                  width="18"
                                />
                                {user.role === "admin"
                                  ? "Make User"
                                  : "Make Admin"}
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDelete(user)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Icon
                                  icon="mdi:delete-outline"
                                  width="18"
                                />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {users.length > 0
                  ? (pagination.page - 1) *
                      pagination.limit +
                    1
                  : 0}{" "}
                -{" "}
                {(pagination.page - 1) *
                  pagination.limit +
                  users.length}{" "}
                of {pagination.total} users
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page - 1,
                    }))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-2 text-sm text-gray-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : !error ? (
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
              No users found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search || roleFilter !== "All Roles"
                ? "Try adjusting your search or filters."
                : "There are currently no users to display."}
            </p>

            {(search || roleFilter !== "All Roles") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All Roles");
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Icon icon="mdi:refresh" width="18" />
                Clear Filters
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ManageUsers;