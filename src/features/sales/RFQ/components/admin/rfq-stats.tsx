'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardList, Clock, CheckCircle2, FilePlus2, XCircle, MessageSquare } from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { RfqStatus } from '../../constants/rfq-status';
import { AdminRFQService, RfqStats } from '../../services/admin-rfq.service';
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

  const statItems = useMemo(() => {
    const items = [
      {
        key: 'all',
        label: 'Tổng yêu cầu',
        value: statsData?.total || 0,
        icon: ClipboardList,
        colorTheme: 'slate' as any,
        isActive: statusFilter === 'all',
        onClick: () => setStatusFilter('all'),
      },
      {
        key: 'pending',
        label: 'Chờ tiếp nhận',
        value: statsData?.pending || 0,
        icon: Clock,
        colorTheme: 'yellow' as any,
        isActive: statusFilter === RfqStatus.PENDING,
        onClick: () => setStatusFilter(statusFilter === RfqStatus.PENDING ? 'all' : RfqStatus.PENDING),
      },
      {
        key: 'accepted',
        label: 'Đã tiếp nhận',
        value: statsData?.accepted || 0,
        icon: CheckCircle2,
        colorTheme: 'green' as any,
        isActive: statusFilter === RfqStatus.ACCEPTED,
        onClick: () => setStatusFilter(statusFilter === RfqStatus.ACCEPTED ? 'all' : RfqStatus.ACCEPTED),
      },
      {
        key: 'responded',
        label: 'Đã phản hồi',
        value: statsData?.responded || 0,
        icon: MessageSquare,
        colorTheme: 'blue' as any,
        isActive: statusFilter === RfqStatus.RESPONDED,
        onClick: () => setStatusFilter(statusFilter === RfqStatus.RESPONDED ? 'all' : RfqStatus.RESPONDED),
      },
      {
        key: 'converted',
        label: 'Đã chốt đơn',
        value: statsData?.converted || 0,
        icon: FilePlus2,
        colorTheme: 'indigo' as any,
        isActive: statusFilter === RfqStatus.CONVERTED,
        onClick: () => setStatusFilter(statusFilter === RfqStatus.CONVERTED ? 'all' : RfqStatus.CONVERTED),
      },
    ];

    if (isManager) {
      items.push({
        key: 'rejected',
        label: 'Không ai tiếp nhận',
        value: statsData?.rejected || 0,
        icon: XCircle,
        colorTheme: 'red' as any,
        isActive: statusFilter === RfqStatus.REJECTED,
        onClick: () => setStatusFilter(statusFilter === RfqStatus.REJECTED ? 'all' : RfqStatus.REJECTED),
      });
    }

    return items;
  }, [statsData, statusFilter, isManager, setStatusFilter]);

  return (
    <StatGroup
      items={statItems}
      gridCols={isManager ? 6 : 5}
      variant='pill'
    />
  );
};
