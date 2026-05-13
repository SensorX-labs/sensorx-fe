'use client';

import { useParams, useRouter } from 'next/navigation';
import { RfqDetailView } from '@/features/store/transactions/rfqs/components/rfq-detail-view';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

export default function RfqDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <div className="min-h-screen bg-page-background">
            <StoreBreadcrumb 
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Cửa hàng', href: '/shop' },
                    { label: 'Giao dịch', href: '/transactions?tab=rfqs' },
                    { label: 'Chi tiết yêu cầu' }
                ]}
                backLink="/transactions?tab=rfqs"
                backLabel="Quay lại danh sách"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <RfqDetailView rfqId={id} onBack={() => router.push('/transactions?tab=rfqs')} />
            </div>
        </div>
    );
}
