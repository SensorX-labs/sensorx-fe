'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, HeadphonesIcon, Building2 } from 'lucide-react';

export function HomePage() {
  const categories = [
    { name: 'Cảm biến quang điện', image: '/assets/images/section3_banner1.jpeg', link: '/shop?category=photoelectric' },
    { name: 'Cảm biến tiệm cận', image: '/assets/images/section3_banner2.jpeg', link: '/shop?category=proximity' },
    { name: 'Bộ định thời & Bộ đếm', image: '/assets/images/section3_banner3.jpeg', link: '/shop?category=timer-counter' },
    { name: 'Thiết bị an toàn', image: '/assets/images/section4_banner1.jpeg', link: '/shop?category=safety' },
  ];

  const brands = [
    { name: 'Omron', logo: '/assets/images/brands/omron.png' },
    { name: 'Autonics', logo: '/assets/images/brands/autonics.png' },
    { name: 'Panasonic', logo: '/assets/images/brands/panasonic.png' },
    { name: 'Schneider', logo: '/assets/images/brands/schneider.png' },
    { name: 'Keyence', logo: '/assets/images/brands/keyence.png' },
    { name: 'Honeywell', logo: '/assets/images/brands/honeywell.png' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/images/hero_section_1.jpeg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex items-center">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Nền tảng mua sắm thiết bị tự động hóa B2B
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Giải Pháp Cảm Biến & <br />
              <span className="text-brand-green">Tự Động Hóa</span> Công Nghiệp
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Cung cấp hơn 50,000+ sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới. Báo giá nhanh chóng, giao hàng tận nhà máy, hỗ trợ kỹ thuật chuyên sâu.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-white font-bold text-sm uppercase tracking-widest hover:bg-brand-green/90 transition-all group"
              >
                Khám phá danh mục
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/transactions"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all"
              >
                Yêu cầu báo giá ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Value Proposition */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Chính hãng 100%', desc: 'Đầy đủ CO/CQ từ nhà sản xuất' },
              { icon: Truck, title: 'Giao hàng tốc hành', desc: 'Mạng lưới logistics toàn quốc' },
              { icon: Building2, title: 'Giá sỉ cho doanh nghiệp', desc: 'Chính sách chiết khấu linh hoạt' },
              { icon: HeadphonesIcon, title: 'Hỗ trợ kỹ thuật 24/7', desc: 'Đội ngũ kỹ sư giàu kinh nghiệm' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-full shadow-sm shrink-0">
                  <feature.icon className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-1.5">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="meta-label text-brand-green uppercase mb-2">Danh mục nổi bật</p>
              <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Giải pháp theo ngành nghề</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 hover:text-brand-green transition-colors group">
              Xem tất cả danh mục <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} href={cat.link} className="group block relative h-[400px] bg-gray-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white font-bold text-xl uppercase tracking-widest group-hover:text-brand-green transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Khám phá <ArrowRight className="w-4 h-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-800 text-center">
            {[
              { value: '50K+', label: 'Sản phẩm đa dạng' },
              { value: '500+', label: 'Đối tác doanh nghiệp' },
              { value: '20+', label: 'Thương hiệu toàn cầu' },
              { value: '99%', label: 'Tỷ lệ hài lòng' }
            ].map((stat, idx) => (
              <div key={idx} className="pt-8 md:pt-0">
                <div className="text-5xl font-bold text-brand-green mb-4">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <p className="meta-label text-brand-green uppercase mb-2">Mạng lưới đối tác</p>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Thương hiệu tin cậy</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
            {brands.map((brand, idx) => (
              <div key={idx} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all cursor-pointer">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = "font-bold text-xl text-gray-400 uppercase tracking-widest flex h-full items-center justify-center";
                      span.innerText = brand.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
