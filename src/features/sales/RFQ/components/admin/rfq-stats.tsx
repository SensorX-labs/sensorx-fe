'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, FilePlus2, XCircle, MessageSquare } from 'lucide-react';
import { StatCard } from '@/shared/components/admin/stat-card/stat-card';
import { RfqStatus } from '../../constants/rfq-status';
import { AdminRFQService, RfqStats } from '../../services/admin-rfq.service';
import { CanAccess } from '@/shared/components/common/can-access';

import { useUser } from '@/shared/hooks/use-user';

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
  const { user } = useUser();
  const isManager = user?.role === 'Manager';

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
    <div className={`grid grid-cols-2 ${isManager ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-4`}>
      <StatCard
        label="Tổng yêu cầu"
        value={statsData?.total || 0}
        icon={ClipboardList}
        color="bg-slate-50 text-slate-600"
        borderColor="border-slate-100"
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
        color="bg-brand-green-50 text-brand-green-600"
        borderColor="border-brand-green-100"
        isActive={statusFilter === RfqStatus.ACCEPTED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.ACCEPTED ? 'all' : RfqStatus.ACCEPTED)}
      />
      <StatCard
        label="Đã phản hồi"
        value={statsData?.responded || 0}
        icon={MessageSquare}
        color="bg-blue-50 text-blue-600"
        borderColor="border-blue-100"
        isActive={statusFilter === RfqStatus.RESPONDED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.RESPONDED ? 'all' : RfqStatus.RESPONDED)}
      />
      <StatCard
        label="Đã chốt đơn"
        value={statsData?.converted || 0}
        icon={FilePlus2}
        color="bg-indigo-50 text-indigo-600"
        borderColor="border-indigo-100"
        isActive={statusFilter === RfqStatus.CONVERTED}
        onClick={() => setStatusFilter(statusFilter === RfqStatus.CONVERTED ? 'all' : RfqStatus.CONVERTED)}
      />
      <CanAccess roles={["Manager"]}>
        <StatCard
          label="Không ai tiếp nhận"
          value={statsData?.rejected || 0}
          icon={XCircle}
          color="bg-rose-50 text-rose-600"
          borderColor="border-rose-100"
          isActive={statusFilter === RfqStatus.REJECTED}
          onClick={() => setStatusFilter(statusFilter === RfqStatus.REJECTED ? 'all' : RfqStatus.REJECTED)}
        />
      </CanAccess>
    </div>
  );
};
