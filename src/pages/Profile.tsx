"use client";

import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useProfileApi } from "../hooks/useProfileApi";

function fmtDate(iso?: string | null) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
}

function fmtDateTime(iso?: string | null) {
  if (!iso) return "First time";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function Profile() {
  const { data, loading, error } = useProfileApi();

  const user = data?.user;
  const org = data?.organization;

  return (
    <div>
      <PageMeta title="Profile" description="Profile settings and account overview" />
      <PageBreadcrumb pageTitle="Profile" description="View your personal account information and settings" />

      <div className="max-w-6xl mx-auto space-y-8">

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading || !data ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            Loading profile...
          </div>
        ) : (
          <>
            {/* Personal Info */}
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {user?.first_name} {user?.last_name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                      <span className="inline-flex items-center rounded-md bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {fmtDate(user?.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Last Login
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {fmtDateTime(user?.last_login_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Login Count
                    </label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {user?.login_count ?? 0} logins
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Organization</h2>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    ORG
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {org?.name ?? "No Organization"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {org?.slug ?? "N/A"}
                    </div>
                    {org?.description ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {org.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                <a
                  href="/organization"
                  className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  View
                </a>
              </div>
            </div>

            {/* API Access */}
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API Access</h2>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    KEY
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">API Keys</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {data.api_key_count ?? 0} active keys
                    </div>
                  </div>
                </div>

                <a
                  href="/api-keys"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Manage
                </a>
              </div>
            </div>

            {/* Account Status */}
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Status</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                    OK
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Active</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Account is active</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user?.is_verified ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                  }`}>
                    {user?.is_verified ? "✓" : "!"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.is_verified ? "Verified" : "Unverified"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Email {user?.is_verified ? "verified" : "not verified"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user?.google_id ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                  }`}>
                    G
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.google_id ? "Connected" : "Not Connected"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Google OAuth</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}