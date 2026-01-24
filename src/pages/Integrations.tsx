import { Plus } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import {
  SipIcon,
  TwilioIcon,
  PostgresIcon,
  S3Icon,
  OpenAiIcon,
  DeepgramIcon,
  ElevenLabsIcon
} from "../components/qall/integrations/icon";
import PageBreadCrumb from "../components/common/PageBreadCrumb";
import IntegrationCard from "../components/qall/integrations/IntegrationCard";

const privacyData = [
  {
    id: "postgres",
    title: "PostgreSQL",
    description:
      "Connect your database to completely own your data.",
    icon: <PostgresIcon />,
    connect: true,
    connected: false,
  },
  {
    id: "aws-s3",
    title: "AWS S3",
    description:
      "Connect your S3 Bucket to save recordings in your server.",
    icon: <S3Icon />,
    connect: false,
    connected: true,
  },
]

const telephonyData = [
  {
    id: "sip-trunk",
    title: "SIP Credentials",
    description:
      "Connect your custom telephony provider to enable calls from your number.",
    icon: <SipIcon />,
    connect: true,
    connected: false,
  },
  {
    id: "twilio",
    title: "Twilio",
    description:
      "Connect your Google Meet account for seamless video conferencing.",
    icon: <TwilioIcon />,
    connect: false,
    connected: true,
  },
]

const aiData = [
  {
    id: "openai",
    title: "OpenAI",
    description:
      "Connect your OpenAI API",
    icon: <OpenAiIcon />,
    connect: false,
    connected: true,
  },
  {
    id: "deepgraam",
    title: "Deepgraam",
    description:
      "Connect your Deepgraam API",
    icon: <DeepgramIcon />,
    connect: false,
    connected: true,
  },
  {
    id: "elevenlabs",
    title: "ElevenLabs",
    description:
      "Connect your ElevenLabs API",
    icon: <ElevenLabsIcon />,
    connect: false,
    connected: true,
  }
];

export default function Integrations() {
  return (
    <div>
      <PageMeta
        title="Integrations Page "
        description="Support Integrations Page  for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Integrations" />
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t bborder-gray-300 dark:border-gray-700  ml-36" />
          </div>
          <div className="relative flex items-center justify-between my-4">
            <span className="pr-3 text-base font-semibold text-xl font-semibold text-gray-500 dark:text-white/70">
            Data Privacy</span>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {privacyData.map((item) => (
          <IntegrationCard
            key={item.id}
            title={item.title}
            icon={item.icon}
            description={item.description}
            connect={item.connect}
            connected={item.connected}
          />
        ))}
      </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full ml-30 border-t border-gray-300 dark:border-gray-700 " />
          </div>
          <div className="relative flex items-center justify-between my-4">
            <span className=" text-base font-semibold text-xl font-semibold text-gray-500 dark:text-white/70">
            Telephony</span>
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 dark:bg-[#171f2e] bg-white rounded-full px-3 py-1.5 text-base font-semibold shadow-theme-xs justify-center border border-gray-300 text-gray-800 dark:border-gray-700"
            >
              <Plus aria-hidden="true" className="-mr-0.5 -ml-1 size-5 text-gray-500 dark:text-white/70" />
              <span className="text-gray-500 dark:text-white/70"> Add </span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {telephonyData.map((item) => (
            <IntegrationCard
              key={item.id}
              title={item.title}
              icon={item.icon}
              description={item.description}
              connect={item.connect}
              connected={item.connected}
            />
          ))}
        </div>
       <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-[100%] ml-12 border-t border-gray-300 dark:border-gray-700 " />
          </div>
          <div className="relative flex items-center justify-between my-4 py-1.5">
            <span className=" text-base font-semibold text-xl font-semibold text-gray-500 dark:text-white/70">
            AI</span>
            
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {aiData.map((item) => (
            <IntegrationCard
              key={item.id}
              title={item.title}
              icon={item.icon}
              description={item.description}
              connect={item.connect}
              connected={item.connected}
            />
          ))}
        </div>
    </div>
  );
}
