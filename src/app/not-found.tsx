'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ChevronRight, Phone, Mail, Search} from 'lucide-react';
import StoreHeader from '@/layouts/store/store-header';
import StoreFooter from '@/layouts/store/store-footer';

export default function NotFound() {
    const pathname = usePathname();

    const category = [
        {
            name: "Cảm biến công nghiệp",
            href: "/category/industrial"
        },
        {
            name: "Hệ thống đo lường",
            href: "/category/systems"
        },
        {
            name: "Thiết bị tự động hóa",
            href: "/category/automation"
        },
        {
            name: "Giải pháp B2B",
            href: "/b2b"
        }, {
            name: "Sản phẩm mới",
            href: "/new-arrivals"
        }, {
            name: "Hỗ trợ kỹ thuật",
            href: "/support"
        },
    ]

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <StoreHeader/>
            <main className="flex-1">

                <div className="relative bg-zinc-900 text-white py-24 sm:py-32 px-48 text-center bg-cover bg-center bg-no-repeat"
                    style={
                        {
                            backgroundImage: 'url("/assets/images/notfound-wall.jpg")'
                        }
                }>
                    <div className="absolute inset-0 bg-black/60"></div>

                    <div className="relative z-10 drop-shadow-2xl">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-[0.2em] mb-6 text-white">
                            KHÔNG TÌM THẤY TRANG CHO URL "{pathname}"
                        </h1>
                        <p className="text-sm sm:text-base text-zinc-100 font-normal opacity-90">
                            VUI LÒNG THỬ LẠI BẰNG ĐƯỜNG DẪN KHÁC HOẶC QUAY TRỞ LẠI TRANG CHỦ
                        </p>
                        <div className="mt-10">
                            <Link href="/" className="inline-block px-12 py-4 border-2 border-white text-white text-xs font-bold tracking-[0.2em] hover:bg-brand-green hover:border-brand-green hover:text-white transition-all">
                                QUAY TRỞ LẠI TRANG CHỦ
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                        {/* bên trái */}
                        <div className="lg:col-span-8">
                            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase border-b pb-8 mb-0">
                                Danh mục liên quan
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                {
                                category.map((item) => (
                                    <Link key={
                                            item.name
                                        }
                                        href={
                                            item.href
                                        }
                                        className="group flex items-center justify-between py-8 pr-8 border-b hover:bg-gray-50 transition-colors">
                                        <span className="text-xs font-semibold tracking-widest uppercase">
                                            {
                                            item.name
                                        }</span>
                                        <ChevronRight size={14}
                                            className="group-hover:translate-x-1 transition-transform"/>
                                    </Link>
                                ))
                            } </div>
                        </div>

                        {/* bên phải */}
                        <div className="lg:col-span-4 space-y-20 border-l lg:pl-16">
                            <div>
                                <h3 className="font-semibold tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                                    <Search size={16}/>
                                    Gợi ý tìm kiếm
                                </h3>
                                <ul className="space-y-4 text-sm">
                                    <li>Kiểm tra lại lỗi chính tả của đường dẫn.</li>
                                    <li>Sử dụng các từ khóa ngắn gọn và tổng quát hơn.</li>
                                    <li>Thử tìm kiếm trực tiếp trên thanh menu chính.</li>
                                    <li>Quay lại trang chủ để bắt đầu lại.</li>
                                </ul>
                            </div>

                            {/* trợ giúp*/}
                            <div>
                                <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-8">
                                    Chúng tôi có thể giúp gì cho bạn?
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                            <Phone size={16}/>
                                        </div>
                                        <span className="text-sm font-medium tracking-wider">+84 382 116 944</span>
                                    </div>

                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                            <Mail size={16}/>
                                        </div>
                                        <span className="text-sm font-medium tracking-wider">support@sensorx.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <StoreFooter/>
        </div>
    );
}
