'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {
    UserCircle,
    UserCheck,
    UserMinus,
    Shield,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/components/shadcn-ui/card';
import {Button} from '@/shared/components/shadcn-ui/button';

const stats = [
    {
        title: 'Tổng nhân viên',
        value: '48',
        icon: UserCircle,
        color: 'text-[#4318FF]'
    }, {
        title: 'Đang làm việc',
        value: '44',
        icon: UserCheck,
        color: 'text-green-500'
    }, {
        title: 'Nghỉ phép',
        value: '4',
        icon: UserMinus,
        color: 'text-yellow-500'
    }, {
        title: 'Vai trò',
        value: '6',
        icon: Shield,
        color: 'text-purple-500'
    },
];

const staff = [
    {
        id: 'NV001',
        name: 'Nguyễn Thanh Hùng',
        email: 'hung.nt@axetic.vn',
        phone: '0901 111 222',
        department: 'Kinh doanh'
    },
    {
        id: 'NV002',
        name: 'Trần Thị Kim Loan',
        email: 'loan.ttk@axetic.vn',
        phone: '0912 222 333',
        department: 'Kế toán'
    },
    {
        id: 'NV003',
        name: 'Lê Văn Phong',
        email: 'phong.lv@axetic.vn',
        phone: '0923 333 444',
        department: 'Giám đốc'
    },
    {
        id: 'NV004',
        name: 'Phạm Minh Quân',
        email: 'quan.pm@axetic.vn',
        phone: '0934 444 555',
        department: 'Kho vận'
    }, {
        id: 'NV005',
        name: 'Hoàng Thị Lan',
        email: 'lan.ht@axetic.vn',
        phone: '0945 555 666',
        department: 'Mua hàng'
    },
];

const departmentColor: Record < string,
    string > = {
        'Giám đốc': 'bg-red-50 text-red-600 border border-red-100',
        'Kho vận': 'bg-blue-50 text-blue-600 border border-blue-100',
        'Kinh doanh': 'bg-green-50 text-green-600 border border-green-100',
        'Kế toán': 'bg-orange-50 text-orange-600 border border-orange-100',
        'Mua hàng': 'bg-indigo-50 text-indigo-600 border border-indigo-100'
    };

export default function StaffList() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button className="admin-btn-primary flex items-center gap-2">
                    <UserCircle className="w-4 h-4"/>
                    Tạo nhân viên
                </button>
            </div>

            <Card className="border-none shadow-sm bg-white rounded">
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 admin-table-th">Mã NV</th>
                                <th className="text-left px-6 py-3 admin-table-th">Họ tên</th>
                                <th className="text-left px-6 py-3 admin-table-th">Email</th>
                                <th className="text-left px-6 py-3 admin-table-th">Điện thoại</th>
                                <th className="text-left px-6 py-3 admin-table-th">Phòng ban</th>
                                <th className="text-center px-6 py-3 admin-table-th">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((s) => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                                    <td className="px-6 py-3 font-semibold admin-text-primary">{s.id}</td>
                                    <td className="px-6 py-3">{s.name}</td>
                                    <td className="px-6 py-3">{s.email}</td>
                                    <td className="px-6 py-3">{s.phone}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${departmentColor[s.department] ?? 'bg-gray-50 text-gray-400'}`}>
                                            {s.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => router.push(`/users/staff/${s.id}`)}
                                            >
                                                <Eye className="w-4 h-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50">
                                                <Edit className="w-4 h-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
