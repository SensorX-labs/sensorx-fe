'use client';

import { useParams, useRouter } from 'next/navigation';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import QuotationDetailView from '@/features/store/Components/transactions/detail-quotation';

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
            <QuotationDetailView quotationId={id} onBack={() => router.push('/transactions?tab=quotes')} />
        </div>
    );
}
