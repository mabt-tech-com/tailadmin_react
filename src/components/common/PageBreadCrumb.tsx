import { ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";

interface BreadcrumbProps {
  pageTitle: string;
  description?: string | undefined;
  button?: Boolean;
  button_text?: string;
  to_link?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, description, button, button_text, to_link }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-2xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {pageTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <ChevronRight size={15} />
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
        
        <Link to={to_link ? `/${to_link}` : "/"}>
          {button ? 
            <Button>
              <Plus size={20} />
              Add {button_text ? button_text : "Button"} 
            </Button>
          : ""}
        </Link>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
