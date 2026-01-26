import PageMeta from "../components/common/PageMeta";
import Breadcrumb from "../components/qall/assistants/AssistantBreadcrumb";
import AssistantCard from "../components/qall/assistants/AssistantCard";
import { useAssistants } from "../hooks/useAssistantsApi";
import type { AssistantPreview } from "../types/api/assistants";

export default function AssistantsPage() {
  const { assistants, loading, error, remove } = useAssistants({
    per_page: 12,
    page: 1,
    sort_by: "name",
    sort_order: "asc",
  });

  const handleDelete = async (a: AssistantPreview) => {
    const ok = window.confirm(`Delete assistant "${a.name}"?`);
    if (!ok) return;
    try {
      await remove(a.id);
    } catch (e: any) {
      // eslint-disable-next-line no-alert
      alert(e?.message ?? "Failed to delete assistant");
    }
  };

  return (
    <div>
      <PageMeta title="Assistants" description="Manage AI assistants" />
      <Breadcrumb pageTitle="Assistants" />

      {loading ? (
        <div className="min-h-[200px] rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-sm text-gray-600 dark:text-gray-300">Loading assistants…</div>
        </div>
      ) : error ? (
        <div className="min-h-[200px] rounded-2xl border border-red-200 bg-red-50 px-5 py-7 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : assistants.length === 0 ? (
        <div className="min-h-[220px] rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-lg font-semibold text-gray-800 dark:text-white/90">
            No assistants yet
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create an assistant in the backend for now (UI create comes next).
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
          {assistants.map((a) => (
            <AssistantCard key={a.id} assistant={a} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}