'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {
    Package,
    Tag,
    AlertTriangle,
    TrendingUp,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/components/shadcn-ui/card';
import {Button} from '@/shared/components/shadcn-ui/button';


import {mockProducts} from '@/features/catalog/product/mocks/mock-product';
import {ProductStatus} from '@/features/catalog/product/models/product-status';

const statusColor: Record < string,
    string > = {
        [ProductStatus.ACTIVE]: 'bg-green-100 text-green-600',
        [ProductStatus.DISCONTINUED]: 'bg-red-100 text-red-400'
    };

const statusLabel: Record < string,
    string > = {
        [ProductStatus.ACTIVE]: 'Còn hàng',
        [ProductStatus.DISCONTINUED]: 'Ngừng kinh doanh'
    };

export default function ProductsPage() {
    const router = useRouter();


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold admin-title">Hàng hóa</h2>
                    <p className="text-sm admin-muted mt-1">Quản lý danh mục sản phẩm & hàng hóa</p>
                </div>
                <button className="admin-btn-primary flex items-center gap-2">
                    <Package className="w-4 h-4"/>
                    Thêm hàng hóa
                </button>
            </div>

            <Card className="border-none shadow-sm bg-white rounded">
                <CardHeader className="px-6 py-4 border-b border-gray-100">
                    <CardTitle className="text-base font-bold admin-title">Danh sách hàng hóa</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-xs font-bold admin-muted uppercase">SKU</th>
                                <th className="text-left px-6 py-3 text-xs font-bold admin-muted uppercase">Tên hàng hóa</th>
                                <th className="text-left px-6 py-3 text-xs font-bold admin-muted uppercase">Loại hàng</th>
                                <th className="text-left px-6 py-3 text-xs font-bold admin-muted uppercase">Đơn giá</th>
                                <th className="text-left px-6 py-3 text-xs font-bold admin-muted uppercase">Trạng thái</th>
                                <th className="text-center px-6 py-3 text-xs font-bold admin-muted uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody> {
                            mockProducts.map((p) => (
                                <tr key={
                                        p.id
                                    }
                                    className="border-b border-gray-50 hover:bg-admin-surface transition-colors">
                                    <td className="px-6 py-3 font-semibold admin-text-primary">
                                        {
                                        p.code
                                    }</td>
                                    <td className="px-6 py-3 font-semibold admin-text-primary">
                                        {
                                        p.name
                                    }</td>
                                    <td className="px-6 py-3">
                                        {
                                        p.category ?. name || '--'
                                    }</td>
                                    <td className="px-6 py-3 font-semibold ">
                                        {
                                        p.priceList ?. tiers && p.priceList.tiers.length > 0 ? new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(p.priceList.tiers[0].defaultPrice) : '--'
                                    } </td>
                                    <td className="px-6 py-3">
                                        <span className={
                                            `px-2 py-0.5 rounded-full text-xs font-bold ${
                                                statusColor[p.status] ?? 'bg-gray-100 text-gray-500'
                                            }`
                                        }>
                                            {
                                            statusLabel[p.status] || p.status
                                        } </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={
                                                    () => router.push(`/catalog/products/${
                                                        p.id
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
                            ))
                        } </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
