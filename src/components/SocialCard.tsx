import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const socialCardVariants = cva(
  "rounded-xl p-4 md:p-6 overflow-hidden relative block transition-colors",
  {
    variants: {
      color: {
        red: "bg-gradient-to-br from-red/20 to-red/5",
        blue: "bg-gradient-to-br from-blue/20 to-blue/5",
        purple: "bg-gradient-to-br from-purple/20 to-purple/5",
        orange: "bg-gradient-to-br from-orange/20 to-orange/5",
      },
    },
    defaultVariants: {
      color: "red",
    },
  }
);

export type SocialCardProps = Omit<VariantProps<typeof socialCardVariants>, "color"> & {
  icon: ReactNode;
  title: string;
  description: string;
  color: "red" | "blue" | "purple" | "orange";
  href?: string;
  className?: string;
};

function SocialCard({
  icon,
  title,
  description,
  color,
  href,
  className,
}: SocialCardProps) {
  const content = (
    <>
      <div className="w-8 h-8 mb-3">{icon}</div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-white/60 text-sm mt-2">{description}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(socialCardVariants({ color }), className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn(socialCardVariants({ color }), className)}>
      {content}
    </div>
  );
}

SocialCard.displayName = "SocialCard";

export { SocialCard, socialCardVariants };
