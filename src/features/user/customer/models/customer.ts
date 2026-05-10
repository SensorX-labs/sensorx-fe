export interface Customer {
    id?: string;
    name: string;
    code?: string;
    taxCode?: string;
    email: string;
    phone?: string;
    address?: string;
    wardId?: string | null;
    provinceId?: string | null;
    shippingAddress?: string;
    receiverName?: string;
    receiverPhone?: string;
    createdAt?: string;
}