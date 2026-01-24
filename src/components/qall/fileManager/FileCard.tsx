
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";
import { useState } from "react";

interface FileCardProps {
  icon: React.ReactNode;
  title: string;
  date: string;
}

const FileCard: React.FC<FileCardProps> = ({
  icon,
  title,
  date,
}) => {
    const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/30 py-4 pl-4 pr-4 dark:border-gray-800 dark:bg-white/[0.03] xl:pr-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-warning-500/[0.08] text-warning-500`}
        >
          {icon}
        </div>
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <span className="block text-sm text-gray-500 dark:text-gray-400">
            {date}
          </span>
        </div>
      </div>

      <div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
