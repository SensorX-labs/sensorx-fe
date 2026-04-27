export interface Customer {
    id?: string;
    name: string;
    code?: string;
    taxCode?: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    address?: string;
    wardId?: string | null;
    shippingAddress?: string;
    receiverName?: string;
    receiverPhone?: string;
    createdAt?: string;
}