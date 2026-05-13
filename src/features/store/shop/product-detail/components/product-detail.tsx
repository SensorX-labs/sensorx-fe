'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Bookmark, Share2, Truck, Shield, RotateCcw, Phone, Mail, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductDetail as ProductDetailModel } from '@/features/catalog/product/models';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { NotionEditor } from '@/shared/components/notion-editor';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await ProductService.getDetail(id as string);
        if (response) {
          setProduct(response);
          const saved = localStorage.getItem('bookmarkedProducts');
          if (saved) {
            const favorites = JSON.parse(saved);
            setIsFavorite(favorites.includes(id as string));
          }
        }
      } catch (error) {
        console.error(">>> Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToFavorite = () => {
    if (!id) return;
    const saved = localStorage.getItem('bookmarkedProducts');
    let favorites = saved ? JSON.parse(saved) : [];

    if (isFavorite) {
      favorites = favorites.filter((favId: string) => favId !== id);
      toast.success("Đã gỡ khỏi danh sách yêu thích");
    } else {
      favorites.push(id);
      toast.success("Đã thêm vào danh sách yêu thích");
    }

    localStorage.setItem('bookmarkedProducts', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 1;
    setSelectedQuantity(Math.max(1, quantity));
  };

  const getImageUrl = (img: string) => {
    if (!img || img === 'string' || (!img.startsWith('/') && !img.startsWith('http'))) {
      return '/assets/images/products/default.png';
    }
    return img;
  };

  if (loading) return (
    <div className="min-h-screen bg-page-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-page-background flex flex-col items-center justify-center gap-6">
      <p className="text-gray-500 font-medium tracking-wide">Không tìm thấy sản phẩm này.</p>
      <a href="/shop" className="px-6 py-3 bg-gray-900 text-white hover:bg-brand-green transition-colors uppercase text-xs font-bold tracking-[0.2em] rounded-sm">
        Quay lại cửa hàng
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-page-background selection:bg-brand-green selection:text-white">
      <StoreBreadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Cửa hàng', href: '/shop' },
          { label: product.categoryName || 'Sản phẩm', href: product.categoryId ? `/shop?category=${product.categoryId}` : '/shop' },
          { label: product.name }
        ]}
        backLink="/shop"
        backLabel="Quay lại cửa hàng"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 h-full">

          {/* ======================================================== */}
          {/* LẮT CẮT TRÁI: Khu vực Ảnh (Chiếm 5 cột, Đã tăng kích thước ảnh) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 h-full">

            {/* Ảnh chính - Đã giảm padding để thu nhỏ khung ảnh chính, làm cho ảnh cốt lõi ở giữa to ra */}
            <div className="relative bg-white aspect-square overflow-hidden border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
              <Image
                src={getImageUrl(product.images?.[activeImage] || '')}
                alt={product.name}
                fill
                className="object-contain p-6 md:p-12 transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>

            {/* Các ảnh nhỏ (Thumbnails) - Luôn nằm dưới cùng cột trái */}
            {product.images && product.images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-200 bg-white border ${activeImage === index
                      ? 'border-brand-green ring-2 ring-brand-green shadow-sm'
                      : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300'
                      }`}
                  >
                    <Image src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            ) : <div className="h-20" />}
          </div>

          {/* ======================================================== */}
          {/* LẮT CẮT PHẢI: Thông tin & Hành động (Chiếm 7 cột) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col h-full">

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight leading-snug mb-8">
              {product.name}
            </h1>

            {/* Danh sách thuộc tính & Số lượng (Ghép chung 1 Grid để lề trái thẳng 100%) */}
            <div className="flex flex-col gap-5 text-sm mb-8">
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-gray-500 font-medium">Mã sản phẩm:</span>
                <span className="col-span-8 md:col-span-9 font-mono font-bold text-gray-900 bg-gray-200/60 px-2 py-0.5 rounded w-fit">
                  {product.code}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-gray-500 font-medium">Hãng sản xuất:</span>
                <span className="col-span-8 md:col-span-9 font-bold text-brand-green uppercase tracking-wider">
                  {product.manufacture || 'SensorX'}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-gray-500 font-medium">Loại sản phẩm:</span>
                <span className="col-span-8 md:col-span-9 font-medium text-gray-900">
                  {product.categoryName || 'Chưa cập nhật'}
                </span>
              </div>

              {/* Hàng Số lượng - Căn lề trái thẳng hoàn hảo, đã bỏ Sẵn sàng xuất kho */}
              <div className="grid grid-cols-12 gap-4 items-center pt-5 mt-2 border-t border-gray-100">
                <span className="col-span-4 md:col-span-3 text-gray-500 font-medium">Số lượng:</span>
                <div className="col-span-8 md:col-span-9 flex items-center gap-4">
                  <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden shadow-sm">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-300 disabled:opacity-30 disabled:hover:bg-white"
                      disabled={selectedQuantity <= 1}
                    >-</button>
                    <input
                      type="number"
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-14 h-10 text-center text-sm font-bold text-gray-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-l border-gray-300"
                    >+</button>
                  </div>
                  {/* Đơn vị tính chung một dòng */}
                  <span className="font-medium text-gray-900">{product.unit || 'Cái'}</span>
                </div>
              </div>
            </div>

            {/* Khối Mua Hàng - Giới hạn độ rộng max-w để nút không bị quá dài */}
            {/* Các nút hành động */}
            <div className="flex gap-3 md:gap-4 mb-8">
              <button
                className="flex-1 h-12 bg-brand-green text-white hover:bg-gray-900 transition-all duration-300 rounded shadow-md font-bold uppercase tracking-[0.1em] text-xs md:text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Yêu cầu báo giá
              </button>

              <button
                onClick={handleAddToFavorite}
                className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 rounded shadow-sm ${isFavorite
                  ? 'border-red-200 text-red-500 bg-red-50'
                  : 'border-gray-200 text-gray-400 bg-white hover:border-brand-green hover:text-brand-green'
                  }`}
                title="Yêu thích"
              >
                <Bookmark size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 rounded shadow-sm" title="Chia sẻ">
                <Share2 size={18} />
              </button>
            </div>

            {/* Dịch vụ đi kèm - Đặt mt-auto để luôn nằm dưới cùng, ngang hàng với Thumbnail bên trái theo yêu cầu */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 border-t border-gray-200 w-full">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Truck size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gray-900">Giao hàng</span>
                  <span className="block text-xs text-gray-500">Toàn quốc</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Shield size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gray-900">Chính hãng</span>
                  <span className="block text-xs text-gray-500">100% bảo hành</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <RotateCcw size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gray-900">Đổi trả</span>
                  <span className="block text-xs text-gray-500">Trong 30 ngày</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN 2: THÔNG SỐ KỸ THUẬT & CHI TIẾT SẢN PHẨM (Đã nâng cấp bố cục) */}
        {/* ======================================================== */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Cột trái: Thông số kỹ thuật (Dạng Zebra Stripes - sọc dưa xen kẽ) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Thông số kỹ thuật</h2>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                {product.attributes && product.attributes.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                    <ul className="flex flex-col">
                      {product.attributes.map((attr, idx) => (
                        <li key={idx} className={`flex items-start py-3.5 px-5 ${idx % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                          <span className="text-sm font-medium text-gray-500 w-1/2 pr-4">{attr.name}</span>
                          <span className="text-sm font-bold text-gray-900 w-1/2 text-right">{attr.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-md p-8 text-center shadow-sm">
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu thông số kỹ thuật.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Mô tả chi tiết (Nâng cấp khung viền phù hợp màu sắc) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Chi tiết sản phẩm</h2>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-sm rounded-md overflow-hidden prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-headings:uppercase prose-p:text-gray-600 prose-a:text-brand-green prose-img:rounded-md">
                {product.showcase ? (
                  <NotionEditor
                    content={product.showcase}
                    editable={false}
                  />
                ) : (
                  <div className="text-center py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-lg border border-gray-100">
                    <Bookmark className="text-gray-300 mb-4" size={32} strokeWidth={1.5} />
                    <p className="text-gray-500 font-medium text-sm">Đang cập nhật mô tả chi tiết cho sản phẩm này...</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN 3: HỖ TRỢ (Gác comment cũ, giữ nguyên bố cục) */}
        {/* ======================================================== */}
        <div className="mt-20 lg:mt-32 pt-16 border-t border-gray-200 flex flex-col items-center text-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Bạn cần hỗ trợ thêm?</h2>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-10">Đội ngũ kỹ thuật luôn sẵn sàng 24/7</p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
            <div className="flex flex-col items-center group bg-white p-8 rounded-md border border-gray-200 shadow-sm hover:border-brand-green hover:shadow-md transition-all duration-300 flex-1 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 text-gray-600">
                <Phone size={20} />
              </div>
              <a href="tel:+84382116944" className="text-lg font-black text-gray-900 group-hover:text-brand-green transition-colors tracking-tight">+84 382 116 944</a>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Hỗ trợ trực tiếp</p>
            </div>
            <div className="flex flex-col items-center group bg-white p-8 rounded-md border border-gray-200 shadow-sm hover:border-brand-green hover:shadow-md transition-all duration-300 flex-1 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 text-gray-600">
                <Mail size={20} />
              </div>
              <a href="mailto:support@sensorx.com" className="text-lg font-black text-gray-900 group-hover:text-brand-green transition-colors tracking-tight">support@sensorx.com</a>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Phản hồi qua Email</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}