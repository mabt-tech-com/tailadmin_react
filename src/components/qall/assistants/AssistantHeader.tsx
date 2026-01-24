import React from "react";
import { ArrowLeft, ChevronDown, Phone, SquarePen, Trash2 } from "lucide-react";
import Button from "../../common/Button";

type Props = {
  assistantSid: string;
  createdAt: string;
};


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const AssistantHeader: React.FC<Props> = ({ assistantSid, createdAt }) => {

  // tabs 
  const tabs = [
      { name: 'Basic Information', href: '#basic', current: true },
      { name: 'Model', href: '#model', current: false },
      { name: 'Voice', href: '#voice', current: false },
      { name: 'Transcriber', href: '#transcriber', current: false },
      { name: 'Knowlegde Base (RAG)', href: '#rag', current: false },
      { name: 'Call Management', href: '#call-management', current: false },
      { name: 'Tools', href: '#tools', current: false },
      { name: 'Advanced Settings', href: '#advanced', current: false },
  ]

  return (
    <header className="mb-6 sticky pt-4 px-8 top-3 -mt-6 -ml-6 w-[104%] bg-white border-gray-200 z-5000 dark:border-gray-800 dark:bg-gray-900 border-b">
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center">
          <a
            href="/assistants"
            className="p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-colors dark:text-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
               
              <span className="flex flex-row gap-2">Assistant<SquarePen className="mt-2" size={14}/></span>
            </h1>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {assistantSid} • {createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="green" size="sm">
              Talk to Assistant <Phone size={20} />
            </Button>

            <Button variant="red" size="sm">
             <Trash2 size={20} />
            </Button>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 pb overflow-x-scroll">
          <div className="grid grid-cols-1 sm:hidden text-gray-800 dark:text-white/90">
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              defaultValue={tabs.find((tab) => tab.current)!.name}
              aria-label="Select a tab"
              className="col-start-1 row-start-1 w-full  appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
            />
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  aria-current={tab.current ? 'page' : undefined}
                  className={classNames(
                    tab.current
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap',
                  )}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssistantHeader;