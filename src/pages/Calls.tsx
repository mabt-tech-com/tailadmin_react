// src/pages/Calls.tsx
import PageMeta from "../components/common/PageMeta";
import CallsMetrics from "../components/qall/calls/CallsMetrics";
import CallsTable from "../components/qall/calls/CallsTable"

export default function Calls() {
  return (
    <>
      <PageMeta
        title="Calls Dashboard"
        description="Calls "
      />
      <div className="space-y-6">
        <CallsMetrics />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        </div>
        <CallsTable />
      </div>
    </>
  );
}
