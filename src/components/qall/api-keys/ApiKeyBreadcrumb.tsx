import { Link } from "react-router";
import Button from "../../common/Button";
import { ChevronRight, Plus } from "lucide-react";
import AddApiKeyModal from "./AddApiKeyModal";
import NewApiKeySuccessModal from "./ApiKeySuccessModal";
import { APIKeyPermissions, CreateAPIKeyResponse } from "../../../types/api/apiKeys";

interface BreadcrumbProps {
  pageTitle: string;
  create: (name: string, permissions: APIKeyPermissions) => Promise<CreateAPIKeyResponse>;
  newPlainKey: string | null;
  newKeyName: string | null;
  clearNewKeyModal: () => void;

}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, create, newPlainKey, newKeyName, clearNewKeyModal }) => {
  return (
    <div className="flex flex-col sm:flex-row  sm:items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/assistant"
            >
              Home
              <ChevronRight size={15} />
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
                <div className="flex items-center gap-3 justify-end">
          <div className="flex items-center gap-3 justify-end">
            <AddApiKeyModal onCreate={create} />
          </div>
          <NewApiKeySuccessModal
            isOpen={!!newPlainKey}
            plainKey={newPlainKey}
            keyName={newKeyName}
            onClose={() => {
              clearNewKeyModal();
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default Breadcrumb;