'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Bookmark, Share2, Truck, Shield, RotateCcw, Phone, Mail } from 'lucide-react';
import { Product } from '@/features/product/models';
import { mockProducts } from '@/features/product/mocks';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/shared/components/shadcn-ui/carousel';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // product cùng thể loại
  const relatedProducts = useMemo(
    () =>
      mockProducts
        .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4),
    [product.categoryId, product.id]
  );

  const handleAddToCart = () => {
    console.log(`Added ${selectedQuantity} of ${product.name} to cart`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 1;
    setSelectedQuantity(Math.max(1, quantity));
  };

  return (
    <div className="min-h-screen bg-page-background">

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 breadcrumb-text">
          <Link href="/shop" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} className="inline mr-1" />
            Danh sách sản phẩm
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">

            {/* ảnh to */}
            {product.images && product.images.length > 0 && (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative bg-product-card-bg aspect-square overflow-hidden border border-product-card-border">
                        <Image
                          src={image.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70 text-white hover:text-white drop-shadow-2xl size-14 transition-all" />
                <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70 text-white hover:text-white drop-shadow-2xl size-14 transition-all" />
              </Carousel>
            )}

            {/* ảnh bên dưới */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all bg-product-card-bg border-product-card-border`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* thông tin sản phẩm */}
          <div className="space-y-6">
            <div>
              <h1 className="tracking-title-xl">{product.name}</h1>
              <div className="flex items-center gap-4 meta-label">
                <span>Mã sản phẩm: {product.code}</span>
                <span>•</span>
                <span>Thương hiệu: {product.manufacture}</span>
              </div>
            </div>

            {/* số lượng */}
            <div className="flex items-center gap-4">
              <span className="qty-label">Số lượng:</span>
              <input
                type="number"
                value={selectedQuantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-24 px-4 py-2 border border-gray-300 text-center text-gray-900 font-medium focus:outline-none focus:border-gray-900"
              />
              <span className="text-xs text-gray-600 font-medium tracking-wider">{product.unit?.name || 'cái'}</span>
            </div>

            {/* các nút */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-brand-green text-white btn-tracking hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={20} />
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-16 py-4 border-2 transition-all ${isFavorite
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <Bookmark
                  size={20}
                  className={`mx-auto ${isFavorite ? 'fill-gray-900 text-gray-900' : 'text-gray-400'
                    }`}
                />
              </button>
              <button className="w-16 border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center">
                <Share2 size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 border-t pt-6">
              <div className="flex gap-4 items-start">
                <Truck size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Giao hàng nhanh chóng</div>
                  <div className="text-sm text-gray-600">Hỗ trợ vận chuyển đến toàn quốc</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Shield size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Hàng chính hãng</div>
                  <div className="text-sm text-gray-600">Bảo hành theo chính sách nhà cung cấp</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <RotateCcw size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Đổi trả dễ dàng</div>
                  <div className="text-sm text-gray-600">Hỗ trợ đổi/trả trong 30 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* thông số sản phẩm*/}
        {product.attributes && product.attributes.length > 0 && (
          <div className="mt-12 py-8">
            <h2 className="tracking-title-lg">Thông số kỹ thuật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-600 font-medium">{attr.name}</span>
                  <span className="text-gray-900 font-semibold">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*sản phẩm liên quan*/}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="tracking-title-lg">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const firstTier = relatedProduct.priceList?.tiers?.[0];
                const price = firstTier?.defaultPrice || 0;
                const primaryImg = relatedProduct.images?.[0]?.imageUrl || '/assets/images/products/default.webp';

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/shop/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="relative bg-product-card-bg overflow-hidden aspect-square border border-product-card-border hover:border-gray-400 transition-all cursor-pointer">
                      <Image
                        src={primaryImg}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-brand-green transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* phần hỗ trợ */}
        <div className="mt-20 md:mt-32 py-16 md:py-24 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="tracking-title-lg">Chúng tôi có thể giúp gì</h2>
              <p className="subtitle-sm">cho bạn?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-gray-900" />
                </div>
                <div className="contact-item">
                  <a href="tel:+84382116944">
                    +84 382 116 944
                  </a>
                  <p>Gọi chúng tôi để được hỗ trợ</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:gap-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-gray-900" />
                </div>
                <div className="contact-item">
                  <a href="mailto:support@sensorx.com">
                    support@sensorx.com
                  </a>
                  <p>Gửi email để nhận phản hồi trong 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}