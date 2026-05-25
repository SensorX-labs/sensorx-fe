'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  FilePlus2,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await AdminRFQService.getStats();
        if (response) {
          setStatsData(response);
        }
      } catch (error) {
        console.error('>>> Loi khi fetch stats RFQ:', error);
      }
    };

    void loadStats();
  }, [refreshKey]);

  const statItems = useMemo(() => {
    const items = [
      {
        key: 'all',
        label: 'Tong yeu cau',
        value: statsData?.total || 0,
        icon: ClipboardList,
        colorTheme: 'slate' as StatColorTheme,
        isActive: statusFilter === 'all',
        onClick: () => setStatusFilter('all'),
      },
      {
        key: 'pending',
        label: 'Cho tiep nhan',
        value: statsData?.pending || 0,
        icon: Clock,
        colorTheme: 'yellow' as StatColorTheme,
        isActive: statusFilter === RfqStatus.PENDING,
        onClick: () =>
          setStatusFilter(statusFilter === RfqStatus.PENDING ? 'all' : RfqStatus.PENDING),
      },
      {
        key: 'accepted',
        label: 'Da tiep nhan',
        value: statsData?.accepted || 0,
        icon: CheckCircle2,
        colorTheme: 'green' as StatColorTheme,
        isActive: statusFilter === RfqStatus.ACCEPTED,
        onClick: () =>
          setStatusFilter(statusFilter === RfqStatus.ACCEPTED ? 'all' : RfqStatus.ACCEPTED),
      },
      {
        key: 'responded',
        label: 'Da phan hoi',
        value: statsData?.responded || 0,
        icon: MessageSquare,
        colorTheme: 'blue' as StatColorTheme,
        isActive: statusFilter === RfqStatus.RESPONDED,
        onClick: () =>
          setStatusFilter(statusFilter === RfqStatus.RESPONDED ? 'all' : RfqStatus.RESPONDED),
      },
      {
        key: 'converted',
        label: 'Da chot don',
        value: statsData?.converted || 0,
        icon: FilePlus2,
        colorTheme: 'indigo' as StatColorTheme,
        isActive: statusFilter === RfqStatus.CONVERTED,
        onClick: () =>
          setStatusFilter(statusFilter === RfqStatus.CONVERTED ? 'all' : RfqStatus.CONVERTED),
      },
    ];

    if (isManager) {
      items.push({
        key: 'rejected',
        label: 'Khong ai tiep nhan',
        value: statsData?.rejected || 0,
        icon: XCircle,
        colorTheme: 'red' as StatColorTheme,
        isActive: statusFilter === RfqStatus.REJECTED,
        onClick: () =>
          setStatusFilter(statusFilter === RfqStatus.REJECTED ? 'all' : RfqStatus.REJECTED),
      });
    }

    return items;
  }, [statsData, statusFilter, isManager, setStatusFilter]);

  return <StatGroup items={statItems} gridCols={isManager ? 6 : 5} variant="pill" />;
};
