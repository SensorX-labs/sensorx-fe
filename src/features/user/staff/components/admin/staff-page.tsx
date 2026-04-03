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
        role: 'Quản lý',
        department: 'Kinh doanh',
        status: 'Làm việc'
    },
    {
        id: 'NV002',
        name: 'Trần Thị Kim Loan',
        email: 'loan.ttk@axetic.vn',
        phone: '0912 222 333',
        role: 'Nhân viên',
        department: 'Kế toán',
        status: 'Làm việc'
    },
    {
        id: 'NV003',
        name: 'Lê Văn Phong',
        email: 'phong.lv@axetic.vn',
        phone: '0923 333 444',
        role: 'Nhân viên',
        department: 'Kho vận',
        status: 'Nghỉ phép'
    },
    {
        id: 'NV004',
        name: 'Phạm Minh Quân',
        email: 'quan.pm@axetic.vn',
        phone: '0934 444 555',
        role: 'Trưởng phòng',
        department: 'Kinh doanh',
        status: 'Làm việc'
    }, {
        id: 'NV005',
        name: 'Hoàng Thị Lan',
        email: 'lan.ht@axetic.vn',
        phone: '0945 555 666',
        role: 'Nhân viên',
        department: 'CSKH',
        status: 'Làm việc'
    },
];

const statusColor: Record < string,
    string > = {
        'Làm việc': 'bg-green-100 text-green-600',
        'Nghỉ phép': 'bg-yellow-100 text-yellow-600',
        'Nghỉ việc': 'bg-red-100 text-red-400'
    };

const roleColor: Record < string,
    string > = {
        'Quản lý': 'bg-purple-100 text-purple-600',
        'Trưởng phòng': 'bg-blue-100 text-blue-600',
        'Nhân viên': 'bg-gray-100 text-gray-500'
    };

export default function StaffPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold admin-title">Nhân viên</h2>
                    <p className="text-sm admin-muted mt-1">Quản lý thông tin và phân quyền nhân viên</p>
                </div>
                <button className="admin-btn-primary flex items-center gap-2">
                    <UserCircle className="w-4 h-4"/>
                    Thêm nhân viên
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {
                stats.map((s) => (
                    <Card key={
                            s.title
                        }
                        className="border-none shadow-sm bg-white rounded">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xl font-bold admin-title">{s.value}</p>
                                <p className="text-xs font-semibold admin-muted mt-0.5">{s.title}</p>
                            </div>
                            <div className="w-10 h-10 rounded admin-surface flex items-center justify-center">
                                <s.icon className={
                                    `w-5 h-5 ${
                                        s.color
                                    }`
                                }/>
                            </div>
                        </CardContent>
                    </Card>
                ))
            } </div>

            <Card className="border-none shadow-sm bg-white rounded">
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 admin-table-th">Mã NV</th>
                                <th className="text-left px-6 py-3 admin-table-th">Họ tên</th>
                                <th className="text-left px-6 py-3 admin-table-th">Email</th>
                                <th className="text-left px-6 py-3 admin-table-th">Điện thoại</th>
                                <th className="text-left px-6 py-3 admin-table-th">Vai trò</th>
                                <th className="text-left px-6 py-3 admin-table-th">Phòng ban</th>
                                <th className="text-left px-6 py-3 admin-table-th">Trạng thái</th>
                                <th className="text-center px-6 py-3 admin-table-th">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody> {
                            staff.map((s) => (
                                <tr key={
                                        s.id
                                    }
                                    className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                                    <td className="px-6 py-3 font-semibold admin-text-primary">
                                        {
                                        s.id
                                    }</td>
                                    <td className="px-6 py-3 font-semibold">
                                        {
                                        s.name
                                    }</td>
                                    <td className="px-6 py-3">
                                        {
                                        s.email
                                    }</td>
                                    <td className="px-6 py-3">
                                        {
                                        s.phone
                                    }</td>
                                    <td className="px-6 py-3">
                                        <span className={
                                            `px-2 py-0.5 rounded-full text-xs font-bold ${
                                                roleColor[s.role] ?? 'bg-gray-100 text-gray-500'
                                            }`
                                        }>
                                            {
                                            s.role
                                        } </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        {
                                        s.department
                                    }</td>
                                    <td className="px-6 py-3">
                                        <span className={
                                            `px-2 py-0.5 rounded-full text-xs font-bold ${
                                                statusColor[s.status] ?? 'bg-gray-100 text-gray-500'
                                            }`
                                        }>
                                            {
                                            s.status
                                        } </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={
                                                    () => router.push(`/users/staff/${
                                                        s.id
                                                    }`)
                                            }>
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
