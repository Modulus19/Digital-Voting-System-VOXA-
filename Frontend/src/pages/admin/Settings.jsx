import { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [notifications, setNotifications] = useState({
    newPolls: true,
    pollUpdates: true,
    systemUpdates: true,
  });

  const [success, setSuccess] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // Frontend only for now.
    setSuccess("Profile settings saved successfully.");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const handleNotificationChange = (name) => {
    setNotifications((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your administrator account and preferences.
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-600">
          <Icon
            icon="mdi:check-circle-outline"
            width="21"
          />

          <p>{success}</p>
        </div>
      )}

      {/* Account Information */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:account-outline"
                width="22"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your administrator account details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
              disabled
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Email changes are managed by the account system.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB]"
          >
            <Icon
              icon="mdi:content-save-outline"
              width="19"
            />

            Save Changes
          </button>
        </div>
      </form>

      {/* Notifications */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:bell-outline"
                width="22"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* New Polls */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-800">
                New Polls
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Get notified when new polls are created.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleNotificationChange("newPolls")
              }
              className={`relative h-6 w-11 rounded-full transition ${
                notifications.newPolls
                  ? "bg-[#3B82F6]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications.newPolls
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Poll Updates */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Poll Updates
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Get notified when poll status changes.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleNotificationChange("pollUpdates")
              }
              className={`relative h-6 w-11 rounded-full transition ${
                notifications.pollUpdates
                  ? "bg-[#3B82F6]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications.pollUpdates
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* System Updates */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-800">
                System Updates
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Receive important system notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleNotificationChange("systemUpdates")
              }
              className={`relative h-6 w-11 rounded-full transition ${
                notifications.systemUpdates
                  ? "bg-[#3B82F6]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications.systemUpdates
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3B82F6]">
              <Icon
                icon="mdi:shield-lock-outline"
                width="22"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account security.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Password
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Change your administrator account password.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <Icon
              icon="mdi:key-outline"
              width="18"
            />

            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Icon
              icon="mdi:alert-outline"
              width="22"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Actions in this section can affect your account.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-lg border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Administrator Account
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Contact the system administrator to deactivate
              this account.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-400"
          >
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;