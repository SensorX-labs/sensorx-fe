import { StoreFooter, StoreHeader } from '@/layouts/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn-ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/shadcn-ui/carousel';
import { Bookmark } from 'lucide-react';

export default function LandingPage() {
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

                            <button className="inline-flex items-center px-24 py-2.5 bg-brand-green text-white font-semibold tracking-widest text-sm rounded-md hover:opacity-90 hover:-translate-y-1 transition-all duration-200">
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
                                        <div className="relative bg-product-card-landing rounded-none overflow-hidden">
                                            {/* bookmark icon */}
                                            <button className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-300 rounded-full transition-colors">
                                                <Bookmark size={20} className="text-gray-700" fill="white" strokeWidth={1.5} />
                                            </button>

                                            {/* image container */}
                                            <div className="bg-product-card-landing h-64 flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="h-56 w-56 object-contain" />
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
                            <CarouselPrevious className="-left-14 h-12 w-12 aspect-square rounded-none" />
                            <CarouselNext className="-right-14 h-12 w-12 aspect-square rounded-none" />
                        </Carousel>
                    </TabsContent>
                    <TabsContent value="best-seller" className="mt-8">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {bestSellerProducts.map((product) => (
                                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                                        <div className="relative bg-product-card-landing rounded-none overflow-hidden">
                                            {/* bookmark icon */}
                                            <button className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-300 rounded-full transition-colors">
                                                <Bookmark size={20} className="text-gray-700" fill="white" strokeWidth={1.5} />
                                            </button>

                                            {/* image container */}
                                            <div className="bg-product-card-landing h-64 flex items-center justify-center overflow-hidden">
                                                <img src={product.image} alt={product.name} className="h-56 w-56 object-contain" />
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
                            <CarouselPrevious className="-left-14 h-12 w-12 aspect-square rounded-none" />
                            <CarouselNext className="-right-14 h-12 w-12 aspect-square rounded-none" />
                        </Carousel>
                    </TabsContent>
                </Tabs>
            </section>

            <StoreFooter />
        </>
    );
}