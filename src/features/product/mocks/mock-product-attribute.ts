import { ProductAttribute } from '@/features/product/models';

/**
 * Mock ProductAttribute Data
 * Thuộc tính chi tiết của các sản phẩm
 */

export const mockProductAttributes: ProductAttribute[] = [
  // Thuộc tính cho Cảm biến áp suất (prod-001)
  {
    id: 'attr-001',
    productId: 'prod-001',
    name: 'Độ chính xác',
    value: '±0.5%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-002',
    productId: 'prod-001',
    name: 'Phạm vi công tác',
    value: '0-100 MPa',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-003',
    productId: 'prod-001',
    name: 'Điện áp hoạt động',
    value: '12-24 VDC',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  // Thuộc tính cho Cảm biến nhiệt độ (prod-002)
  {
    id: 'attr-004',
    productId: 'prod-002',
    name: 'Độ chính xác',
    value: '±1°C',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-005',
    productId: 'prod-002',
    name: 'Phạm vi đo',
    value: '-20 đến +80°C',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  // Thuộc tính cho Nút nhấn (prod-003)
  {
    id: 'attr-006',
    productId: 'prod-003',
    name: 'Kích thước',
    value: '30x30 mm',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-007',
    productId: 'prod-003',
    name: 'Áp suất danh định',
    value: '250 mA @ 250 VAC',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  // Thuộc tính cho Công tắc (prod-004)
  {
    id: 'attr-008',
    productId: 'prod-004',
    name: 'Loại công tắc',
    value: 'Không tiếp xúc',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-009',
    productId: 'prod-004',
    name: 'Dải cách',
    value: '0-15 mm',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-010',
    productId: 'prod-006',
    name: 'Loại đầu ra',
    value: '4-20 mA',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-011',
    productId: 'prod-006',
    name: 'Phạm vi áp suất',
    value: '0-250 Bar',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-012',
    productId: 'prod-007',
    name: 'Loại cảm biến',
    value: 'Pt100',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-013',
    productId: 'prod-007',
    name: 'Độ phân giải',
    value: '0.1°C',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-014',
    productId: 'prod-008',
    name: 'Loại cảm biến',
    value: 'Inductive',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-015',
    productId: 'prod-008',
    name: 'Khoảng cách phát hiện',
    value: '0-30 mm',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-016',
    productId: 'prod-009',
    name: 'Hình dạng',
    value: 'Tròn',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-017',
    productId: 'prod-009',
    name: 'Màu sắc',
    value: 'Đỏ',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-018',
    productId: 'prod-010',
    name: 'Loại công tắc',
    value: 'Giới hạn',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-019',
    productId: 'prod-010',
    name: 'Dòng danh định',
    value: '10A',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-020',
    productId: 'prod-011',
    name: 'Đầu ra',
    value: 'Kỹ thuật số',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-021',
    productId: 'prod-012',
    name: 'Phạm vi đo',
    value: '0-100% RH',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-022',
    productId: 'prod-013',
    name: 'Phạm vi phát hiện',
    value: '0-25 m',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-023',
    productId: 'prod-014',
    name: 'Vị trí',
    value: '3 vị trí',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'attr-024',
    productId: 'prod-015',
    name: 'Điện áp hoạt động',
    value: '24 VDC',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockAttributesByProductId = (productId: string) => {
  return mockProductAttributes.filter((attr) => attr.productId === productId);
};
