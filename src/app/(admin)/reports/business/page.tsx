import { Metadata } from 'next';
import ReportsBusinessPage from '@/features/system/analytics/components/admin/reports-business-page';

export const metadata: Metadata = {
  title: 'Báo cáo Kinh doanh | SensorX',
  description: 'Báo cáo thống kê kinh doanh và tỷ lệ chuyển đổi',
};

export default function Page() {
  return <ReportsBusinessPage />;
}
