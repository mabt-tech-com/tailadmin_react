import ApiKeyTable from "../components/qall/api-keys/ApiKeyTable";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function ApiKeys() {
  return (
    <div>
      <PageMeta
        title="API Keys Page "
        description=" API Keys page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="API Keys" />
      <ApiKeyTable />
    </div>
  );
}
