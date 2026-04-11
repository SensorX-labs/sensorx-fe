import { Product } from "../models/product";
import { ProductStatus } from "../enums/product-status";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    code: "SX-001",
    name: "Cảm biến tiệm cận E2E-X10D1-N",
    manufacturer: "Omron",
    category: {
      id: "cat-002",
      name: "Cảm biến tiệm cận"
    },
    status: ProductStatus.ACTIVE,
    unit: "Cái",
    productImages: [
      { imageUrl: "https://industrial.omron.vn/file/E2E_Square_Large.jpg" },
      { imageUrl: "https://cdn.shopify.com/s/files/1/0563/2261/products/E2E-X10D1-N-Omron.jpg" }
    ],
    productAttributes: [
      { attributeName: "Khoảng cách phát hiện", attributeValue: "10mm" },
      { attributeName: "Kiểu kết nối", attributeValue: "Cáp sẵn 2m" },
      { attributeName: "Điện áp", attributeValue: "12-24 VDC" }
    ],
    productShowcases: [
      { 
        id: "sc-001", 
        summary: "Cảm biến tiệm cận chất lượng cao từ Omron.", 
        body: "Dòng E2E của Omron là tiêu chuẩn thế giới cho độ bền và độ tin cậy trong môi trường công nghiệp." 
      }
    ]
  },
  {
    id: "prod-002",
    code: "SX-002",
    name: "PLC S7-1200 CPU 1214C DC/DC/DC",
    manufacturer: "Siemens",
    category: {
      id: "cat-006",
      name: "PLC Siemens"
    },
    status: ProductStatus.ACTIVE,
    unit: "Bộ",
    productImages: [
      { imageUrl: "https://mall.industry.siemens.com/spice/image/6ES7214-1AG40-0XB0_0.jpg" }
    ],
    productAttributes: [
      { attributeName: "Số đầu vào", attributeValue: "14 DI" },
      { attributeName: "Số đầu ra", attributeValue: "10 DO" },
      { attributeName: "Nguồn cấp", attributeValue: "24 VDC" }
    ],
    productShowcases: [
      { 
        id: "sc-002", 
        summary: "Bộ điều khiển logic lập trình linh hoạt cho các giải pháp tự động hóa vừa và nhỏ.", 
        body: "Siemens S7-1200 cung cấp khả năng tích hợp mạnh mẽ với TIA Portal và hỗ trợ nhiều giao diện truyền thông." 
      }
    ]
  },
  {
    id: "prod-003",
    code: "SX-003",
    name: "Biến tần ATV310 1.5kW 3 pha",
    manufacturer: "Schneider",
    category: {
      id: "cat-007",
      name: "Biến tần & Động cơ"
    },
    status: ProductStatus.ACTIVE,
    unit: "Cái",
    productImages: [
      { imageUrl: "https://www.se.com/vn/vi/product-image/ATV310HU15N4E" }
    ],
    productAttributes: [
      { attributeName: "Công suất", attributeValue: "1.5 kW" },
      { attributeName: "Điện áp vào", attributeValue: "3 pha 380-460V" },
      { attributeName: "Tần số ngõ ra", attributeValue: "0.5...400 Hz" }
    ]
  },
  {
    id: "prod-004",
    code: "SX-004",
    name: "Contactor LC1D12M7 220V",
    manufacturer: "Schneider",
    category: {
      id: "cat-004",
      name: "Thiết bị đóng cắt"
    },
    status: ProductStatus.INACTIVE,
    unit: "Cái",
    productAttributes: [
      { attributeName: "Dòng định mức", attributeValue: "12A" },
      { attributeName: "Điện áp coil", attributeValue: "220V AC" }
    ]
  }
];
