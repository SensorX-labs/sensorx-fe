import api from "@/shared/configs/axios-config";
import ImageService from "@/shared/services/image.service";

export const StoreCustomerService = {
    updateCustomerAvatar: async (avatar: File) => {
        // 1. Upload to Cloudinary via ImageService
        const avatarUrl = await ImageService.upload(avatar, "avatars");
        // 2. Update Customer profile with the new URL
        return api.data.put<any, any>(`/customer/update-avatar`, { avatar: avatarUrl });
    },

    updateCustomerInfo: (customer: UpdateCustomerInfo) =>
        api.data.put<any, UpdateCustomerInfo>(`/customer/update-info`, customer),

    updateShippingInfo: (customer: UpdateShippingInfo) =>
        api.data.put<any, UpdateShippingInfo>(`/customer/update-shipping-info`, customer),

    getDetailCustomerByAccountId: (accountId: string) =>
        api.data.get<any, CustomerDetail>(`/customer/account/${accountId}`)
};

export default StoreCustomerService;

export interface UpdateCustomerInfo {
    id: string;
    name: string;
    taxCode: string;
    email: string;
    phone: string;
    address: string;
}

export interface CustomerDetail {
    id: string;
    name: string;
    code: string;
    taxCode: string;
    email: string;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
    createdAt: string;
    shippingInfo: ShippingInfo | null;
}

export interface ShippingInfo {
    provinceId: string | null;
    wardId: string | null;
    shippingAddress: string | null;
    receiverName: string | null;
    receiverPhone: string | null;
}
export interface UpdateShippingInfo {
    id: string;
    provinceId: string | null;
    wardId: string | null;
    shippingAddress: string | null;
    receiverName: string | null;
    receiverPhone: string | null;
}