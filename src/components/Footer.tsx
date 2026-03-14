import { type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo: ReactNode;
  columns: FooterColumn[];
  bottom?: ReactNode;
  className?: string;
}

function Footer({ logo, columns, bottom, className }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn("border-t border-white/[0.06]", className)}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Logo */}
        <div className="mb-10">{logo}</div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white text-sm font-semibold mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/70 text-sm hover:text-white transition-colors inline-block py-1"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 inline ml-1" aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        {bottom && (
          <div className="border-t border-white/[0.06] pt-6 mt-12 text-white/70 text-xs">
            {bottom}
          </div>
        )}
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";

export { Footer };
