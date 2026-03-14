import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type ProfileStat = {
  label: string;
  value: string | number;
};

export type ProfileSectionProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  name: string;
  role?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  stats?: ProfileStat[];
  actions?: ReactNode;
};

const ProfileSection = forwardRef<HTMLDivElement, ProfileSectionProps>(
  (
    {
      className,
      name,
      role,
      avatar,
      coverImage,
      bio,
      stats,
      actions,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="profile-section"
        className={cn("w-full", className)}
        {...props}
      >
        {/* Cover image area */}
        <div
          data-slot="profile-cover"
          className={cn(
            "h-32 md:h-48 w-full relative",
            !coverImage &&
              "bg-gradient-to-r from-white/5 to-white/[0.02]"
          )}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          )}

          {/* Actions positioned top-right on desktop */}
          {actions && (
            <div
              data-slot="profile-actions"
              className="hidden md:flex absolute top-4 right-4 gap-2"
            >
              {actions}
            </div>
          )}
        </div>

        {/* Profile info area */}
        <div data-slot="profile-info" className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex items-end gap-4">
            <div
              data-slot="profile-avatar"
              className="h-24 w-24 rounded-full border-4 border-[#0a0a0b] bg-white/10 shrink-0 overflow-hidden flex items-center justify-center"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white/70">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Name + Role */}
          <div>
            <h2
              data-slot="profile-name"
              className="text-xl font-bold text-white"
            >
              {name}
            </h2>
            {role && (
              <p data-slot="profile-role" className="text-sm text-white/70">
                {role}
              </p>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p
              data-slot="profile-bio"
              className="text-sm text-white/70 mt-2 max-w-xl"
            >
              {bio}
            </p>
          )}

          {/* Mobile actions */}
          {actions && (
            <div
              data-slot="profile-actions-mobile"
              className="md:hidden flex gap-2 mt-4"
            >
              {actions}
            </div>
          )}

          {/* Stats row */}
          {stats && stats.length > 0 && (
            <div data-slot="profile-stats" className="flex gap-6 mt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProfileSection.displayName = "ProfileSection";

export { ProfileSection };
