import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Folder, File, Grid3x3, List, ChevronRight } from "lucide-react";

export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
  icon?: ReactNode;
};

export type FileManagerBreadcrumb = {
  label: string;
  path: string;
};

export type FileManagerProps = HTMLAttributes<HTMLDivElement> & {
  files: FileItem[];
  currentPath?: string;
  breadcrumbs?: FileManagerBreadcrumb[];
  view?: "grid" | "list";
  onFileClick?: (fileId: string) => void;
  onNavigate?: (path: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
};

const FileManager = forwardRef<HTMLDivElement, FileManagerProps>(
  (
    {
      className,
      files,
      currentPath = "/",
      breadcrumbs,
      view = "list",
      onFileClick,
      onNavigate,
      onViewChange,
      ...props
    },
    ref
  ) => {
    const sortedFiles = [...files].sort((a, b) => {
      // Folders first, then files
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    return (
      <div
        ref={ref}
        data-slot="file-manager"
        className={cn(
          "rounded-xl border border-white/[0.06] overflow-hidden bg-[#0a0a0b]",
          className
        )}
        {...props}
      >
        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-white/[0.06] flex justify-between items-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm min-w-0 overflow-hidden" aria-label="File path">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, index) => (
                <span key={crumb.path} className="flex items-center gap-1 shrink-0">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-white/60 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigate?.(crumb.path)}
                    className={cn(
                      "transition-colors truncate",
                      index === breadcrumbs.length - 1
                        ? "text-white font-medium"
                        : "text-white/60 hover:text-white/60"
                    )}
                  >
                    {crumb.label}
                  </button>
                </span>
              ))
            ) : (
              <span className="text-white/60">{currentPath}</span>
            )}
          </nav>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 shrink-0 ml-4">
            <button
              type="button"
              onClick={() => onViewChange?.("list")}
              className={cn(
                "p-1.5 rounded transition-colors",
                view === "list"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white/60"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange?.("grid")}
              className={cn(
                "p-1.5 rounded transition-colors",
                view === "grid"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white/60"
              )}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {files.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-white/60">This folder is empty</p>
          </div>
        ) : view === "list" ? (
          <div>
            {/* List header */}
            <div className="grid grid-cols-[1fr_100px_140px] px-4 py-2 border-b border-white/[0.06] text-xs text-white/60">
              <span>Name</span>
              <span>Size</span>
              <span>Modified</span>
            </div>
            {/* File rows */}
            {sortedFiles.map((file) => (
              <div
                key={file.id}
                role="button"
                tabIndex={0}
                onClick={() => onFileClick?.(file.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onFileClick?.(file.id);
                  }
                }}
                className="grid grid-cols-[1fr_100px_140px] px-4 py-2 items-center hover:bg-white/[0.02] border-b border-white/[0.06] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {file.icon || (
                    file.type === "folder" ? (
                      <Folder className="h-4 w-4 text-white/60 shrink-0" />
                    ) : (
                      <File className="h-4 w-4 text-white/60 shrink-0" />
                    )
                  )}
                  <span
                    className={cn(
                      "text-sm truncate",
                      file.type === "folder" ? "text-white" : "text-white/60"
                    )}
                  >
                    {file.name}
                  </span>
                </div>
                <span className="text-xs text-white/60">
                  {file.type === "folder" ? "--" : file.size || "--"}
                </span>
                <span className="text-xs text-white/60">{file.modified || "--"}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
            {sortedFiles.map((file) => (
              <div
                key={file.id}
                role="button"
                tabIndex={0}
                onClick={() => onFileClick?.(file.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onFileClick?.(file.id);
                  }
                }}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                {file.icon || (
                  file.type === "folder" ? (
                    <Folder className="h-10 w-10 text-white/60" />
                  ) : (
                    <File className="h-10 w-10 text-white/60" />
                  )
                )}
                <span
                  className={cn(
                    "text-xs text-center truncate w-full mt-2",
                    file.type === "folder" ? "text-white" : "text-white/60"
                  )}
                >
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileManager.displayName = "FileManager";

export { FileManager };
