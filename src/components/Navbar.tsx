import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../utils/cn";

export interface NavbarLink {
  label: string;
  href: string;
  badge?: string;
}

export interface NavbarProps {
  logo: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  className?: string;
}

function Navbar({ logo, links = [], actions, className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[58px] bg-black/50 backdrop-blur-xl border-b border-white/[0.06]",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">{logo}</div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors font-medium"
            >
              {link.label}
              {link.badge && (
                <span className="ml-1.5 inline-flex items-center rounded-md bg-[rgba(255,99,99,0.15)] text-red text-[10px] px-1.5 py-0.5 font-medium">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Desktop actions + mobile toggle */}
        <div className="flex items-center gap-4">
          {actions && (
            <div className="hidden md:flex items-center gap-3">{actions}</div>
          )}
          <button
            type="button"
            className="md:hidden text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors font-medium py-2.5 min-h-[44px] flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 inline-flex items-center rounded-md bg-[rgba(255,99,99,0.15)] text-red text-[10px] px-1.5 py-0.5 font-medium">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
              {actions && <div className="flex items-center gap-3 pt-2">{actions}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

Navbar.displayName = "Navbar";

export { Navbar };
