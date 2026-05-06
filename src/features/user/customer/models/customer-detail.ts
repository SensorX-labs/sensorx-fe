export interface CustomerDetail {
    id: string;
    name: string;
    code: string;
    taxCode: string;
    email: string;
    phone: string | null;
    address: string | null;
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