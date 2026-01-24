import { ReactNode } from "react";
import IntegrationDetailsModal from "./IntegrationDetailsModal";
import IntegrationDeleteModal from "./IntegrationDeleteModal";
import Switch from "../../form/switch/Switch";
import IntegrationSettingsModal from "./IntegrationSettingsModal";
import AddIntegrationModal from "./AddIntegrationModal";

interface IntegrationCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  connect: boolean;
  connected: boolean;
}

export default function IntegrationCard({
  title,
  icon,
  description,
  connect,
  connected,
}: IntegrationCardProps) {
  return (
    <>
      <article className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="relative p-5 pb-9">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center flex items-center bg-gray-100 rounded-lg dark:bg-gray-800">
            {icon}
          </div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-5 dark:border-gray-800">
            {connected ? (
              <>
              <div className="flex gap-3">
                <IntegrationSettingsModal />
                <IntegrationDetailsModal />
                <IntegrationDeleteModal/>
              </div>
              <Switch defaultChecked={connect} />
              </>
            ) : (
              <div className="flex gap-3">
                <AddIntegrationModal />
              </div>
            )}
        </div>
      </article>

    </>
  );
}
