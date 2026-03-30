'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bookmark, ShoppingBag } from 'lucide-react';
import { Product } from '@/features/catalog/product/models';
import { AddCartItemMessage } from '@/features/sales/lead/components/store/add-cartitem-message';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    isFavorite?: boolean;
    onAddToCart?: () => void;
    onAddToFavorite?: () => void;
    product?: Product;
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
    product,
}) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite);
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

    // cập nhật isFav khi prop isFavorite thay đổi
    useEffect(() => {
        setIsFav(isFavorite);
    }, [isFavorite]);

    const handleAddToFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsFav(!isFav);
        onAddToFavorite?.();
    };

    const handleCardClick = () => {
        router.push(`/shop/${id}`);
    };

    return (
        <div className="relative group block">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                }}
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
                    type="button"
                    onClick={handleAddToFavorite}
                    className="absolute top-4 right-4 bg-bookmark-btn-bg rounded-none p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-product-card-border z-10"
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
            <div onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
            }} className="mt-5 space-y-2 cursor-pointer">
                <h3 className="text-sm font-normal text-gray-900 line-clamp-2 h-9 tracking-wider">
                    {name}
                </h3>


            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowAddToCartMessage(true);
                    onAddToCart?.();
                }}
                className="w-full mt-4 py-3 bg-brand-green text-white text-sm font-medium uppercase tracking-wider hover:bg-brand-green-hover transition-colors duration-300 rounded-none flex items-center justify-center gap-2"
            >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">THÊM NGAY</span>
                <span className="sm:hidden">ADD</span>
            </button>

            {product && (
                <AddCartItemMessage
                    product={product}
                    quantity={1}
                    isVisible={showAddToCartMessage}
                    onClose={() => setShowAddToCartMessage(false)}
                />
            )}
        </div>
    );
};

export default ProductCard;
