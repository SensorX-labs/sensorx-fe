'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Bookmark, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    isFavorite?: boolean;
    onAddToCart?: () => void;
    onAddToFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    originalPrice,
    image,
    isFavorite = false,
    onAddToCart,
    onAddToFavorite,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite);

    const handleAddToFavorite = () => {
        setIsFav(!isFav);
        onAddToFavorite?.();
    };

    return (
        <div className="relative group">
            {/* image container*/}
            <div
                className="relative bg-product-card-bg overflow-hidden aspect-square rounded-none cursor-pointer transition-all duration-300 border border-product-card-border"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-500 ease-out"
                    style={{
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                />

                {originalPrice && (
                    <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        MỚI
                    </div>
                )}

                {/* nút đánh dấu */}
                <button
                    onClick={handleAddToFavorite}
                    className="absolute top-4 right-4 bg-bookmark-btn-bg rounded-none p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-product-card-border"
                >
                    <Bookmark
                        size={18}
                        strokeWidth={2.5}
                        className={`transition-all duration-300 ${isFav ? 'fill-gray-900 text-gray-900' : 'text-gray-400'
                            }`}
                    />
                </button>
            </div>

            {/*thông tin sản phẩm */}
            <div className="mt-5 space-y-2">
                <h3 className="text-sm font-normal text-gray-900 line-clamp-2 h-9">
                    {name}
                </h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                        {price.toLocaleString('vi-VN')}đ
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={onAddToCart}
                className="w-full mt-4 py-3 bg-brand-green text-white text-sm font-medium uppercase tracking-wider hover:bg-brand-green-hover transition-colors duration-300 rounded-none flex items-center justify-center gap-2"
            >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">THÊM NGAY</span>
                <span className="sm:hidden">ADD</span>
            </button>
        </div>
    );
};

export default ProductCard;
