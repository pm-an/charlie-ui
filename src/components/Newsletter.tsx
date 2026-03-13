import { type FormEvent, useState } from "react";
import { cn } from "../utils/cn";

export interface NewsletterProps {
  title: string;
  description: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function Newsletter({ title, description, onSubmit, className }: NewsletterProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim()) {
      onSubmit?.(email.trim());
      setEmail("");
    }
  }

  return (
    <div
      className={cn(
        "bg-card-gradient rounded-xl border border-white/[0.06] p-5 md:p-8 text-center",
        className
      )}
    >
      <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-6">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full md:flex-1 bg-white/5 border border-white/[0.06] rounded-md h-11 px-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/15 transition-colors"
        />
        <button
          type="submit"
          className="w-full md:w-auto bg-white text-[#18191a] rounded-md h-11 px-4 text-sm font-medium hover:bg-white/90 transition-colors cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

Newsletter.displayName = "Newsletter";

export { Newsletter };
