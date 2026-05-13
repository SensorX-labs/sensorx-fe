'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bookmark, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUser } from '@/shared/hooks/use-user';
import { toast } from 'sonner';

interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    isFavorite?: boolean;
    onAddToCart?: () => void;
    onAddToFavorite?: () => void;
    product?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    isFavorite = false,
    onAddToCart,
    onAddToFavorite,
    product,
}) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite);

    useEffect(() => {
        setIsFav(isFavorite);
    }, [isFavorite]);

    const handleAddToFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsFav(!isFav);
        onAddToFavorite?.();

        toast.success(
            !isFav ? "Đã thêm vào danh sách yêu thích" : "Đã gỡ khỏi danh sách yêu thích",
            { 
                duration: 2000,
                style: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }
            }
        );
    };

    const handleCardClick = () => {
        router.push(`/shop/${id}`);
    };


    return (
        <div
            className="group relative flex flex-col bg-white h-full transition-all duration-500 hover:-translate-y-1 border border-filter-border rounded overflow-hidden hover:shadow-xl hover:shadow-gray-200/40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div
                onClick={handleCardClick}
                className="relative aspect-[4/5] overflow-hidden bg-product-card-bg cursor-pointer"
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

                {/* Favorite Button */}
                <button
                    onClick={handleAddToFavorite}
                    className={`absolute top-4 right-4 p-2.5 rounded bg-white shadow-sm transition-all duration-500 hover:scale-110 active:scale-95 z-20 border border-filter-border ${
                        isHovered || isFav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                    aria-label="Add to favorites"
                >
                    <Bookmark
                        size={16}
                        className={`transition-all duration-300 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-gray-900'}`}
                    />
                </button>

            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-1 mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        {product?.manufacture || 'SensorX'}
                    </p>
                    <h3
                        onClick={handleCardClick}
                        className="text-[13px] font-black text-gray-900 line-clamp-2 cursor-pointer hover:text-brand-green transition-colors uppercase tracking-tight leading-tight"
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

        </div>
    );
};

export default ProductCard;