import { useState, useEffect, useCallback, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType, HubConnectionState } from '@microsoft/signalr';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { GATEWAY_URL } from '@/shared/constants/environment';

export interface NotificationPayload {
  id: string;
  title: string;
  content: string;
  type: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const connectionRef = useRef<HubConnection | null>(null);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await fetch(`${GATEWAY_URL}/api/master/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.isSuccess) {
          setUnreadCount(result.value);
        }
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Fetch latest notifications
  const fetchNotifications = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${GATEWAY_URL}/api/master/notifications?pageSize=20&pageNumber=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.isSuccess && result.value?.items) {
          setNotifications(result.value.items);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await fetch(`${GATEWAY_URL}/api/master/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchUnreadCount]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await fetch(`${GATEWAY_URL}/api/master/notifications/read-all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Set up SignalR connection
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    // Fetch initial count and list
    fetchUnreadCount();
    fetchNotifications();

    const connection = new HubConnectionBuilder()
      .withUrl(`${GATEWAY_URL}/hubs/notifications`, {
        accessTokenFactory: () => token,
        transport: HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveNotification', (payload: NotificationPayload) => {
      console.log('New notification received:', payload);
      
      // Update count & notifications list
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [payload, ...prev].slice(0, 20));

      // Trigger Sonner Toast
      toast.info(payload.title, {
        description: payload.content,
        action: {
          label: 'Xem',
          onClick: () => {
            window.location.href = payload.targetUrl;
          },
        },
      });
    });

    const startConnection = async () => {
      try {
        await connection.start();
        setIsConnected(true);
        console.log('SignalR NotificationHub connected successfully');
      } catch (error) {
        console.error('Error starting SignalR NotificationHub:', error);
      }
    };

    startConnection();

    return () => {
      if (connection.state === HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [fetchUnreadCount, fetchNotifications]);

  return {
    unreadCount,
    notifications,
    loading,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
