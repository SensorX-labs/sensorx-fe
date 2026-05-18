import api from '@/shared/configs/axios-config';
import { OrderStatus } from '@/features/sales/order/enums/order-status';
import { LoadMorePagedQuery, LoadMorePagedResult } from '@/shared/models/load-more.base';

export interface StoreMyOrderItem {
    id: string;
    code: string;
    status: OrderStatus;
    createdAt: string;
    totalAmount: number;
}

export interface StoreOrderParams extends LoadMorePagedQuery {
    status?: string;
}

export const StoreOrderService = {
    /**
     * Lấy danh sách đơn hàng của khách hàng (Storefront)
     */
    getMyOrders: (params: StoreOrderParams) =>
        api.master.get<StoreOrderParams, LoadMorePagedResult<StoreMyOrderItem>>('/orders/my', { params })
};
