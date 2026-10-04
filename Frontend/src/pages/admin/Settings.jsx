import { Icon } from "@iconify/react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your admin account and preferences.
        </p>
      </div>

      {/* Account Information */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View your admin account details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              value="Wunmi"
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value="admin@voxa.com"
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose which notifications you want to receive.
          </p>
        </div>

        <div className="space-y-5">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Icon icon="mdi:email-outline" className="text-xl" />
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  Email Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive important updates by email.
                </p>
              </div>
            </div>

            <button className="relative h-6 w-11 rounded-full bg-blue-500">
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
            </button>
          </div>

          {/* Report Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Icon
                  icon="mdi:bell-outline"
                  className="text-xl"
                />
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  Activity Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Get notified about important activity.
                </p>
              </div>
            </div>

            <button className="relative h-6 w-11 rounded-full bg-blue-500">
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account security.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Icon icon="mdi:lock-outline" />
          Change Password
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="mt-1 mb-5 text-sm text-gray-500">
          Sign out of your admin account.
        </p>

        <button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600">
          <Icon icon="mdi:logout" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
