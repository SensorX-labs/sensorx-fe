export interface RegisterRequest {
    email: string,
    password: string,
    name: string,
    phone: string | null,
    taxCode: string,
    address: string | null
}