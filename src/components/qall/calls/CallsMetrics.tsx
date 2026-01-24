import { CheckCircle, Clock, Phone, Sparkle } from "lucide-react";

export default function CallsMetrics() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-200/40 text-gray-800 dark:bg-blue-700/30 dark:text-white/90">
          <Phone className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            12,384
          </h3>
          <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            Total Calls
          </p>
        </div>
      </article>
      <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-green-200/40 text-gray-800 dark:bg-green-700/30 dark:text-white/90">
          <CheckCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            20%
          </h3>
          <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            Success Rate
          </p>
        </div>
      </article>
      <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-purple-200/40 text-gray-800 dark:bg-purple-800/30 dark:text-white/90">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            84s
          </h3>
          <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            Average Duration
          </p>
        </div>
      </article>
      <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-orange-200/40 text-gray-800 dark:bg-orange-600/30 dark:text-white/90">
          <Sparkle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            4
          </h3>
          <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center w-4 h-4 rounded-full ripple bg-success-500/10">
            <div className="h-1.5 w-1.5 rounded-full bg-success-500 "></div>
          </div>
           Live Now
          </p>
        </div>
      </article>
    </div>
  );
}
