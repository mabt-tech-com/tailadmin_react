import React from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  maxSizeMb?: number; // default 10
};

const KnowledgebaseDropzone: React.FC<Props> = ({ value, onChange, maxSizeMb = 10 }) => {
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  const onDrop = (acceptedFiles: File[]) => {
    // append to existing, prevent duplicate by name+size+lastModified
    const next = [...value];
    for (const f of acceptedFiles) {
      const exists = next.some(
        (x) => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified
      );
      if (!exists) next.push(f);
    }
    onChange(next);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: maxSizeBytes,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
  });

  const removeFile = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div>
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <div
          {...getRootProps()}
          className={`rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
            isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center">
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Knowledge Files Here"}
            </h4>

            <span className="text-center mb-2 block w-full max-w-[360px] text-sm text-gray-700 dark:text-gray-400">
              PDF, DOC/DOCX, TXT, MD up to {maxSizeMb}MB each
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse Files
            </span>
          </div>
        </div>
      </div>

      {/* Rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          Some files were rejected (wrong type or too large).
        </div>
      )}

      {/* Selected files */}
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, idx) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900/50"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="ml-3 text-sm text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgebaseDropzone;