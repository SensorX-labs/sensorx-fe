'use client';

import React, { createContext, useCallback, useMemo, useState, ReactNode } from 'react';
import { signalRClient } from '../services/signalr-client';

interface PaymentUpdate {
  orderId: string;
  paymentStatus: string;
  paymentAmount?: number;
  timestamp: number;
}

interface PaymentHubContextType {
  isConnected: boolean;
  lastUpdate: PaymentUpdate | null;
  subscribeToOrder: (orderId: string) => Promise<void>;
  unsubscribeFromOrder: (orderId: string) => Promise<void>;
}

export const PaymentHubContext = createContext<PaymentHubContextType | undefined>(undefined);

export function PaymentHubProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<PaymentUpdate | null>(null);

  const subscribeToOrder = useCallback(async (orderId: string) => {
    if (!isConnected) {
      await signalRClient.connect();
      setIsConnected(true);

      signalRClient.onPaymentStatusUpdate((orderId, paymentStatus, paymentAmount) => {
        setLastUpdate({
          orderId,
          paymentStatus,
          paymentAmount,
          timestamp: Date.now(),
        });
      });
    }

    await signalRClient.subscribeToOrder(orderId);
  }, [isConnected]);

  const unsubscribeFromOrder = useCallback(async (orderId: string) => {
    await signalRClient.unsubscribeFromOrder(orderId);
  }, []);

  const contextValue = useMemo(() => ({
    isConnected,
    lastUpdate,
    subscribeToOrder,
    unsubscribeFromOrder,
  }), [isConnected, lastUpdate, subscribeToOrder, unsubscribeFromOrder]);

  return (
    <PaymentHubContext.Provider value={contextValue}>
      {children}
    </PaymentHubContext.Provider>
  );
}
