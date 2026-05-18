import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";
import { LoadMorePagedQuery, LoadMorePagedResult } from "@/shared/models/load-more.base";
import ImageService from "@/shared/services/image.service";

export const StaffService = {
  getPagedStaffs: (params: StaffFilter) =>
    api.data.get<any, OffsetPagedResult<StaffListItem>>(`/staff/list`, { params }),

  getStaffById: (id: string) =>
    api.data.get<any, StaffListItem>(`/staff/${id}`),

  getProfile: () =>
    api.data.get<any, ProfileStaff>(`/staff/profile`),

  getLoadMoreStaff: (params: LoadMoreStaffQuery) =>
    api.master.get<any, LoadMorePagedResult<LoadMoreStaff>>(`/rfq/load-more-sale-staff`, { params }),

  updateProfile: (data: UpdateProfileData) =>
    api.data.put<any, any>(`/staff/profile`, data),

  updateStaffAvatar: async (avatar: File) => {
    const avatarUrl = await ImageService.upload(avatar, "avatars");
    return api.data.put<any, any>(`/staff/update-avatar`, { avatar: avatarUrl });
  },

  getStaffListStats: () =>
    api.data.get<any, StaffListStats>(`/staff/list-stats`),

  changeStaffStatus: (id: string, status: StaffStatus) =>
    api.data.put<any, any>(`/staff/${id}/status`, { status }),
};

export default StaffService;

export enum StaffStatus {
  Active = "Active",
  OnLeave = "OnLeave",
  Resigned = "Resigned",
}

export interface StaffListItem {
  id: string;
  accountId: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  citizenId: string;
  biography: string;
  joinDate: string;
  department: string;
  status: StaffStatus;
  createdAt: string;
}

export interface StaffFilter extends OffsetPagedQuery {
  status?: StaffStatus;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
  email: string;
  citizenId?: string;
  biography?: string;
}

export interface StaffListStats {
  totalCount: number;
  activeCount: number;
  onLeaveCount: number;
  resignedCount: number;
}
export interface ProfileStaff {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  citizenId: string;
  biography: string;
  joinDate: string;
  department: string;
  status: StaffStatus;
  createdAt: string;
  avatarUrl: string | null;
}

export interface LoadMoreStaffQuery extends LoadMorePagedQuery {
}

export interface LoadMoreStaff {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}