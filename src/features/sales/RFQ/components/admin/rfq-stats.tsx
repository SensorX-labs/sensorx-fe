'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, FilePlus2, XCircle } from 'lucide-react';
import { StatCard } from '@/shared/components/admin/stat-card/stat-card';
import { RfqStatus } from '../../constants/rfq-status';
import { AdminRFQService, RfqStats } from '../../services/admin-rfq.service';

interface RfqStatsProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  refreshKey?: number;
}

export const RfqStatsSection: React.FC<RfqStatsProps> = ({
  statusFilter,
  setStatusFilter,
  refreshKey = 0,
}) => {
  const [statsData, setStatsData] = useState<RfqStats | null>(null);

  const fetchStats = async () => {
    try {
      const response = await AdminRFQService.getStats();
      if (response) {
        setStatsData(response);
      }
    } catch (error) {
      console.error(">>> Lỗi khi fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Tổng yêu cầu"
        value={statsData?.total || 0}
        icon={ClipboardList}
        color="bg-blue-50 text-blue-600"
        borderColor="border-blue-100"
        isActive={statusFilter === 'all'}
        onClick={() => setStatusFilter('all')}
      />
      <StatCard
        label="Chờ tiếp nhận"
        value={statsData?.pending || 0}
        icon={Clock}
        color="bg-amber-50 text-amber-600"
        borderColor="border-amber-100"
        isActive={statusFilter === RfqStatus.PENDING}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.PENDING ? 'all' : RfqStatus.PENDING)}
      />
      <StatCard
        label="Đã tiếp nhận"
        value={statsData?.accepted || 0}
        icon={CheckCircle2}
        color="bg-indigo-50 text-indigo-600"
        borderColor="border-indigo-100"
        isActive={statusFilter === RfqStatus.ACCEPTED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.ACCEPTED ? 'all' : RfqStatus.ACCEPTED)}
      />
      <StatCard
        label="Đã sinh báo giá"
        value={statsData?.converted || 0}
        icon={FilePlus2}
        color="bg-emerald-50 text-emerald-600"
        borderColor="border-emerald-100"
        isActive={statusFilter === RfqStatus.CONVERTED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.CONVERTED ? 'all' : RfqStatus.CONVERTED)}
      />
      <StatCard
        label="Đã từ chối"
        value={statsData?.rejected || 0}
        icon={XCircle}
        color="bg-rose-50 text-rose-600"
        borderColor="border-rose-100"
        isActive={statusFilter === RfqStatus.REJECTED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.REJECTED ? 'all' : RfqStatus.REJECTED)}
      />
    </div>
  );
};
