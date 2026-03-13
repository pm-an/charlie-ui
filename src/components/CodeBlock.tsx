import { type HTMLAttributes, useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../utils/cn";

export type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  language?: string;
  showCopy?: boolean;
  code?: string;
};

function CodeBlock({
  className,
  language,
  showCopy = true,
  code,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = code ?? (typeof children === "string" ? children : "");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code, children]);

  return (
    <div className="relative group">
      {(language || showCopy) && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {language && (
            <span className="text-xs text-white/40">{language}</span>
          )}
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "p-1 rounded text-white/40 hover:text-white/70",
                "transition-colors duration-200",
                "opacity-0 group-hover:opacity-100"
              )}
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}
      <pre
        className={cn(
          "bg-grey-800 border border-white/6 rounded-lg p-4",
          "font-mono text-sm text-white/80",
          "whitespace-pre-wrap overflow-x-auto",
          className
        )}
        {...props}
      >
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
