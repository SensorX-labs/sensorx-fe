import { ProductCategory } from '@/features/product/models';

export const mockProductCategories: ProductCategory[] = [
  {
    id: 'cat-001',
    name: 'Cảm biến áp suất',
    parentId: null,
    description: 'Cảm biến đo áp suất trong công nghiệp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'cat-002',
    name: 'Cảm biến nhiệt độ',
    parentId: null,
    description: 'Cảm biến đo nhiệt độ chính xác',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'cat-003',
    name: 'Cảm biến tiệm cận',
    parentId: null,
    description: 'Cảm biến đo khoảng cách từ xa',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'cat-004',
    name: 'Nút nhấn',
    parentId: null,
    description: 'Các loại nút nhấn điều khiển',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'cat-005',
    name: 'Công tắc',
    parentId: null,
    description: 'Các loại công tắc điều khiển',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockProductCategoryById = (id: string) => {
  return mockProductCategories.find((cat) => cat.id === id);
};

export const mockCategoryByName = (name: string) => {
  return mockProductCategories.find((cat) => cat.name === name);
};
