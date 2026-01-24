import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ProductListTable from "../components/qall/phoneNumbers/PhoneNumbersTable";

export default function Blank() {
  return (
    <div>
      <PageMeta
        title="Blank Page "
        description="Blank Page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <ProductListTable />
    </div>
  );
}
