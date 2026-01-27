import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Phone,
  Trash2,
  Save,
  BadgeInfo,
  Brain,
  Captions,
  BookOpen,
  PhoneCall,
  Wrench,
  SlidersHorizontal,
  AudioLines,
} from "lucide-react";
import Button from "../../common/Button";

type Props = {
  assistantName: string;
  assistantSid: string;
  createdAt: string;
  onSave?: () => void;
  saving?: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Tab = {
  key:
    | "basic"
    | "model"
    | "voice"
    | "transcriber"
    | "rag"
    | "call-management"
    | "tools"
    | "advanced";
  name: string;
  href: string;
  icon: React.ElementType;
};

const AssistantHeader: React.FC<Props> = ({ assistantName, assistantSid, createdAt, onSave, saving }) => {

  const tabs: Tab[] = useMemo(
    () => [
      { key: "basic", name: "Basic Information", href: "#basic", icon: BadgeInfo },
      { key: "model", name: "Model", href: "#model", icon: Brain },
      { key: "voice", name: "Voice", href: "#voice", icon: AudioLines },
      { key: "transcriber", name: "Transcriber", href: "#transcriber", icon: Captions },
      { key: "rag", name: "Knowledge Base (RAG)", href: "#rag", icon: BookOpen },
      { key: "call-management", name: "Call Management", href: "#call-management", icon: PhoneCall },
      { key: "tools", name: "Tools", href: "#tools", icon: Wrench },
      { key: "advanced", name: "Advanced Settings", href: "#advanced", icon: SlidersHorizontal },
    ],
    [],
  );

  const [activeKey, setActiveKey] = useState<Tab["key"]>("basic");

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // account for sticky header height
    const headerOffset = 120;
    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - headerOffset;

    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  const handleTabClick = (e: React.MouseEvent, key: Tab["key"]) => {
    e.preventDefault();
    setActiveKey(key);
    // keep hash in URL
    window.history.replaceState(null, "", `#${key}`);
    scrollToId(key);
  };

  useEffect(() => {
    // if page loads with a hash
    const hash = window.location.hash?.replace("#", "");
    if (hash && tabs.some((t) => t.key === hash)) {
      setActiveKey(hash as Tab["key"]);
      // let layout settle
      setTimeout(() => scrollToId(hash), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // highlight active tab while scrolling
    const ids = tabs.map((t) => t.key);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id && ids.includes(visible.target.id as Tab["key"])) {
          setActiveKey(visible.target.id as Tab["key"]);
        }
      },
      {
        // tune for sticky header
        root: null,
        rootMargin: "-140px 0px -60% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <header className="mb-6 sticky pt-4 px-8 top-3 -mt-6 -ml-6 w-[104%] bg-white border-gray-200 z-5000 dark:border-gray-800 dark:bg-gray-900 border-b">
      <div className="w-full">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center">
            <a
              href="/assistants"
              className="p-2 mr-5 text-gray-500 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-colors dark:text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 pb-1">
                  {assistantName ? 
                `${assistantName}`
                : ""
                }
              </h1>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {assistantSid ? 
                `${assistantSid} • ${createdAt}`
                : ""
                }
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

            <Button variant="secondary" size="sm" onClick={onSave} disabled={!!saving}>
              {saving ? "Saving..." : "Save"}
              <Save size={18} />
            </Button>

          </div>
        </div>

        <div className="mt-3 sm:mt-4 pb overflow-x-auto">
          {/* Mobile select */}
          <div className="grid grid-cols-1 sm:hidden text-gray-800 dark:text-white/90">
            <select
              value={tabs.find((t) => t.key === activeKey)?.name ?? tabs[0].name}
              aria-label="Select a tab"
              onChange={(e) => {
                const selected = tabs.find((t) => t.name === e.target.value);
                if (!selected) return;
                setActiveKey(selected.key);
                window.history.replaceState(null, "", `#${selected.key}`);
                scrollToId(selected.key);
              }}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-gray-900 dark:text-white dark:outline-gray-700"
            >
              {tabs.map((tab) => (
                <option key={tab.key}>{tab.name}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500"
            />
          </div>

          {/* Desktop tabs */}
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const current = tab.key === activeKey;

                return (
                  <a
                    key={tab.key}
                    href={tab.href}
                    onClick={(e) => handleTabClick(e, tab.key)}
                    aria-current={current ? "page" : undefined}
                    className={classNames(
                      current
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-300"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white/90",
                      "border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap inline-flex items-center gap-2",
                    )}
                  >
                    <Icon size={16} />
                    {tab.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssistantHeader;