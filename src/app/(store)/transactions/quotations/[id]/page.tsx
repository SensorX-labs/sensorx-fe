'use client';

import { useParams, useRouter } from 'next/navigation';
import { QuotationDetailView } from '@/features/sales/quotation/components/store/quotation-detail-view';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <div className="min-h-screen bg-page-background">
            <StoreBreadcrumb 
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Cửa hàng', href: '/shop' },
                    { label: 'Giao dịch', href: '/transactions?tab=quotes' },
                    { label: 'Chi tiết báo giá' }
                ]}
                backLink="/transactions?tab=quotes"
                backLabel="Quay lại danh sách"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <QuotationDetailView quotationId={id} onBack={() => router.push('/transactions?tab=quotes')} />
            </div>
        </div>
    );
}
