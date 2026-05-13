'use client';

import { useParams, useRouter } from 'next/navigation';
import { OrderDetailView } from '@/features/store/transactions/orders/components/order-detail-view';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <div className="min-h-screen bg-page-background">
            <StoreBreadcrumb 
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Cửa hàng', href: '/shop' },
                    { label: 'Giao dịch', href: '/transactions?tab=orders' },
                    { label: 'Chi tiết đơn hàng' }
                ]}
                backLink="/transactions?tab=orders"
                backLabel="Quay lại danh sách"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <OrderDetailView orderId={id} onBack={() => router.push('/transactions?tab=orders')} />
            </div>
        </div>
    );
}
