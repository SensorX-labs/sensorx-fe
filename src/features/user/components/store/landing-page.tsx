'use client';

import { useState, useEffect } from 'react';
import { StoreFooter, StoreHeader } from '@/layouts/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/shadcn-ui/carousel';
import { Bookmark } from 'lucide-react';

export default function LandingPage() {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const banners = [
        { src: 'assets/images/banner_6.jpeg', alt: 'Shop the collection' },
        { src: 'assets/images/banner_2.jpeg', alt: 'Collection showcase' },
        { src: 'assets/images/banner_3.jpeg', alt: 'Collection showcase' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const newArrivalProducts = [
        {
            id: 1,
            name: 'Bộ định thời Analog nhỏ gọn',
            serie: 'ATM Series | Omron',
            image: 'assets/images/products/bodinhthoianalog.webp',
        },
        {
            id: 2,
            name: 'Cảm biến vị trí loại tuyến tính cảm ứng từ',
            serie: 'LPD Series | Panasonic',
            image: 'assets/images/products/cambienvitriloaituyentinhcamungtu.webp',
        },
        {
            id: 3,
            name: 'Nút nhấn vuông O30 có lỗ lắp đặt',
            serie: 'SQ3PFS Series | Schneider Electric',
            image: 'assets/images/products/nutnhanvuong.webp',
        },
        {
            id: 4,
            name: 'Công tắc không tiếp xúc loại từ tính',
            serie: 'MN Series | Honeywell',
            image: 'assets/images/products/congtackhongtiepxucloaitutinh.webp',
        },
        {
            id: 5,
            name: 'Bộ khuếch đại sợi quang hiển thị kép & có thể điều chỉnh phạm vi phát hiện',
            serie: 'BFN Series | Keyence',
            image: 'assets/images/products/bokhuechdaisoiquanghienthikep.webp',
        },
        {
            id: 6,
            name: 'Bộ điều khiển công suất đã kênh loại mô-đun',
            serie: 'SPRS Series | Schneider Electric',
            image: 'assets/images/products/bodieukhiencongsuatdakenhloaimodun.webp',
        },
        {
            id: 7,
            name: 'Cảm biến tiệm cận cảm ứng từ loại hình trụ, khoảng cách phát hiện dài, toàn thân kim loại',
            serie: 'PRFD-K | Autonics',
            image: 'assets/images/products/cambientiemcancamungtuloaihinhtru.webp',
        },
        {
            id: 8,
            name: 'Cảm biến hình ảnh màu / đơn sắc 0.3 M , 1.2 M',
            serie: 'VG2 Series | Autonics',
            image: 'assets/images/products/cambienhinhanhmaudonsac.webp',
        },
        {
            id: 9,
            name: 'Cảm biến siêu âm loại hình trụ',
            serie: 'UTR Series | Omron',
            price: '4,250,000',
            image: 'assets/images/products/cambiensieuamloaihinhtru.webp',
        },
        {
            id: 10,
            name: 'Remote I/O loại mỏng',
            serie: 'ARIO Series | Autonics',
            image: 'assets/images/products/remoteioloaimong.webp',
        }
    ];

    const bestSellerProducts = [
        {
            id: 1,
            name: 'Cảm biến áp suất',
            serie: 'ATM Series | Omron',
            image: 'assets/images/products/cambienapsuat.webp',
        },
        {
            id: 2,
            name: 'Cảm biến nhiệt độ',
            serie: 'LPO Series | Autonics',
            image: 'assets/images/products/cambiennhietdo.webp',
        },
        {
            id: 3,
            name: 'Bộ chuyển đổi',
            serie: 'SQ3PFS Series | Schneider Electric',
            image: 'assets/images/products/bochuyendoi.webp',
        },
        {
            id: 4,
            name: 'Còi báo',
            serie: 'MN Series | Panasonic',
            image: 'assets/images/products/coibao.webp',
        },
        {
            id: 5,
            name: 'Đơn vị hiển thị kỹ thuật số phân đoạn lớn',
            serie: 'MN Series | Panasonic',
            image: 'assets/images/products/donvihienthikythuatso7phandoanlon.webp',
        },
        {
            id: 6,
            name: 'Bộ điều khiển nguồn',
            serie: 'SPRS Series | Schneider Electric',
            image: 'assets/images/products/bodieukhiennguon.webp',
        },
        {
            id: 7,
            name: 'Relay bán dẫn',
            serie: 'AGO | Autonics',
            image: 'assets/images/products/relaybandan.webp',
        },
        {
            id: 8,
            name: 'Cảm biến tầm nhìn loại màu 0.4 M',
            serie: 'VG2 Series | Autonics',
            image: 'assets/images/products/cambientamnhinloaimau04m.webp',
        },
        {
            id: 9,
            name: 'Công tắc an toàn',
            serie: 'OIT Series | Omron',
            price: '4,250,000',
            image: 'assets/images/products/congtacantoan.webp',
        },
        {
            id: 10,
            name: 'Cảm biến an toàn',
            serie: 'ARIO Series | Autonics',
            image: 'assets/images/products/cambienantoan.webp',
        }
    ];

    const collectionProducts = [
        {
            id: 11,
            name: 'Cảm biến bên cửa tự động',
            serie: 'ADS-A Series | Omron',
            image: 'assets/images/products/cambienbencuatudong.webp',
        },
        {
            id: 12,
            name: 'Cảm biến quang điện loại nhỏ gọn',
            serie: 'LPO Series | Autonics',
            image: 'assets/images/products/cambienquangdienloainhogon.webp',
        },
        {
            id: 13,
            name: 'Cảm biến quang điện loại nhỏ gọn, khoảng cách phát hiện dài',
            serie: 'SQ3PFS Series | Schneider Electric',
            image: 'assets/images/products/cambienquangdienloainnhogonkhoangcachphathiendai.webp',
        },
        {
            id: 14,
            name: 'BY Series loại nhỏ tích hợp bộ khuếch đại',
            serie: 'BY Series | Autonics',
            image: 'assets/images/products/BY_main.webp',
        },
        {
            id: 15,
            name: 'Bộ điều khiển thiết bị an toàn',
            serie: 'SFC Series | Panasonic',
            image: 'assets/images/products/bodieukhienthietbiantoan.webp',
        },
        {
            id: 16,
            name: 'Bộ điều khiển nguồn',
            serie: 'SPRS Series | Schneider Electric',
            image: 'assets/images/products/bodieukhiennguon.webp',
        },
        {
            id: 17,
            name: 'Bộ định thời loại đôi, analog, nhỏ gọn',
            serie: 'ATS8W/ATS11W Series | Autonics',
            image: 'assets/images/products/bodinhthoiloaidoi.webp',
        },
        {
            id: 18,
            name: 'Động cơ bước 5 pha ( loại trục nhỏ gọn)',
            serie: 'AK Series | Autonics',
            image: 'assets/images/products/dongcobuoc5pha.webp',
        }
    ];

    const reviews = [
        {
            id: 1,
            rating: 5,
            title: 'CẢM BIẾN CHÍNH XÁC',
            content: 'Sản phẩm cảm biến rất chính xác, giúp tối ưu hóa quy trình sản xuất của chúng tôi. Hỗ trợ kỹ thuật tuyệt vời!',
            author: 'NGUYỄN VĂN A'
        },
        {
            id: 2,
            rating: 5,
            title: 'LINH KIỆN ĐIỆN TỬ',
            content: 'Chất lượng sản phẩm vượt mong đợi. Giao hàng nhanh và đóng gói chuyên nghiệp.',
            author: 'TRẦN THỊ B'
        },
        {
            id: 3,
            rating: 5,
            title: 'GIẢI PHÁP TOÀN DIỆN',
            content: 'Nhà cung cấp đáng tin cậy với giá cạnh tranh. Sẽ tiếp tục hợp tác lâu dài.',
            author: 'LÊ VĂN C'
        },
        {
            id: 4,
            rating: 5,
            title: 'CÔNG NGHỆ HIỆN ĐẠI',
            content: 'Tích hợp dễ dàng với hệ thống hiện có. Tăng hiệu suất sản xuất đáng kể.',
            author: 'VÕ MINH D'
        },
        {
            id: 5,
            rating: 5,
            title: 'ĐẢM BẢO CHẤT LƯỢNG',
            content: 'Sản phẩm được kiểm tra chất lượng kỹ lưỡng. Độ chính xác cao, bền bỉ và tin cậy.',
            author: 'PHẠM VĂN E'
        }
    ];

    return (
        <>
            <StoreHeader />

            <section className="relative w-full h-[75vh] overflow-hidden">
                {/* background image */}
                <img
                    src="assets/images/hero_section_1.jpeg"
                    alt="hero section"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                {/* content */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="w-[90%] max-w-7xl mx-auto">
                        <div className="max-w-2xl space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-widest">
                                Giải Pháp Cảm Biến <br />
                                <span className="text-brand-green tracking-widest">Hàng Đầu</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/85 tracking-widest">
                                Công nghệ cảm biến hiện đại, chính xác và tin cậy cho mọi ứng dụng
                                công nghiệp
                            </p>

                            <button className="inline-flex items-center px-24 py-2.5 bg-brand-green text-white font-semibold tracking-widest text-sm rounded-md hover:opacity-90 hover:-translate-y-1 transition-all duration-200 hover:cursor-pointer">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <Tabs defaultValue="new-arrivals" className="w-full max-w-7xl mx-auto py-16">
                    <TabsList className="bg-transparent border-0 shadow-none p-0 gap-0 flex w-full">
                        <TabsTrigger
                            value="new-arrivals"
                            className="flex-1 px-4 py-2 text-lg font-medium tracking-widest bg-transparent border-0 rounded-none !shadow-none ring-0 focus:ring-0 focus:outline-none text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-gray-900"
                        >
                            Hàng mới về
                        </TabsTrigger>
                        <TabsTrigger value="best-seller" className="flex-1 px-4 py-2 text-lg font-medium tracking-widest bg-transparent border-0 rounded-none !shadow-none ring-0 focus:ring-0 focus:outline-none text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-gray-900">
                            Sản phẩm bán chạy
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new-arrivals" className="mt-8">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {newArrivalProducts.map((product) => (
                                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                                        <div className="relative bg-product-card-landing rounded overflow-hidden cursor-pointer\">
                                            {/* bookmark icon */}
                                            <button className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-300 rounded-full transition-colors">
                                                <Bookmark size={20} className="text-gray-700" fill="white" strokeWidth={1.5} />
                                            </button>

                                            {/* image container */}
                                            <div className="bg-product-card-landing h-80 flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="h-64 w-64 object-contain" />
                                            </div>

                                            {/* info section */}
                                            <div className="p-4 bg-white">
                                                <h3 className="text-base font-semibold text-[#2B3674]">{product.name}</h3>
                                                <p className="text-[#A3AED0] text-xs mt-2 uppercase tracking-wide">{product.serie}</p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-14 top-1/2 -translate-y-1/2 h-12 w-12 aspect-square rounded-none" />
                            <CarouselNext className="-right-14 top-1/2 -translate-y-1/2 h-12 w-12 aspect-square rounded-none" />
                        </Carousel>
                    </TabsContent>
                    <TabsContent value="best-seller" className="mt-8">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {bestSellerProducts.map((product) => (
                                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                                        <div className="relative bg-product-card-landing rounded overflow-hidden cursor-pointer\">
                                            {/* bookmark icon */}
                                            <button className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-300 rounded-full transition-colors">
                                                <Bookmark size={20} className="text-gray-700" fill="white" strokeWidth={1.5} />
                                            </button>

                                            {/* image container */}
                                            <div className="bg-product-card-landing h-80 flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="h-64 w-64 object-contain" />
                                            </div>

                                            {/* info section */}
                                            <div className="p-4 bg-white cursor-pointer">
                                                <h3 className="text-base font-semibold text-[#2B3674]">{product.name}</h3>
                                                <p className="text-[#A3AED0] text-xs mt-2 uppercase tracking-wide">{product.serie}</p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-14 top-1/2 -translate-y-1/2 h-12 w-12 aspect-square rounded-none" />
                            <CarouselNext className="-right-14 top-1/2 -translate-y-1/2 h-12 w-12 aspect-square rounded-none" />
                        </Carousel>
                    </TabsContent>
                </Tabs>
            </section>

            <section className="w-full bg-page-background">
                <div className="max-w-7xl mx-auto px-4 flex gap-8">

                    <div className="w-1/3 relative rounded overflow-hidden h-124">

                        {banners.map((banner, index) => (
                            <img
                                key={index}
                                src={banner.src}
                                alt={banner.alt}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                    index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}
                        
                        <div className="absolute inset-0 bg-black/20 flex items-end p-8 z-10">
                            <h2 className="text-xl font-bold text-white underline tracking-widest">
                                SHOP THE COLLECTION
                            </h2>
                        </div>
                    </div>

                    <div className="w-2/3 flex items-center">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {collectionProducts.map((product) => (
                                    <CarouselItem key={product.id} className="lg:basis-1/3 md:basis-1/2">
                                        <div className="relative rounded overflow-hidden group cursor-pointer">

                                            {/* bookmark icon */}
                                            <button className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-300 rounded-full transition-colors">
                                                <Bookmark size={20} className="text-gray-600" fill="none" strokeWidth={1.5} />
                                            </button>

                                            {/* image container */}
                                            <div className="bg-product-card-landing h-84 flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="h-56 w-56 object-contain" />
                                            </div>

                                            {/* info section */}
                                            <div className="p-4 cursor-pointer">
                                                <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
                                                <p className="text-gray-600 text-xs mt-1 uppercase">{product.serie}</p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 h-10 w-10 aspect-square rounded-none bg-white shadow-md hover:bg-gray-100" />
                            <CarouselNext className="right-2 h-10 w-10 aspect-square rounded-none bg-white shadow-md hover:bg-gray-100" />
                        </Carousel>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section3_banner1.jpeg" 
                                    alt="sensor software" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                SENSOR SOFTWARE
                            </h3>
                        </div>

                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section3_banner2.jpeg" 
                                    alt="ultrasonic sensors" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                ULTRASONIC SENSORS
                            </h3>
                        </div>

                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section3_banner3.jpeg" 
                                    alt="laser distance measurement" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                LASER DISTANCE MEASUREMENT
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-8 text-gray-400 text-3xl tracking-widest">
                        . . . . . . . . . .
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-8 tracking-widest">
                        Cảm biến chính xác và linh kiện điện tử<br />
                        <span className="text-brand-green">Nâng cao hiệu suất sản xuất với công nghệ cảm biến hàng đầu</span>
                    </h2>
                    
                    <div className="mb-8 text-gray-400 text-3xl tracking-widest">
                        . . . . . . . . . .
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section4_banner1.jpeg" 
                                    alt="sensor software" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                SENSOR SOFTWARE
                            </h3>
                        </div>

                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section4_banner2.jpeg" 
                                    alt="ultrasonic sensors" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                ULTRASONIC SENSORS
                            </h3>
                        </div>

                        <div className="flex flex-col">
                            <div className="overflow-hidden rounded mb-6">
                                <img 
                                    src="assets/images/section4_banner3.jpeg" 
                                    alt="laser distance measurement" 
                                    className="w-full h-124 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 underline tracking-widest hover:cursor-pointer">
                                LASER DISTANCE MEASUREMENT
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-16 tracking-widest">
                        Phản Hồi Từ Khách Hàng
                    </h2>
                    
                    <Carousel className="w-full">
                        <CarouselContent>
                            {reviews.map((review) => (
                                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/4">
                                    <div className="bg-page-background p-8 rounded-none h-full flex flex-col">
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <span key={i} className="text-brand-green text-lg">★</span>
                                            ))}
                                            <span className="text-gray-600 text-sm ml-2">{review.rating}/5</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 mb-4">{review.title}</h3>
                                        <p className="text-gray-700 text-sm mb-6 flex-grow">
                                            "{review.content}"
                                        </p>
                                        <p className="text-brand-green font-semibold text-sm">{review.author}</p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-14 top-1/2 -translate-y-1/2 z-20 h-12 w-12 aspect-square rounded-none" />
                        <CarouselNext className="-right-14 top-1/2 -translate-y-1/2 z-20 h-12 w-12 aspect-square rounded-none" />
                    </Carousel>
                </div>
            </section>

            <StoreFooter />
        </>
    );
}