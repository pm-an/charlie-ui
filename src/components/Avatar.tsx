import { type ImgHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const avatarVariants = cva(
  "relative inline-flex shrink-0 rounded-full overflow-hidden bg-white/10 items-center justify-center",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const fallbackTextVariants = cva("font-medium text-white/60 leading-none select-none", {
  variants: {
    size: {
      xs: "text-[10px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const statusDotVariants = cva(
  "absolute bottom-0 right-0 rounded-full border-2 border-bg",
  {
    variants: {
      status: {
        online: "bg-green",
        offline: "bg-grey-300",
        busy: "bg-red",
      },
      size: {
        xs: "h-2 w-2",
        sm: "h-2.5 w-2.5",
        md: "h-3 w-3",
        lg: "h-3 w-3",
        xl: "h-3.5 w-3.5",
      },
    },
    defaultVariants: {
      status: "online",
      size: "md",
    },
  }
);

export type AvatarProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> &
  VariantProps<typeof avatarVariants> & {
    src?: string;
    alt: string;
    fallback?: string;
    status?: "online" | "offline" | "busy";
  };

function Avatar({
  className,
  size = "md",
  src,
  alt,
  fallback,
  status,
  ...props
}: AvatarProps) {
  return (
    <span data-slot="avatar" className={cn(avatarVariants({ size }), className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <span className={cn(fallbackTextVariants({ size }))}>
          {fallback ?? alt.charAt(0).toUpperCase()}
        </span>
      )}
      {status && (
        <span className={cn(statusDotVariants({ status, size }))} />
      )}
    </span>
  );
}

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
