'use client';

import React, { useState, useMemo } from 'react';
import {useRouter} from 'next/navigation';
import {
    UserCircle,
    UserCheck,
    UserMinus,
    Shield,
    Eye,
    Edit,
    Trash2,
    Search
} from 'lucide-react';
import {Card, CardContent} from '@/shared/components/shadcn-ui/card';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');

    const filteredStaff = useMemo(() => {
        return staff.filter(item => {
            const matchesSearch = 
                (item.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                (item.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                (item.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                (item.phone?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
            
            const matchesDepartment = departmentFilter === 'ALL' || item.department === departmentFilter;
            
            return matchesSearch && matchesDepartment;
        });
    }, [searchTerm, departmentFilter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button className="admin-btn-primary flex items-center gap-2">
                    <UserCircle className="w-4 h-4"/>
                    Tạo nhân viên
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Card key={s.title} className="border-none shadow-sm bg-white rounded">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xl font-bold text-[#2B3674]">{s.value}</p>
                                <p className="text-xs font-semibold text-[#A3AED0] mt-0.5">{s.title}</p>
                            </div>
                            <div className="w-10 h-10 rounded bg-[#F4F7FE] flex items-center justify-center">
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                {/* Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center p-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã NV, họ tên, email, điện thoại..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 whitespace-nowrap"
                    >
                        <option value="ALL">Tất cả phòng ban</option>
                        {Array.from(new Set(staff.map(s => s.department))).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="text-left px-6 py-4 tracking-label uppercase">Mã NV</th>
                            <th className="text-left px-6 py-4 tracking-label uppercase">Họ tên</th>
                            <th className="text-left px-6 py-4 tracking-label uppercase">Email</th>
                            <th className="text-left px-6 py-4 tracking-label uppercase">Điện thoại</th>
                            <th className="text-left px-6 py-4 tracking-label uppercase">Phòng ban</th>
                            <th className="text-center px-6 py-4 tracking-label uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.map((s) => (
                            <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{s.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{s.name}</td>
                                <td className="px-6 py-4 text-gray-700">{s.email}</td>
                                <td className="px-6 py-4 text-gray-700">{s.phone}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${departmentColor[s.department] ?? 'bg-gray-50 text-gray-400'}`}>
                                        {s.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
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
            </div>
        </div>
    );
}
