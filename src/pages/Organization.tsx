"use client";

import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useOrganizationApi } from "../hooks/useOrgApi";

function initials(first?: string | null, last?: string | null) {
  return ((first?.[0] || "U") + (last?.[0] || "")).toUpperCase();
}

function fmtDate(iso?: string | null) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
}

export default function Organization() {
  const { data, loading, error } = useOrganizationApi();

  const org = data?.organization;
  const users = data?.org_users ?? [];
  const usage = data?.usage;
  const stats = data?.member_stats;

  return (
    <div>
      <PageMeta title="Organization" description="Organization info and team overview" />
      <PageBreadcrumb pageTitle="Organization" description="View your organization information and team members" />

      <div className="max-w-6xl mx-auto space-y-8">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading || !data ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            Loading organization...
          </div>
        ) : (
          <>
            {/* Management */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Management</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/organization/settings"
                  className="block rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      ⚙️
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Organization Settings</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Configure Twilio & settings</div>
                    </div>
                  </div>
                </a>

                <a
                  href="/organization/phone-numbers"
                  className="block rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      📞
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Phone Numbers</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Manage phone numbers</div>
                    </div>
                  </div>
                </a>

                <a
                  href="/assistants"
                  className="block rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                      🤖
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">AI Assistants</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Manage AI assistants</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Organization Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Organization Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Organization Name</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {org?.name ?? "No Organization"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Organization Slug</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {org?.slug ?? "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Description</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {org?.description ?? "No description provided"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Created</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {fmtDate(org?.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Status</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                      <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                        org?.is_active ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                      }`}>
                        {org?.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Domain</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-800 dark:bg-gray-900/40 dark:text-white">
                      {org?.domain ?? "No domain set"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View your organization's team members</p>
                </div>
              </div>

              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                        {initials(u.first_name, u.last_name)}
                      </div>

                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {u.first_name} {u.last_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 capitalize">
                            {u.role}
                          </span>

                          {u.is_verified && (
                            <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                              Verified
                            </span>
                          )}

                          {u.google_id && (
                            <span className="inline-flex items-center rounded-md bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              Google
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!u.is_active && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Inactive</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_members ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.admins ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Administrators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.verified ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Verified</div>
                </div>
              </div>
            </div>

            {/* Usage Overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Usage Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{usage?.active_assistants ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Assistants</div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{usage?.total_calls ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Calls</div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{usage?.success_rate ?? 0}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{usage?.api_key_count ?? 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">API Keys</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}