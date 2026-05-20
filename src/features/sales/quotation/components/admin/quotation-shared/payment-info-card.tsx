'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn-ui/select';
import { paymentMethodLabel, paymentTermLabel } from './constants';

interface PaymentInfoCardProps {
  paymentMethod: string;
  paymentTerm: string;
  onPaymentMethodChange?: (val: string) => void;
  onPaymentTermChange?: (val: string) => void;
  disabled?: boolean;
}

export function PaymentInfoCard({
  paymentMethod,
  paymentTerm,
  onPaymentMethodChange,
  onPaymentTermChange,
  disabled = false,
}: PaymentInfoCardProps) {
  return (
    <div className="border border-gray-200 bg-white rounded">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <DollarSign size={16} className="text-gray-400" />
        <h4 className="text-sm font-medium text-gray-900">Thanh toán</h4>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500">Phương thức</label>
          {disabled ? (
            <p className="text-sm font-medium text-gray-900">
              {paymentMethodLabel[paymentMethod] || paymentMethod || '—'}
            </p>
          ) : (
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger className="h-10 text-sm border-gray-200 rounded disabled:opacity-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentMethodLabel).map(([val, label]) => (
                  <SelectItem key={val} value={val} className="text-sm">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500">Hạn mức</label>
          {disabled ? (
            <p className="text-sm font-medium text-gray-900">
              {paymentTermLabel[paymentTerm] || paymentTerm || '—'}
            </p>
          ) : (
            <Select value={paymentTerm} onValueChange={onPaymentTermChange}>
              <SelectTrigger className="h-10 text-sm border-gray-200 rounded disabled:opacity-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentTermLabel).map(([val, label]) => (
                  <SelectItem key={val} value={val} className="text-sm">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
