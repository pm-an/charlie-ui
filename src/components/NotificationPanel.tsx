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
          "rounded-xl border border-border overflow-hidden max-h-[500px] bg-[#0a0a0b] flex flex-col",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-loud">{title}</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-md bg-bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-fg-200">
                {unreadCount}
              </span>
            )}
          </div>
          {onMarkAllRead && unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs text-fg-200 hover:text-text-loud transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto flex-1 focus-visible:outline-none" tabIndex={0}>
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-fg-200">{emptyMessage}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onMarkRead?.(notification.id)}
                className={cn(
                  "px-4 py-3 border-b border-border flex gap-3 cursor-pointer hover:bg-bg-subtle transition-colors group relative",
                  !notification.read && "bg-bg-subtle"
                )}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue" />
                )}

                {/* Avatar / Icon */}
                <div className="h-8 w-8 rounded-full bg-bg-subtle-hover shrink-0 flex items-center justify-center overflow-hidden">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : notification.icon ? (
                    <span className="text-fg-200">{notification.icon}</span>
                  ) : (
                    <span className="text-xs font-medium text-fg-200">
                      {notification.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-loud truncate">
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className="text-xs text-fg-200 mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                  )}
                  <p className="text-xs text-fg-200 mt-1">{notification.timestamp}</p>
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 text-fg-200 hover:text-fg-200 self-start"
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
