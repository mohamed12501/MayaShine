import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File) => void;
  className?: string;
  buttonText?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      onFileSelect,
      buttonText = "Upload a file",
      acceptedFileTypes = "image/*",
      maxFileSize = 10 * 1024 * 1024, // 10MB
      onChange,
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (!file) {
        setFileName(null);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
        setFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFileName(file.name);
      onFileSelect?.(file);
      onChange?.(e);
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div
        className={cn(
          "flex flex-col space-y-2",
          className
        )}
      >
        <input
          type="file"
          className="sr-only"
          ref={(input) => {
            if (typeof ref === "function") {
              ref(input);
            } else if (ref) {
              ref.current = input;
            }
            fileInputRef.current = input;
          }}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          {...props}
        />
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md hover:border-primary transition duration-300 cursor-pointer" onClick={handleClick}>
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-primary"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <span className="relative cursor-pointer text-primary hover:underline">
                {buttonText}
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxFileSize / (1024 * 1024)}MB
            </p>
            {fileName && (
              <p className="text-sm text-gray-700 mt-2">
                Selected: {fileName}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
