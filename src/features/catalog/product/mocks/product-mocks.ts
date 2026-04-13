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
      { imageUrl: "/assets/images/products/cambientiemcancamungtuloaihinhtru.webp" }
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
      { imageUrl: "/assets/images/products/bodieukhiencongsuatdakenhloaimodun.webp" }
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
      { imageUrl: "/assets/images/products/bochuyendoi.webp" }
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
    productImages: [
      { imageUrl: "/assets/images/products/relaybandan.webp" }
    ],
    productAttributes: [
      { attributeName: "Dòng định mức", attributeValue: "12A" },
      { attributeName: "Điện áp coil", attributeValue: "220V AC" }
    ]
  },
  {
    id: "prod-005",
    code: "SX-005",
    name: "Cảm biến quang điện BJ15M-TDT",
    manufacturer: "Autonics",
    category: {
      id: "cat-002",
      name: "Cảm biến quang"
    },
    status: ProductStatus.ACTIVE,
    unit: "Cái",
    productImages: [
      { imageUrl: "/assets/images/products/cambienquangdienloainhogon.webp" }
    ],
    productAttributes: [
      { attributeName: "Khoảng cách phát hiện", attributeValue: "15m" },
      { attributeName: "Nguồn cấp", attributeValue: "12-24VDC" }
    ]
  },
  {
    id: "prod-006",
    code: "SX-006",
    name: "Bộ định thời Analog H3CR-A",
    manufacturer: "Omron",
    category: {
      id: "cat-010",
      name: "Bộ định thời"
    },
    status: ProductStatus.ACTIVE,
    unit: "Cái",
    productImages: [
      { imageUrl: "/assets/images/products/bodinhthoianalog.webp" }
    ],
    productAttributes: [
      { attributeName: "Dải thời gian", attributeValue: "0.05s to 300h" },
      { attributeName: "Chế độ hoạt động", attributeValue: "Multi-mode" }
    ]
  },
  {
    id: "prod-007",
    code: "SX-007",
    name: "Cảm biến an toàn SFS-600",
    manufacturer: "SensorX",
    category: {
      id: "cat-011",
      name: "Thiết bị an toàn"
    },
    status: ProductStatus.ACTIVE,
    unit: "Bộ",
    productImages: [
      { imageUrl: "/assets/images/products/cambienantoan.webp" }
    ],
    productAttributes: [
      { attributeName: "Độ phân giải", attributeValue: "25mm" },
      { attributeName: "Chiều cao bảo vệ", attributeValue: "600mm" }
    ]
  }
];
