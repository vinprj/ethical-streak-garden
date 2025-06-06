
import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  Clock,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications, Notification } from "@/hooks/useNotifications";

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotifications();
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>No notifications</p>
            <p className="text-xs mt-1">Complete habits to see updates here!</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-0.5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 transition-colors hover:bg-muted/50",
                    !notification.read && "bg-muted/30"
                  )}
                >
                  <div className="mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground mt-1 hover:text-foreground"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <Separator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full" disabled>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
