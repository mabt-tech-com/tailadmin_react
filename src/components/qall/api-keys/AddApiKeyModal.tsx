// src/components/qall/api-keys/AddApiKeyModal.tsx
"use client";

import { useMemo, useState } from "react";
import Button from "../../common/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import Label from "../../form/Label";
import Input from "../../common/input/InputField";
import type { APIKeyPermissions } from "../../../types/api/apiKeys";

type Props = {
  onCreate: (name: string, permissions: APIKeyPermissions) => Promise<any>;
  onCreated?: () => void; // close form modal after success
};

export default function AddApiKeyModal({ onCreate, onCreated }: Props) {
  const addApiKeyModal = useModal();

  const [name, setName] = useState("");
  const [permRead, setPermRead] = useState(true);
  const [permWrite, setPermWrite] = useState(true);
  const [permAdmin, setPermAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const perms: APIKeyPermissions = useMemo(
    () => ({ read: permRead, write: permWrite, admin: permAdmin }),
    [permRead, permWrite, permAdmin]
  );

  const resetForm = () => {
    setName("");
    setPermRead(true);
    setPermWrite(true);
    setPermAdmin(false);
  };

  const closeAll = () => {
    addApiKeyModal.closeModal();
    resetForm();
  };

  const handleGenerate = async () => {
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await onCreate(name.trim(), perms);

      // ✅ close the create modal (success will be shown in a separate modal)
      addApiKeyModal.closeModal();
      resetForm();
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={addApiKeyModal.openModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 10.0002H15.0006M10.0002 5V15.0006"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add API Key
      </Button>

      <Modal
        isOpen={addApiKeyModal.isOpen}
        onClose={closeAll}
        className="relative w-full max-w-[600px] m-5 sm:m-0 rounded-3xl bg-white p-6 lg:p-10 dark:bg-gray-900"
      >
        <div>
          <h4 className="text-title-sm mb-1 font-semibold text-gray-800 dark:text-white/90">
            Generate API key
          </h4>
          <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Create an API key for programmatic access. You’ll only see the full key once after creation.
          </p>

          <div className="space-y-5">
           <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
              <div className="text-sm font-medium">Important</div>
              <div className="text-xs mt-1">
                You’ll only see the full API key once. Copy it and store it securely.
              </div>
            </div>

            <div>
              <Label>Key name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="e.g., Production App, Development"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose a descriptive name to identify this key later.
              </p>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className=" flex flex-row justify-between mt-6 mx-10 space-y-2 text-sm text-gray-700 dark:text-gray-300 ">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={permRead} onChange={(e) => setPermRead(e.target.checked)} />
                  Read
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={permWrite} onChange={(e) => setPermWrite(e.target.checked)} />
                  Write
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={permAdmin} onChange={(e) => setPermAdmin(e.target.checked)} />
                  Admin
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row w-full items-center justify-between gap-3">
            <Button variant="outline" className="w-full" onClick={closeAll}>
              Close
            </Button>
            <Button className="w-full" onClick={handleGenerate} disabled={submitting || !name.trim()}>
              {submitting ? "Generating..." : "Generate API key"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}