import DashboardChart from "../components/qall/dashboard/Chart";
import CrmRecentOrder from "../components/qall/dashboard/CrmRecentOrderTable";
import PageMeta from "../components/common/PageMeta";
import DashboardMetrics from "../components/qall/dashboard/Metrics";

export default function Crm() {
  return (
    <>
      <PageMeta
        title="Qall Voice AI Dashboard"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          {/* <!-- Metric Group Four --> */}
          <DashboardMetrics />
          {/* <!-- Metric Group Four --> */}
        </div>

        <div className="col-span-12">
          {/* <!-- ====== Chart Eleven Start --> */}
          <DashboardChart />
          {/* <!-- ====== Chart Eleven End --> */}
        </div>


        <div className="col-span-12">
          {/* <!-- Table Four --> */}
          <CrmRecentOrder />
          {/* <!-- Table Four --> */}
        </div>
      </div>
    </>
  );
}
