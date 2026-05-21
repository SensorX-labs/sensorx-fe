'use client';

import { User } from 'lucide-react';
import { CustomerInfoResponse } from '../../../models/quote-detail-response';

interface CustomerInfoCardProps {
    customerInfo?: CustomerInfoResponse;
}

export function CustomerInfoCard({ customerInfo }: CustomerInfoCardProps) {
    const companyName = customerInfo?.companyName || '—';
    const taxCode = customerInfo?.taxCode || '—';
    const phone = customerInfo?.phone || '—';
    const email = customerInfo?.email || '—';
    const address = customerInfo?.address || '—';

    return (
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-900">Thông tin khách hàng</h4>
            </div>
            <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Công ty</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{companyName}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-3 admin-text-primary font-semibold">Mã số thuế</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{taxCode}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-3 admin-text-primary font-semibold">Số điện thoại</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{phone}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-3 admin-text-primary font-semibold">Email</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{email}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-3 admin-text-primary font-semibold">Địa chỉ</td>
                        <td className="px-6 py-3 font-medium text-gray-600 text-xs italic">{address}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
