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

interface GetPageListOrderResponse {
    id: string;
    quoteId: string;
    code: string;
    customerId: string;
    recipientName: string;
    companyName: string;
    status: string;
    orderDate: string;
    grandTotal: number;
    itemCount: number;
    createdAt: string;
}

export const StoreOrderService = {
    /**
     * Lấy danh sách đơn hàng của khách hàng (Storefront)
     */
    getMyOrders: async (params: StoreOrderParams) => {
        const response = await api.master.get<StoreOrderParams, LoadMorePagedResult<GetPageListOrderResponse>>('/orders/my', { params });
        
        if (response && response.items) {
            return {
                ...response,
                items: response.items.map((item: GetPageListOrderResponse): StoreMyOrderItem => ({
                    id: item.id,
                    code: item.code,
                    status: item.status as OrderStatus,
                    createdAt: item.createdAt,
                    totalAmount: item.grandTotal
                }))
            } as LoadMorePagedResult<StoreMyOrderItem>;
        }
        
        return response;
    }
};
