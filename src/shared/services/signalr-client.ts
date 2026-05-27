import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType, HubConnectionState } from '@microsoft/signalr';
import Cookies from 'js-cookie';
import { GATEWAY_URL } from '@/shared/constants/environment';

type PaymentStatusChangedCallback = (orderId: string, paymentStatus: string, paymentAmount?: number) => void;

class SignalRClient {
  private connection: HubConnection | null = null;
  private connectPromise: Promise<void> | null = null;
  private url: string;
  private onPaymentStatusChanged: PaymentStatusChangedCallback | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelayMs = 3000;

  constructor(hubUrl: string = `${GATEWAY_URL}/hubs/payment`) {
    this.url = hubUrl;
  }

  /**
   * Initialize SignalR connection
   */
  async connect(): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      // Already connected
      return;
    }

    if (this.connectPromise) {
      await this.connectPromise;
      return;
    }

    this.connectPromise = (async () => {
      const token = Cookies.get('token');
      
      this.connection = new HubConnectionBuilder()
        .withUrl(this.url, {
          accessTokenFactory: () => token || '',
          transport: HttpTransportType.LongPolling,
          withCredentials: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (context) => {
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
              console.warn('Max reconnect attempts reached');
              return null; // Stop trying
            }
            this.reconnectAttempts++;
            return this.reconnectDelayMs * Math.pow(2, Math.min(this.reconnectAttempts, 3));
          },
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Handle connection events
      this.connection.onreconnected((connectionId?: string) => {
        console.log('SignalR reconnected:', connectionId);
        this.reconnectAttempts = 0;
      });

      this.connection.onreconnecting((error?: Error) => {
        console.warn('SignalR reconnecting...', error?.message);
      });

      this.connection.onclose((error?: Error) => {
        console.warn('SignalR connection closed', error?.message);
      });

      // Setup event listeners
      this.setupEventListeners();

      await this.connection.start();
      console.log('SignalR connected successfully');
      this.reconnectAttempts = 0;
    })();

    try {
      await this.connectPromise;
    } catch (error) {
      console.error('SignalR connection failed:', error);
      throw error;
    } finally {
      this.connectPromise = null;
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      }
    }
  }

  /**
   * Subscribe to payment updates for a specific order
   */
  async subscribeToOrder(orderId: string): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      console.warn('SignalR not connected. Attempting to connect...');
      await this.connect();
    }

    try {
      await this.connection?.invoke('SubscribeToOrderPaymentUpdates', orderId);
      console.log(`Subscribed to order updates: ${orderId}`);
    } catch (error) {
      console.error('Error subscribing to order:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from payment updates for a specific order
   */
  async unsubscribeFromOrder(orderId: string): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection?.invoke('UnsubscribeFromOrderPaymentUpdates', orderId);
      console.log(`Unsubscribed from order updates: ${orderId}`);
    } catch (error) {
      console.error('Error unsubscribing from order:', error);
    }
  }

  /**
   * Register callback for payment status changes
   */
  onPaymentStatusUpdate(callback: PaymentStatusChangedCallback): void {
    this.onPaymentStatusChanged = callback;
  }

  /**
   * Setup server-to-client event listeners
   */
  private setupEventListeners(): void {
    if (!this.connection) return;

    // Listen for payment status changes from server
    this.connection.on('PaymentStatusChanged', (orderId: string, paymentStatus: string, paymentAmount?: number) => {
      console.log(`Payment status changed - Order: ${orderId}, Status: ${paymentStatus}`);
      if (this.onPaymentStatusChanged) {
        this.onPaymentStatusChanged(orderId, paymentStatus, paymentAmount);
      }
    });

    // Listen for payment received notifications
    this.connection.on('PaymentReceived', (orderId: string, amount: number, newStatus: string) => {
      console.log(`Payment received - Order: ${orderId}, Amount: ${amount}, New Status: ${newStatus}`);
      if (this.onPaymentStatusChanged) {
        this.onPaymentStatusChanged(orderId, newStatus, amount);
      }
    });
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  /**
   * Get connection state
   */
  getConnectionState(): HubConnectionState | null {
    return this.connection?.state ?? null;
  }
}

// Export singleton instance
export const signalRClient = new SignalRClient(
  process.env.NEXT_PUBLIC_SIGNALR_URL || `${GATEWAY_URL}/hubs/payment`
);

export type { PaymentStatusChangedCallback };
export default SignalRClient;
