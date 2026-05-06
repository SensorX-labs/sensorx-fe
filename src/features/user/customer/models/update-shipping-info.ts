export interface UpdateShippingInfo {
    id: string;
    provinceId: string | null;
    wardId: string | null;
    shippingAddress: string | null;
    receiverName: string | null;
    receiverPhone: string | null;
}
