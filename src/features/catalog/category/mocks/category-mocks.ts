import { ProductCategory } from "../models/product-category";

export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-001",
    name: "Cảm biến công nghiệp",
    description: "Các loại cảm biến dùng trong tự động hóa và sản xuất."
  },
  {
    id: "cat-002",
    name: "Cảm biến tiệm cận",
    parentId: "cat-001",
    description: "Cảm biến phát hiện vật thể không tiếp xúc."
  },
  {
    id: "cat-003",
    name: "Cảm biến quang học",
    parentId: "cat-001",
    description: "Cảm biến sử dụng ánh sáng để phát hiện vật thể."
  },
  {
    id: "cat-004",
    name: "Thiết bị đóng cắt",
    description: "Aptomat, Contactor, Rơ le và các thiết bị bảo vệ mạch điện."
  },
  {
    id: "cat-005",
    name: "Bộ lập trình PLC",
    description: "Các bộ điều khiển logic có thể lập trình được."
  },
  {
    id: "cat-006",
    name: "PLC Siemens",
    parentId: "cat-005",
    description: "Dòng sản phẩm PLC từ hãng Siemens."
  },
  {
    id: "cat-007",
    name: "Biến tần & Động cơ",
    description: "Thiết bị điều khiển tốc độ động cơ và các loại động cơ điện."
  }
];
