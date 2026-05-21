'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useInquiryCart } from '@/shared/hooks/use-inquiry-cart';

interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    product?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    product,
}) => {
    const router = useRouter();
    const { addItem, getItemQuantity } = useInquiryCart();
    const [justAdded, setJustAdded] = useState(false);
    const qty = getItemQuantity(id);

    const handleCardClick = () => {
        router.push(`/shop/${id}`);
    };

    const handleAddToInquiry = (e: React.MouseEvent) => {
        e.stopPropagation();

        setJustAdded(true);
        addItem({
            productId: id,
            productName: name,
            productCode: product?.code || '',
            unit: product?.unitOfQuantityName || 'Cái',
            manufacturer: product?.supplierName || 'SensorX',
            quantity: 1,
        });
        toast(`+1 ${name}`, {
            description: `Số lượng hiện tại: ${qty + 1}`,
            duration: 1500,
            position: 'bottom-left',
        });
        setTimeout(() => setJustAdded(false), 400);
    };

    return (
        <div className="group relative flex flex-col bg-white h-full transition-all duration-500 cursor-pointer hover:-translate-y-1 border border-filter-border rounded overflow-hidden hover:shadow-xl hover:shadow-gray-200/40">
            {/* Image Container */}
            <div
                onClick={handleCardClick}
                className="relative aspect-[4/5] overflow-hidden bg-product-card-bg"
            >
                {/* Overlay subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-10 transition-all duration-1000 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Nút thêm báo giá - luôn có thể click */}
                <button
                    onClick={handleAddToInquiry}
                    className={`
                        absolute bottom-3 left-3 right-3 z-20
                        flex items-center justify-center gap-2
                        py-2.5
                        text-[10px] font-bold uppercase tracking-[0.15em]
                        transition-all duration-300
                        translate-y-2 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        bg-gray-900 text-white hover:bg-brand-green active:scale-95
                    `}
                    title="Thêm vào danh sách báo giá"
                >
                    <Plus size={13} className={justAdded ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-1 mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        {product?.supplierName || 'SensorX'}
                    </p>
                    <h3
                        onClick={handleCardClick}
                        className="text-[13px] font-black text-gray-900 line-clamp-2 hover:text-brand-green transition-colors uppercase tracking-tight leading-tight"
                    >
                        {name}
                    </h3>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">SKU CODE</span>
                        <span className="text-[11px] text-gray-900 font-mono font-bold tracking-tight bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100 inline-block w-fit">
                            {product?.code || '---'}
                        </span>
                    </div>

                    <button
                        onClick={handleCardClick}
                        className="flex items-center gap-2 text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] group/btn transition-colors hover:text-brand-green"
                    >
                        Chi tiết <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Badge số lượng */}
            {qty > 0 && (
                <div className={`absolute top-3 right-3 z-20 bg-brand-green text-white rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center shadow-md text-[10px] font-black ${justAdded ? 'animate-bounce' : ''}`}>
                    {qty}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
