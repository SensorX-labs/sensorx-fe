'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Share2, Truck, Shield, RotateCcw, Phone, Mail, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ProductService } from '@/features/catalog/product/services/product-service';
import { ProductDetail as ProductDetailModel } from '@/features/catalog/product/models';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';
import { NotionEditor } from '@/shared/components/notion-editor';
import { useInquiryCart } from '@/shared/hooks/use-inquiry-cart';

export function ProductDetail() {
  const { id } = useParams();
  const { addItem, getItemQuantity } = useInquiryCart();
  const [product, setProduct] = useState<ProductDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const qtyInCart = id ? getItemQuantity(id as string) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await ProductService.getDetail(id as string);
        if (response) {
          setProduct(response);
        }
      } catch (error) {
        console.error(">>> Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCreateRFQ = () => {
    if (!product || !id) return;

    setJustAdded(true);
    addItem({
      productId: id as string,
      productName: product.name,
      productCode: product.code || '',
      unit: product.unitOfQuantityName || 'Cái',
      manufacturer: product.supplierName || 'SensorX',
      quantity: selectedQuantity,
    });

    toast.success(`Đã thêm ${selectedQuantity} sản phẩm`, {
      description: `Tổng số lượng trong danh sách: ${qtyInCart + selectedQuantity}`,
      duration: 2500,
    });
    setTimeout(() => setJustAdded(false), 800);
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
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-page-background flex flex-col items-center justify-center gap-6">
      <p className="text-gray-500 font-sans font-medium tracking-wide">Không tìm thấy sản phẩm này.</p>
      <a href="/shop" className="px-8 py-3.5 bg-primary hover:bg-[#115E59] text-white rounded-full transition-all uppercase text-xs font-sans font-bold tracking-[0.2em]">
        Quay lại cửa hàng
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-zinc-950 selection:bg-[#0D9488] selection:text-white relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[200px] left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[300px] right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />

      {/* Breadcrumb sub-bar */}
      <div className="bg-[#F9F9FB] dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Cửa hàng', href: '/shop' },
              { label: product.name }
            ]}
            backLink="/shop"
            backLabel="Quay lại cửa hàng"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 h-full">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 h-full">
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md border-t-4 border-t-[#0D9488] flex flex-col gap-4">
              <div className="relative bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 aspect-square overflow-hidden shadow-inner flex items-center justify-center rounded-xl">
                <Image
                  src={getImageUrl(product.images?.[activeImage] || '')}
                  alt={product.name}
                  fill
                  className="object-contain p-8 md:p-12 transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200 bg-white dark:bg-zinc-950 border rounded-lg cursor-pointer ${activeImage === index
                        ? 'border-[#0D9488] ring-2 ring-[#0D9488]/20 shadow-md'
                        : 'border-stone-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <Image src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT: Product Details & Actions */}
          <div className="lg:col-span-7 flex flex-col h-full font-sans">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-stone-900 dark:text-white uppercase tracking-wide leading-snug mb-8">
              {product.name}
            </h1>

            {/* Properties List */}
            <div className="flex flex-col gap-5 text-sm mb-8 font-sans">
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-stone-500 font-bold uppercase tracking-wider text-[10px]">Mã sản phẩm:</span>
                <span className="col-span-8 md:col-span-9 font-mono font-bold text-stone-900 dark:text-white bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-2.5 py-1 rounded w-fit text-xs">
                  {product.code}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-stone-500 font-bold uppercase tracking-wider text-[10px]">Hãng sản xuất:</span>
                <span className="col-span-8 md:col-span-9 font-extrabold text-[#0D9488] dark:text-emerald-400 uppercase tracking-widest text-xs">
                  {product.supplierName || 'SensorX'}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-4 md:col-span-3 text-stone-500 font-bold uppercase tracking-wider text-[10px]">Loại sản phẩm:</span>
                <span className="col-span-8 md:col-span-9 font-semibold text-stone-800 dark:text-gray-200">
                  {product.categoryName || 'Chưa cập nhật'}
                </span>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-12 gap-4 items-center pt-5 mt-2 border-t border-stone-200 dark:border-zinc-800/80">
                <span className="col-span-4 md:col-span-3 text-stone-500 font-bold uppercase tracking-wider text-[10px]">Số lượng:</span>
                <div className="col-span-8 md:col-span-9 flex items-center gap-4">
                  <div className="flex items-center bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors border-r border-stone-200 dark:border-zinc-800 disabled:opacity-30 cursor-pointer font-bold"
                      disabled={selectedQuantity <= 1}
                    >-</button>
                    <input
                      type="number"
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-14 h-10 text-center text-sm font-bold text-stone-900 dark:text-white bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors border-l border-stone-200 dark:border-zinc-800 cursor-pointer font-bold"
                    >+</button>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-xs">{product.unitOfQuantityName || 'Cái'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleCreateRFQ}
                className="flex-1 h-12 transition-all duration-300 rounded-full shadow-md font-sans font-bold uppercase tracking-[0.1em] text-xs md:text-sm flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white active:scale-95 relative overflow-hidden cursor-pointer"
              >
                {justAdded ? <Plus size={18} className="animate-spin" /> : <FileText size={18} />}
                Thêm yêu cầu báo giá
                {justAdded && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-white text-[#0D9488] text-[10px] flex items-center justify-center font-black animate-bounce rounded-bl-lg shadow-sm">
                    +
                  </span>
                )}
              </button>

              <button className="w-12 h-12 flex items-center justify-center border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-400 hover:border-stone-850 hover:text-stone-900 transition-all rounded-full shadow-sm cursor-pointer" title="Chia sẻ">
                <Share2 size={18} />
              </button>
            </div>

            {/* Services */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200 dark:border-zinc-800/80 w-full font-sans">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] dark:text-emerald-400">
                  <Truck size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">Giao hàng</span>
                  <span className="block text-xs text-stone-500 font-medium">Toàn quốc</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] dark:text-emerald-400">
                  <Shield size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">Chính hãng</span>
                  <span className="block text-xs text-stone-500 font-medium">100% bảo hành</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] dark:text-emerald-400">
                  <RotateCcw size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">Đổi trả</span>
                  <span className="block text-xs text-stone-500 font-medium">Trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Specifications & Details */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Specs Table */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-heading font-extrabold text-stone-900 dark:text-white uppercase tracking-tight">Thông số kỹ thuật</h2>
                  <div className="h-px bg-stone-200 dark:bg-zinc-800 flex-1" />
                </div>

                {product.attributes && product.attributes.length > 0 ? (
                  <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-md font-sans border-l-4 border-l-[#0D9488]">
                    <ul className="flex flex-col">
                      {product.attributes.map((attr, idx) => (
                        <li key={idx} className={`flex items-start py-3.5 px-5 ${idx % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-transparent'} border-b border-stone-200/50 dark:border-zinc-850/50 last:border-0`}>
                          <span className="text-sm font-semibold text-stone-500 w-1/2 pr-4">{attr.name}</span>
                          <span className="text-sm font-bold text-stone-900 dark:text-white w-1/2 text-right">{attr.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-8 text-center shadow-md font-sans border-l-4 border-l-[#0D9488]">
                    <p className="text-sm text-stone-400 italic">Chưa có dữ liệu thông số kỹ thuật.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Details */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-heading font-extrabold text-stone-900 dark:text-white uppercase tracking-tight">Chi tiết sản phẩm</h2>
                <div className="h-px bg-stone-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 md:p-10 shadow-md rounded-xl overflow-hidden prose prose-sm md:prose-base max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-white prose-headings:uppercase prose-p:text-stone-600 dark:prose-p:text-gray-355 prose-a:text-[#0D9488] dark:prose-a:text-secondary prose-img:rounded-md border-l-4 border-l-[#0D9488]">
                {product.showcase ? (
                  <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-stone-200">
                    <NotionEditor
                      content={product.showcase}
                      editable={false}
                    />
                  </div>
                ) : (
                  <div className="text-center py-20 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 rounded-xl border border-stone-200">
                    <FileText className="text-stone-300 dark:text-zinc-700 mb-4" size={32} strokeWidth={1.5} />
                    <p className="text-stone-500 font-sans font-medium text-sm">Đang cập nhật mô tả chi tiết cho sản phẩm này...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT SECTION */}
        <div className="mt-20 lg:mt-32 pt-16 border-t border-stone-200 dark:border-zinc-850 flex flex-col items-center text-center">
          <h2 className="text-xl font-heading font-extrabold text-stone-900 dark:text-white uppercase tracking-tight mb-2">Bạn cần hỗ trợ thêm?</h2>
          <p className="text-xs font-sans font-extrabold text-stone-400 uppercase tracking-[0.15em] mb-10">Đội ngũ kỹ thuật luôn sẵn sàng 24/7</p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center font-sans">
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex flex-col items-center group p-8 rounded-2xl shadow-md hover:border-[#0D9488] transition-all duration-300 flex-1 cursor-pointer border-t-4 border-t-[#0D9488]">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-[#0D9488] group-hover:text-white transition-all duration-300 text-stone-600 dark:text-gray-300">
                <Phone size={20} />
              </div>
              <a href="tel:+84382116944" className="text-lg font-extrabold text-stone-900 dark:text-white group-hover:text-[#0D9488] transition-colors tracking-tight">+84 382 116 944</a>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">Hỗ trợ trực tiếp</p>
            </div>
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex flex-col items-center group p-8 rounded-2xl shadow-md hover:border-[#0D9488] transition-all duration-300 flex-1 cursor-pointer border-t-4 border-t-[#0D9488]">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-[#0D9488] group-hover:text-white transition-all duration-300 text-stone-600 dark:text-gray-300">
                <Mail size={20} />
              </div>
              <a href="mailto:support@sensorx.com" className="text-lg font-extrabold text-stone-900 dark:text-white group-hover:text-[#0D9488] transition-colors tracking-tight">support@sensorx.com</a>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">Phản hồi qua Email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
