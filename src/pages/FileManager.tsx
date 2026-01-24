import PageBreadcrumb from "../components/common/PageBreadCrumb";
import AllFilesCard from "../components/qall/fileManager/AllFilesCard";
import PageMeta from "../components/common/PageMeta";

export default function FileManager() {
  return (
    <>
      <PageMeta
        title="File Manager Page "
        description="File Manager  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="File Manager" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 ">
          {/* <!-- Media Card --> */}

          <AllFilesCard />
          {/* <!-- Media Card --> */}
        </div>

      </div>
    </>
  );
}
