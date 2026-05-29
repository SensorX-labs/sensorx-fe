'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  HeadphonesIcon, 
  Building2, 
  Play, 
  Star, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Eye,
  CheckCircle,
  FileSpreadsheet,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

export function HomePage() {
  const [activeSolution, setActiveSolution] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [rfqEmail, setRfqEmail] = useState('');
  const [rfqSent, setRfqSent] = useState(false);

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

  const solutions = [
    {
      title: 'Kho Vận & Logistics Tự Động',
      description: 'Hệ thống cảm biến phân loại sản phẩm tốc độ cao, đo lường kích thước kiện hàng và định vị AGV thông minh trong nhà kho thông minh.',
      image: '/assets/images/banner_2.jpeg',
      specs: ['Độ trễ phản hồi < 0.5ms', 'Kháng bụi chuẩn IP67/IP69K', 'Kết nối công nghiệp IO-Link', 'Phát hiện mọi bề mặt vật liệu']
    },
    {
      title: 'Chế Tạo & Lắp Ráp Ô Tô',
      description: 'Giải pháp kiểm soát chất lượng chính xác bằng thị giác máy (Vision Sensors) và phát hiện vị trí chính xác micro-mét phục vụ robot hàn/lắp ráp.',
      image: '/assets/images/banner_1.jpeg',
      specs: ['Độ chính xác ±0.1µm', 'Kháng nhiễu điện từ cực tốt', 'Đầu ra tích hợp Profinet', 'Vỏ kim loại chịu lực siêu bền']
    },
    {
      title: 'An Toàn Công Nghiệp Toàn Diện',
      description: 'Hàng rào ánh sáng an toàn, nút dừng khẩn cấp và công tắc liên động giúp bảo vệ tuyệt đối cho vận hành viên xung quanh khu vực robot hoạt động.',
      image: '/assets/images/banner_3.jpeg',
      specs: ['Đạt chuẩn an toàn SIL3/PL e', 'Vùng bảo vệ rộng tới 20m', 'Tự động chuẩn đoán lỗi nội bộ', 'Thời gian phản hồi tắt máy < 15ms']
    },
    {
      title: 'Sản Xuất Linh Kiện Điện Tử',
      description: 'Phát hiện linh kiện siêu nhỏ, kiểm tra chân IC và định vị khay mạch điện tử PCB với độ tin cậy tuyệt đối và tốc độ chu kỳ tối ưu.',
      image: '/assets/images/banner_4.jpeg',
      specs: ['Tia laser siêu mảnh 0.1mm', 'Đầu cảm biến kích thước siêu nhỏ', 'Tần số đáp ứng lên tới 5kHz', 'Chống phản xạ bề mặt kim loại']
    }
  ];

  const hotProducts = [
    {
      name: 'Cảm Biến Áp Suất Kỹ Thuật Số',
      code: 'PSAN-1CA-RC1/8',
      image: '/assets/images/products/cambienapsuat.webp',
      price: '1,850,000đ',
      category: 'Pressure Sensors',
      spec: 'Dải đo: -100.0 to 1000.0 kPa, Ngõ ra: NPN open collector'
    },
    {
      name: 'Bộ Khuếch Đại Sợi Quang Kép',
      code: 'BF5R-D1-N',
      image: '/assets/images/products/bokhuechdaisoiquanghienthikep.webp',
      price: '2,200,000đ',
      category: 'Fiber Optic Sensors',
      spec: 'Màn hình hiển thị kép LCD, Tốc độ đáp ứng: 50µs'
    },
    {
      name: 'Cảm Biến Tiệm Cận Hình Trụ',
      code: 'PR12-4DN',
      image: '/assets/images/products/cambientiemcancamungtuloaihinhtru.webp',
      price: '480,000đ',
      category: 'Proximity Sensors',
      spec: 'Khoảng cách phát hiện: 4mm, Chuẩn chống thấm nước IP67'
    },
    {
      name: 'Bộ Điều Khiển Nhiệt Độ PID',
      code: 'TK4S-14CN',
      image: '/assets/images/products/cambiennhietdo.webp',
      price: '1,560,000đ',
      category: 'Temperature Controllers',
      spec: 'Chu kỳ lấy mẫu siêu nhanh 50ms, Độ chính xác hiển thị ±0.3%'
    }
  ];

  const deployments = [
    { title: 'Dây chuyền lắp ráp ô tô VinFast', location: 'Hải Phòng', image: '/assets/images/banner_5.jpeg' },
    { title: 'Hệ thống phân loại tự động Viettel Post', location: 'Hà Nội', image: '/assets/images/banner_6.jpeg' },
    { title: 'Nhà máy sữa Việt Nam Vinamilk', location: 'Bình Dương', image: '/assets/images/banner_7.jpeg' },
    { title: 'Trạm xử lý nước sạch thông minh', location: 'Đồng Nai', image: '/assets/images/banner_8.jpeg' },
  ];

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqEmail) return;
    setRfqSent(true);
    toast.success('Gửi yêu cầu báo giá nhanh thành công! Tư vấn viên của chúng tôi sẽ liên hệ trong 15 phút.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#042F2E]/95 via-[#042F2E]/80 to-[#FCF9F4] dark:to-background/95 z-10"></div>
          <img 
            src="/assets/images/hero_section_1.jpeg" 
            alt="Industrial automation backdrop" 
            className="w-full h-full object-cover scale-105 animate-pulse duration-[8000ms]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 text-white/95 shadow-xl animate-fade-in-up">
            <Star className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
            <span className="font-sans font-medium text-xs tracking-wider uppercase">Nền tảng mua sắm tự động hóa B2B cao cấp</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
            Giải Pháp Cảm Biến & <br/>
            <span className="text-emerald-400">Tự Động Hóa</span> Công Nghiệp
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 font-light font-sans tracking-wide leading-relaxed">
            Cung cấp hơn 50,000+ sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới. Báo giá nhanh chóng, giao hàng tận nơi, hỗ trợ kỹ thuật chuyên sâu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-sans font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Mua sắm ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-[#FCF9F4] dark:bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Chính hãng 100%', desc: 'Đầy đủ CO/CQ từ nhà sản xuất' },
              { icon: Truck, title: 'Giao hàng tốc hành', desc: 'Mạng lưới logistics toàn quốc' },
              { icon: Building2, title: 'Giá sỉ doanh nghiệp', desc: 'Chính sách chiết khấu linh hoạt' },
              { icon: HeadphonesIcon, title: 'Hỗ trợ kỹ thuật 24/7', desc: 'Đội ngũ kỹ sư giàu kinh nghiệm' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-900 border border-gray-150 p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-full mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs font-sans">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 1: Industry Solutions Showcase */}
      <section className="py-24 bg-white dark:bg-stone-950 border-t border-gray-100 dark:border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold tracking-[0.25em] uppercase text-xs">Giải pháp chuyên biệt</span>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Tự Động Hóa Theo Ngành Nghề</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Tabs Nav */}
            <div className="lg:col-span-4 space-y-3">
              {solutions.map((sol, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSolution(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    activeSolution === idx
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                      : 'bg-[#FCF9F4] dark:bg-stone-900 border-transparent hover:border-gray-200 dark:hover:border-stone-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      activeSolution === idx ? 'bg-white/20 text-white' : 'bg-emerald-600/10 text-emerald-600'
                    }`}>
                      0{idx + 1}
                    </div>
                    <span className="font-bold text-sm tracking-wide">{sol.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeSolution === idx ? 'translate-x-1 text-white' : 'text-gray-400 group-hover:translate-x-1'
                  }`} />
                </button>
              ))}
            </div>

            {/* Right Display Panel */}
            <div className="lg:col-span-8 bg-[#FCF9F4] dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-stone-800 shadow-xl overflow-hidden relative min-h-[460px] flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                {/* Text and specs */}
                <div className="space-y-6">
                  <h3 className="font-heading text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">
                    {solutions[activeSolution].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {solutions[activeSolution].description}
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    {solutions[activeSolution].specs.map((spec, sidx) => (
                      <div key={sidx} className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image layout */}
                <div className="h-[280px] md:h-[350px] relative rounded-2xl overflow-hidden group shadow-lg">
                  <img
                    src={solutions[activeSolution].image}
                    alt={solutions[activeSolution].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] text-white/95 uppercase font-bold tracking-widest bg-emerald-600 px-3 py-1.5 rounded-lg">Hình ảnh thực tế dự án</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold tracking-[0.25em] uppercase text-xs">Phân loại thiết bị</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Danh Mục Nổi Bật</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="bg-[#FCF9F4] dark:bg-stone-900 border border-gray-150 group overflow-hidden hover:-translate-y-2 hover:shadow-lg transition-all duration-500 cursor-pointer block relative h-[380px] rounded-3xl">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent z-10" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-white font-heading font-bold text-lg uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-xs font-sans mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  Khám phá danh mục <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW SECTION 2: Hot Product Showcase */}
      <section className="py-24 bg-[#FCF9F4] dark:bg-stone-900/40 border-t border-b border-gray-150/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold tracking-[0.25em] uppercase text-xs">Sản phẩm bán chạy</span>
              <h2 className="font-heading text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Thiết Bị Tiêu Biểu</h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 uppercase tracking-widest transition-colors group"
            >
              Tất cả sản phẩm <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotProducts.map((prod, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-stone-950 border border-gray-150 dark:border-stone-800 rounded-3xl p-5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Code */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{prod.category}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{prod.code}</span>
                  </div>

                  {/* Image container */}
                  <div className="h-44 w-full relative mb-5 bg-[#FCF9F4] dark:bg-stone-900 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      className="max-h-36 max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/products/default.png';
                      }}
                    />
                  </div>

                  {/* Product title */}
                  <h3 className="font-bold text-sm text-gray-950 dark:text-white line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors h-10">
                    {prod.name}
                  </h3>
                  
                  {/* Specs */}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {prod.spec}
                  </p>
                </div>

                {/* Action */}
                <div className="border-t border-gray-100 dark:border-stone-850 pt-4 flex items-center justify-end mt-auto">
                  <Link 
                    href="/shop"
                    className="flex items-center gap-2 px-4 h-9 rounded-full bg-gray-900 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            {[
              { value: '50K+', label: 'Sản phẩm đa dạng' },
              { value: '500+', label: 'Đối tác doanh nghiệp' },
              { value: '20+', label: 'Thương hiệu toàn cầu' },
              { value: '99%', label: 'Tỷ lệ hài lòng' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4">
                <div className="text-4xl md:text-5xl font-heading font-black text-white mb-2">{stat.value}</div>
                <div className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: Deployment Case Studies Gallery */}
      <section className="py-24 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold tracking-[0.25em] uppercase text-xs">Công trình tiêu biểu</span>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Thư Viện Thực Tế Dự Án</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deployments.map((project, idx) => (
              <div 
                key={idx} 
                className="group relative h-[300px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-stone-850 cursor-pointer"
                onClick={() => setLightboxImage(project.image)}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay & Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-90 transition-all duration-300 p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5">{project.location}</span>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide leading-snug group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* View indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem phóng to ảnh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 4: B2B Procurement Campaign Banner */}
      <section className="py-12 bg-white dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-950 text-white rounded-3xl p-8 md:p-12 border border-gray-900 shadow-2xl relative overflow-hidden">
            {/* Glow blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500 opacity-[0.08] blur-[80px]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Chính sách B2B Partner</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                  Mua Số Lượng Lớn? <br />
                  <span className="text-emerald-400">Yêu Cầu Báo Giá Nhanh</span>
                </h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
                  Gửi ngay danh sách thiết bị cần mua sắm hoặc mã số thuế doanh nghiệp của bạn, đội ngũ chuyên viên SensorX sẽ phản hồi bảng giá ưu đãi chiết khấu sỉ tốt nhất.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Chiết khấu sỉ tới 25%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Hỗ trợ CO/CQ đầy đủ</span>
                  </div>
                </div>
              </div>

              {/* Right Form & Image Grid */}
              <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                {!rfqSent ? (
                  <form onSubmit={handleRfqSubmit} className="space-y-4">
                    <h3 className="font-bold text-base text-white tracking-wide">Nhận bảng giá ưu đãi</h3>
                    <p className="text-xs text-gray-400">Nhập email hoặc số điện thoại của bạn, chúng tôi sẽ liên hệ lại ngay lập tức.</p>
                    
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="your@email.com hoặc số điện thoại" 
                        value={rfqEmail}
                        onChange={(e) => setRfqEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:outline-none px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 transition-colors"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-300"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Yêu cầu bảng giá
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4 animate-fade-in-up">
                    <div className="w-12 h-12 bg-emerald-500/25 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-lg text-white">Yêu cầu đã được ghi nhận!</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Cảm ơn bạn đã quan tâm. Chuyên viên kinh doanh B2B sẽ gửi email báo giá đến bạn sớm nhất.
                    </p>
                    <button 
                      onClick={() => setRfqSent(false)}
                      className="text-xs text-emerald-400 hover:underline tracking-wide font-medium mt-2"
                    >
                      Gửi yêu cầu khác
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Banner Background Preview */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden xl:block translate-x-12 translate-y-12">
              <img 
                src="/assets/images/banner_9.png" 
                alt="B2B Campaign decoration" 
                className="w-[450px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-[#FCF9F4] dark:bg-black/5 border-t border-gray-100 dark:border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold tracking-[0.25em] uppercase text-xs">Mạng lưới đối tác toàn cầu</span>
            <h2 className="font-heading text-3xl font-black text-gray-900 dark:text-white mt-3">Thương Hiệu Tin Cậy</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            {brands.map((brand, idx) => (
              <div key={idx} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = "font-heading font-bold text-lg text-gray-400 uppercase tracking-widest flex h-full items-center justify-center";
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

      {/* Lightbox / Image Preview Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in-up"
          onClick={() => setLightboxImage(null)}
        >
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl relative border border-white/10 shadow-2xl">
            <img 
              src={lightboxImage} 
              alt="Project lightbox preview" 
              className="object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
