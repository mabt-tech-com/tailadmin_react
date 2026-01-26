// src/components/qall/api-keys/NewApiKeySuccessModal.tsx
"use client";

import Button from "../../common/Button";
import { Modal } from "../../ui/modal";
import { Copy } from "lucide-react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  plainKey: string | null;
  keyName: string | null;
  onClose: () => void; // should clear state + close modal
};

export default function NewApiKeySuccessModal({ isOpen, plainKey, keyName, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!plainKey) return;
    try {
      await navigator.clipboard.writeText(plainKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="relative w-full max-w-[680px] m-5 sm:m-0 rounded-3xl bg-white p-6 lg:p-10 dark:bg-gray-900"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h4 className="text-title-sm mb-1 font-semibold text-gray-800 dark:text-white/90">
            API Key created successfully
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {keyName ? `“${keyName}”` : "Your new key"} is ready. This is the <b>only</b> time you’ll see the full key.
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
            <div className="text-sm font-medium">Save this key now!</div>
            <div className="text-xs mt-1">
              Copy and store it securely. If you lose it, you’ll need to generate a new one.
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <code className="break-all text-xs text-green-700 dark:text-green-300">
                {plainKey ?? ""}
              </code>

              <Button variant="none" onClick={handleCopy} className="bg-white/20 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300">
                <Copy size={18} className="mr-2" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full" onClick={onClose}>
              I’ve Saved the Key
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}