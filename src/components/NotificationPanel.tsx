import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { X } from "lucide-react";

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read?: boolean;
  icon?: ReactNode;
  href?: string;
  avatar?: string;
};

export type NotificationPanelProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  notifications: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  title?: string;
  emptyMessage?: string;
};

const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(
  (
    {
      className,
      notifications,
      onMarkRead,
      onMarkAllRead,
      onDismiss,
      title = "Notifications",
      emptyMessage = "No notifications",
      ...props
    },
    ref
  ) => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
      <div
        ref={ref}
        data-slot="notification-panel"
        className={cn(
          "rounded-xl border border-white/[0.06] overflow-hidden max-h-[500px] bg-[#0a0a0b] flex flex-col",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">
                {unreadCount}
              </span>
            )}
          </div>
          {onMarkAllRead && unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-white/60">{emptyMessage}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => onMarkRead?.(notification.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onMarkRead?.(notification.id);
                  }
                }}
                className={cn(
                  "px-4 py-3 border-b border-white/[0.06] flex gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors group relative",
                  !notification.read && "bg-white/[0.02]"
                )}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue" />
                )}

                {/* Avatar / Icon */}
                <div className="h-8 w-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : notification.icon ? (
                    <span className="text-white/60">{notification.icon}</span>
                  ) : (
                    <span className="text-xs font-medium text-white/60">
                      {notification.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className="text-xs text-white/60 mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                  )}
                  <p className="text-xs text-white/60 mt-1">{notification.timestamp}</p>
                </div>

                {/* Dismiss button */}
                {onDismiss && (
                  <button
                    type="button"
                    aria-label={`Dismiss ${notification.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notification.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 text-white/60 hover:text-white/60 self-start"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

NotificationPanel.displayName = "NotificationPanel";

export { NotificationPanel };
