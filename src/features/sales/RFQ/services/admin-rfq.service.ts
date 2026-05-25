import api from '@/shared/configs/axios-config';
import { OffsetPagedQuery, OffsetPagedResult } from '@/shared/models/offset-page.base';
import { RfqStatus } from '../constants/rfq-status';

export const AdminRFQService = {
  assignStaff: (id: string, staffId: string) =>
    api.master.post<unknown, void>(`/rfq/force-assign`, { Id: id, StaffId: staffId }),

  acceptRFQ: (id: string) =>
    api.master.post<unknown, void>(`/rfq/accept`, { Id: id }),

    rejectRFQ: (id: string, reason: string) =>
        api.master.post<any, void>(`/rfq/reject`, { Id: id, Reason: reason }),

  getListRFQ: (params: RfqFilter) =>
    api.master.get<unknown, OffsetPagedResult<RfqListItem>>('/rfq', { params }),

  getDetailRFQ: (id: string) =>
    api.master.get<unknown, RfqDetail>(`/rfq/${id}`),

  getStats: () =>
    api.master.get<unknown, RfqStats>('/rfq/stats'),
};

export interface RfqFilter extends OffsetPagedQuery {
  status?: RfqStatus;
  code?: string;
  companyName?: string;
  recipientName?: string;
  recipientPhone?: string;
  staffName?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface RfqStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  responded: number;
  converted: number;
}

export interface RfqListItem {
  id: string;
  code: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  createdAt: string;
  updatedAt?: string;
  staffId?: string;
  staffName?: string;
  itemCount: number;
}

export interface RfqItem {
  id?: string;
  productId?: string;
  productCode: string;
  productName: string;
  manufacturer?: string;
  unit: string;
  quantity: number;
  category?: string;
}

export interface RfqDetailItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  manufacturer: string;
  unit: string;
}

export interface RfqDetail {
    id: string;
    code: string;
    staffId: string | null;
    staffName: string | null;
    customerId: string;
    status: RfqStatus;
    createdAt: string;
    updatedAt: string | null;
    // Company Info
    companyName: string;
    phone: string;
    email: string;
    address: string;
    taxCode: string;
    allocationLogs?: AllocationLogEntry[];
    rejectedLogs?: RejectedLogEntry[];
    items: RfqDetailItem[];
}

export interface AllocationSnapshot {
    staffId: string;
    staffName: string;
    aggregatedSkillScore: number;
    currentWorkload: number;
    idleHours: number;
    finalScore: number;
}

export interface AllocationLogEntry {
    round: number;
    assignedAt: string;
    snapshotJson: string;
}

export interface RejectedLogEntry {
    staffId: string;
    reason: string;
    rejectedAt: string;
}