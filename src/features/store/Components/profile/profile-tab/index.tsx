import React from 'react';
import { BusinessInfoSection } from './business-info-section';
import { ShippingInfoSection } from './shipping-info-section';
import { ShippingInfo, CustomerDetail } from '@/features/store/services/store-customer.service';

export interface ProfileTabProps {
    customerData: CustomerDetail | null | undefined;
    onRefresh: () => void;
}

export function ProfileTab({ customerData, onRefresh }: ProfileTabProps) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <BusinessInfoSection customerData={customerData} onRefresh={onRefresh} />
            <ShippingInfoSection customerId={customerData?.id} shippingInfo={customerData?.shippingInfo} onRefresh={onRefresh} />
        </div>
    );
};