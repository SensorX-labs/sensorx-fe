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

    // Compute a consistent color variation based on product ID
    const charSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const bgAccents = [
        'bg-emerald-500', 
        'bg-indigo-500',  
        'bg-teal-500',    
        'bg-violet-500',  
        'bg-amber-500',   
        'bg-cyan-500',    
    ];
    
    const textAccents = [
        'text-emerald-600 dark:text-emerald-400',
        'text-indigo-600 dark:text-indigo-400',
        'text-teal-600 dark:text-teal-400',
        'text-violet-600 dark:text-violet-400',
        'text-amber-600 dark:text-amber-400',
        'text-cyan-600 dark:text-cyan-400',
    ];

    const borderAccents = [
        'group-hover:border-emerald-500/50',
        'group-hover:border-indigo-500/50',
        'group-hover:border-teal-500/50',
        'group-hover:border-violet-500/50',
        'group-hover:border-amber-500/50',
        'group-hover:border-cyan-500/50',
    ];

    const shadowAccents = [
        'hover:shadow-emerald-500/10 hover:shadow-lg',
        'hover:shadow-indigo-500/10 hover:shadow-lg',
        'hover:shadow-teal-500/10 hover:shadow-lg',
        'hover:shadow-violet-500/10 hover:shadow-lg',
        'hover:shadow-amber-500/10 hover:shadow-lg',
        'hover:shadow-cyan-500/10 hover:shadow-lg',
    ];

    const bgAccentClass = bgAccents[charSum % bgAccents.length];
    const textAccentClass = textAccents[charSum % textAccents.length];
    const borderAccentClass = borderAccents[charSum % borderAccents.length];
    const shadowAccentClass = shadowAccents[charSum % shadowAccents.length];

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
        <div className={`group relative flex flex-col bg-[#F9F9FB] dark:bg-stone-900 border border-stone-200 dark:border-stone-850 h-full transition-all duration-300 cursor-pointer hover:-translate-y-2 rounded-2xl overflow-hidden ${borderAccentClass} ${shadowAccentClass}`}>
            
            {/* Colorful Accent Top Strip */}
            <div className={`h-[4px] w-full ${bgAccentClass}`} />

            {/* Image Container */}
            <div
                onClick={handleCardClick}
                className="relative aspect-[4/5] overflow-hidden bg-[#FCF9F4] dark:bg-stone-950 border-b border-gray-100 dark:border-stone-850"
            >
                {/* Overlay subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-8 transition-all duration-1000 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Quick RFQ button */}
                <button
                    onClick={handleAddToInquiry}
                    className={`
                        absolute bottom-3 left-3 right-3 z-20
                        flex items-center justify-center gap-2
                        py-3 rounded-xl
                        text-[10px] font-sans font-bold uppercase tracking-[0.2em]
                        transition-all duration-300
                        translate-y-2 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        ${bgAccentClass} text-white active:scale-95 shadow-md
                    `}
                    title="Thêm vào danh sách báo giá"
                >
                    <Plus size={13} className={justAdded ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    Thêm báo giá
                </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="space-y-2 mb-4">
                    <span className={`inline-block text-[9px] font-black uppercase tracking-[0.2em] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded ${textAccentClass}`}>
                        {product?.supplierName || 'SensorX'}
                    </span>
                    <h3
                        onClick={handleCardClick}
                        className="text-[13px] font-bold text-stone-950 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-wide leading-snug h-10"
                    >
                        {name}
                    </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-stone-850 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-gray-400 font-sans font-bold uppercase tracking-widest">SKU CODE</span>
                      <span className={`text-[10px] font-mono font-bold tracking-tight bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-gray-200/10 inline-block w-fit ${textAccentClass}`}>
                          {product?.code || '---'}
                      </span>
                  </div>

                  <button
                      onClick={handleCardClick}
                      className="flex items-center gap-1.5 text-[9px] font-sans font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] group/btn transition-colors hover:text-emerald-600"
                  >
                      Chi tiết <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
            </div>

            {/* Badge count */}
            {qty > 0 && (
                <div className={`absolute top-4 right-4 z-20 ${bgAccentClass} text-white rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center shadow-lg text-[10px] font-sans font-bold ${justAdded ? 'animate-bounce' : ''}`}>
                    {qty}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
