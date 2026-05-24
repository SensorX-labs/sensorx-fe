'use client';

import { useContext } from 'react';
import { PaymentHubContext } from '../contexts/PaymentHubContext';

export function usePaymentHub() {
  const context = useContext(PaymentHubContext);
  
  if (!context) {
    throw new Error('usePaymentHub must be used within PaymentHubProvider');
  }
  
  return context;
}
