export interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
}

export const MOCK_STAFF: StaffMember[] = [
    {
        id: 'NV001',
        name: 'Nguyễn Thanh Hùng',
        email: 'hung.nt@axetic.vn',
        phone: '0901111222',
        department: 'Kinh doanh'
    },
    {
        id: 'NV002',
        name: 'Trần Thị Kim Loan',
        email: 'loan.ttk@axetic.vn',
        phone: '0912222333',
        department: 'Kế toán'
    },
    {
        id: 'NV003',
        name: 'Lê Văn Phong',
        email: 'phong.lv@axetic.vn',
        phone: '0923333444',
        department: 'Kho vận'
    },
    {
        id: 'NV004',
        name: 'Phạm Minh Quân',
        email: 'quan.pm@axetic.vn',
        phone: '0934444555',
        department: 'Kinh doanh'
    },
    {
        id: 'NV005',
        name: 'Hoàng Thị Lan',
        email: 'lan.ht@axetic.vn',
        phone: '0945555666',
        department: 'CSKH'
    },
];
