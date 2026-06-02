'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus } from 'lucide-react';
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
        setTimeout(() => setJustAdded(false), 400);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white dark:bg-stone-950 border border-gray-150 dark:border-stone-800 rounded-3xl p-5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
        >
            <div>
                {/* Supplier & Code */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {product?.supplierName || 'SensorX'}
                    </span>
                    {product?.code && (
                        <span className="text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded uppercase font-mono">
                            {product.code}
                        </span>
                    )}
                </div>

                {/* Image container */}
                <div className="h-44 w-full relative mb-5 bg-[#FCF9F4] dark:bg-stone-900 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100/50 dark:border-zinc-800/50">
                    <Image
                        src={image || '/assets/images/products/default.png'}
                        alt={name}
                        fill
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Product title */}
                <h3 className="font-bold text-xs text-gray-950 dark:text-white line-clamp-2 mb-2 group-hover:text-[#0D9488] dark:group-hover:text-emerald-400 transition-colors uppercase tracking-wide leading-snug h-10">
                    {name}
                </h3>

                {/* Specs/Description */}
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {product?.spec || product?.description || 'Chưa có thông số kỹ thuật chi tiết cho sản phẩm này.'}
                </p>
            </div>

            {/* Action Footer */}
            <div className="border-t border-gray-100 dark:border-stone-850 pt-4 flex items-center justify-between mt-auto gap-3">
                <button
                    onClick={handleAddToInquiry}
                    className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-[9px] font-sans font-bold uppercase tracking-wider bg-[#0D9488] hover:bg-[#0F766E] text-white active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
                >
                    <Plus size={11} className={justAdded ? 'rotate-90 transition-transform' : ''} />
                    Yêu cầu báo giá
                </button>

                <button
                    onClick={handleCardClick}
                    className="flex items-center gap-1 text-[9px] font-sans font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em] hover:text-[#0D9488] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                    <span>Chi tiết</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Quantity Badge */}
            {qty > 0 && (
                <div className="absolute top-3 right-3 z-20 bg-[#0D9488] text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shadow-md text-[9px] font-bold animate-pulse">
                    {qty}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
