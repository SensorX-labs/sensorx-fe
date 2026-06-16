import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/shared/components/shadcn-ui/sheet';
import { NotificationPayload } from '@/shared/hooks/use-notifications';
import { FileText, CheckCircle, ShoppingCart, Package, Bell, Inbox, CheckCheck, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/shared/utils';

interface NotificationDrawerProps {
  children: React.ReactNode;
  unreadCount: number;
  notifications: NotificationPayload[];
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  children,
  unreadCount,
  notifications,
  loading,
  markAsRead,
  markAllAsRead,
  fetchNotifications
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Get matching icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'rfq':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'quote':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-violet-500" />;
      case 'warehouse':
        return <Package className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notif: NotificationPayload) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setOpen(false);
    router.push(notif.targetUrl);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val) {
        fetchNotifications();
      }
    }}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white border-l border-gray-200">
        <SheetHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex flex-col">
            <SheetTitle className="text-xl font-bold text-gray-900">Thông báo</SheetTitle>
            <SheetDescription className="text-xs text-gray-500 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc
            </SheetDescription>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Đọc tất cả
            </button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-sm">Đang tải thông báo...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <Inbox className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-[15px]">Hộp thư trống</p>
                <p className="text-xs text-gray-400 mt-1">Bạn chưa nhận được thông báo nào từ hệ thống.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "flex gap-4 p-5 hover:bg-gray-50/80 transition-colors cursor-pointer relative group border-l-2",
                    notif.isRead ? "border-l-transparent" : "border-l-blue-500 bg-blue-50/10"
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[14px] leading-snug text-gray-900 truncate-2-lines",
                      notif.isRead ? "font-normal" : "font-semibold"
                    )}>
                      {notif.title}
                    </p>
                    <p className="text-[13px] text-gray-500 mt-1 leading-relaxed break-words">
                      {notif.content}
                    </p>
                    <span className="text-[11px] text-gray-400 font-medium mt-2 block">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
