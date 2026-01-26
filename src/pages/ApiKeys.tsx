// src/pages/ApiKeys.tsx
import ApiKeyTable from "../components/qall/api-keys/ApiKeyTable";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function ApiKeys() {
  return (
    <div>
      <PageMeta title="API Keys" description="Manage your Qall API keys" />
      <PageBreadcrumb pageTitle="API Keys" description="Manage your API keys for programmatic access to Qall Voice AI." />
      <ApiKeyTable />
    </div>
  );
}