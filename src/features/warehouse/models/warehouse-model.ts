export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string; // ISO string with offset from API
  updatedAt?: string | null;
}