"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  useState,
  useRef,
  useCallback,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  File as FileIcon,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

export type FileUploadFile = {
  id: string;
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  preview?: string;
};

const fileUploadVariants = cva(
  "transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "py-6",
        md: "py-10",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type FileUploadProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof fileUploadVariants> & {
    onChange?: (files: File[]) => void;
    value?: FileUploadFile[];
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    multiple?: boolean;
    disabled?: boolean;
    variant?: "dropzone" | "button";
    label?: string;
    description?: string;
    icon?: ReactNode;
    showFileList?: boolean;
    onRemove?: (fileId: string) => void;
    /** Shows error styling. */
    error?: boolean;
    /** Error message displayed below the file list. */
    errorMessage?: string;
  };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFiles(
  files: File[],
  {
    accept,
    maxSize,
    maxFiles,
    currentCount = 0,
  }: {
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    currentCount?: number;
  }
): { accepted: File[]; rejected: { file: File; reason: string }[] } {
  const accepted: File[] = [];
  const rejected: { file: File; reason: string }[] = [];

  const acceptedTypes = accept
    ? accept.split(",").map((t) => t.trim())
    : null;

  for (const file of files) {
    if (maxFiles && currentCount + accepted.length >= maxFiles) {
      rejected.push({ file, reason: `Maximum ${maxFiles} files allowed` });
      continue;
    }

    if (acceptedTypes) {
      const matchesType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith("/*")) {
          const category = type.split("/")[0];
          return file.type.startsWith(`${category}/`);
        }
        return file.type === type;
      });
      if (!matchesType) {
        rejected.push({ file, reason: "File type not accepted" });
        continue;
      }
    }

    if (maxSize && file.size > maxSize) {
      rejected.push({
        file,
        reason: `File exceeds ${formatFileSize(maxSize)} limit`,
      });
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejected };
}

function FileUpload({
  className,
  onChange,
  value,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled = false,
  variant = "dropzone",
  size,
  label,
  description,
  icon,
  showFileList = true,
  onRemove,
  error,
  errorMessage,
  ...props
}: FileUploadProps) {
  const {
    insideField,
    error: resolvedError,
    disabled: resolvedDisabled,
    ariaDescribedBy,
    ariaInvalid,
  } = useFieldAware({ id: undefined, error, disabled, required: undefined });

  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  const defaultLabel =
    variant === "button"
      ? "Upload files"
      : "Drop files here or click to browse";

  const handleClick = useCallback(() => {
    if (resolvedDisabled) return;
    inputRef.current?.click();
  }, [resolvedDisabled]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const filesArray = Array.from(fileList);
      const { accepted } = validateFiles(filesArray, {
        accept,
        maxSize,
        maxFiles,
        currentCount: value?.length ?? 0,
      });

      if (accepted.length > 0) {
        onChange?.(accepted);
      }
    },
    [accept, maxSize, maxFiles, value, onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (resolvedDisabled) return;
      dragCountRef.current += 1;
      if (dragCountRef.current === 1) {
        setIsDragOver(true);
      }
    },
    [resolvedDisabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCountRef.current -= 1;
      if (dragCountRef.current === 0) {
        setIsDragOver(false);
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCountRef.current = 0;
      setIsDragOver(false);
      if (resolvedDisabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [resolvedDisabled, handleFiles]
  );

  const isImage = (file: File) => file.type.startsWith("image/");

  const uploadIcon = icon ?? <Upload className="h-10 w-10 text-white/60" />;

  return (
    <div data-slot="file-upload" className={cn("w-full", className)} {...props}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={resolvedDisabled}
        data-testid="file-input"
      />

      {variant === "button" ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={resolvedDisabled}
          className={cn(
            "inline-flex items-center gap-2",
            "border border-white/10 bg-white/5 hover:bg-white/10",
            "rounded-md px-4 py-2 text-sm text-white/60",
            "transition-colors duration-200",
            resolvedDisabled && "opacity-50 cursor-not-allowed hover:bg-white/5",
            resolvedError && "border-red/50"
          )}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-4 w-4" />
          {label ?? defaultLabel}
        </button>
      ) : (
        <div
          role="button"
          tabIndex={resolvedDisabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center px-6",
            "border-2 border-dashed border-white/10 rounded-lg bg-white/[0.02]",
            "cursor-pointer",
            fileUploadVariants({ size }),
            isDragOver && "border-accent/50 bg-accent/5",
            resolvedDisabled && "opacity-50 cursor-not-allowed",
            resolvedError && "border-red/50"
          )}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          data-testid="dropzone"
        >
          <div className="mb-3">{uploadIcon}</div>
          {!insideField && (
            <p className="text-sm font-medium text-white/60">
              {label ?? defaultLabel}
            </p>
          )}
          {!insideField && description && (
            <p className="text-xs text-white/60 mt-1">{description}</p>
          )}
        </div>
      )}

      {showFileList && value && value.length > 0 && (
        <div className="mt-2 space-y-2" data-testid="file-list">
          <AnimatePresence initial={false}>
            {value.map((fileItem) => (
              <motion.div
                key={fileItem.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/[0.02] border border-white/6">
                  {fileItem.preview && isImage(fileItem.file) ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-8 w-8 rounded object-cover shrink-0"
                    />
                  ) : (
                    <FileIcon className="h-5 w-5 text-white/60 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80 truncate">
                        {fileItem.file.name}
                      </span>
                      <span className="text-xs text-white/60 shrink-0">
                        {formatFileSize(fileItem.file.size)}
                      </span>
                    </div>

                    {fileItem.status === "uploading" && (
                      <div
                        className="h-1 bg-white/10 rounded-full overflow-hidden mt-1"
                        role="progressbar"
                        aria-valuenow={fileItem.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-200"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                    )}

                    {fileItem.status === "error" && fileItem.error && (
                      <p className="text-xs text-red mt-0.5">{fileItem.error}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {fileItem.status === "success" && (
                      <CheckCircle2
                        className="h-4 w-4 text-green"
                        data-testid="success-icon"
                      />
                    )}
                    {fileItem.status === "error" && (
                      <AlertCircle
                        className="h-4 w-4 text-red"
                        data-testid="error-icon"
                      />
                    )}
                    {onRemove && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(fileItem.id);
                        }}
                        className="p-1 text-white/60 hover:text-white/60 transition-colors"
                        aria-label={`Remove ${fileItem.file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!insideField && resolvedError && errorMessage && (
        <p className="mt-1.5 text-xs text-red">{errorMessage}</p>
      )}
    </div>
  );
}

FileUpload.displayName = "FileUpload";

export { FileUpload, fileUploadVariants };
