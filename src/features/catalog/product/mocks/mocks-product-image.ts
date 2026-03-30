import { ProductImage } from '@/features/catalog/product/models';

// Base image URLs for different product types
const imagePool = [
  '/assets/images/products/cambienapsuat.webp',
  '/assets/images/products/cambiennhietdo.webp',
  '/assets/images/products/nutnhanvuong.webp',
  '/assets/images/products/congtackhongtiepxucloaitutinh.webp',
  '/assets/images/products/bokhuechdaisoiquanghienthikep.webp',
  '/assets/images/products/cambientiemcancamungtuloaihinhtru.webp',
  '/assets/images/products/congtacantoan.webp',
  '/assets/images/products/cambiensieuamloaihinhtru.webp',
  '/assets/images/products/cambientamnhinloaimau04m.webp',
  '/assets/images/products/cambienquangdienloainnhogonkhoangcachphathiendai.webp',
  '/assets/images/products/bodieukhiencongsuatdakenhloaimodun.webp',
  '/assets/images/products/cambienvitriloaituyentinhcamungtu.webp',
];

// Seeded random function để tránh hydration error - dùng product ID làm seed
// Đảm bảo cùng productId luôn generate cùng random images trên server và client
const seededRandom = (seed: string): number => {
  const x = Math.sin(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) * 10000;
  return x - Math.floor(x);
};

// Helper function để get random images cho product (deterministic dựa trên product ID)
const getRandomImagesForProduct = (productId: string, count: number = 4): string[] => {
  const shuffled = [...imagePool].sort((a, b) => {
    const seedA = seededRandom(productId + a);
    const seedB = seededRandom(productId + b);
    return seedA - seedB;
  });
  return shuffled.slice(0, count);
};

export const mockProductImages: ProductImage[] = [
  // prod-001: Cảm biến áp suất - ATM Series
  ...getRandomImagesForProduct('prod-001', 4).map((url, idx) => ({
    id: `img-001-${idx}`,
    productId: 'prod-001',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-002: Cảm biến nhiệt độ - LPO Series
  ...getRandomImagesForProduct('prod-002', 4).map((url, idx) => ({
    id: `img-002-${idx}`,
    productId: 'prod-002',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-003: Nút nhấn vuông O30 - SQ3PFS Series
  ...getRandomImagesForProduct('prod-003', 4).map((url, idx) => ({
    id: `img-003-${idx}`,
    productId: 'prod-003',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-004: Công tắc không tiếp xúc từ tính - MN Series
  ...getRandomImagesForProduct('prod-004', 4).map((url, idx) => ({
    id: `img-004-${idx}`,
    productId: 'prod-004',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-005: Bộ khiển dạ chỉ
  ...getRandomImagesForProduct('prod-005', 4).map((url, idx) => ({
    id: `img-005-${idx}`,
    productId: 'prod-005',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-006: Cảm biến áp suất cao
  ...getRandomImagesForProduct('prod-006', 3).map((url, idx) => ({
    id: `img-006-${idx}`,
    productId: 'prod-006',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-007: Cảm biến nhiệt độ cao
  ...getRandomImagesForProduct('prod-007', 3).map((url, idx) => ({
    id: `img-007-${idx}`,
    productId: 'prod-007',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-008: Cảm biến tiệm cận
  ...getRandomImagesForProduct('prod-008', 3).map((url, idx) => ({
    id: `img-008-${idx}`,
    productId: 'prod-008',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-009: Nút nhấn tròn
  ...getRandomImagesForProduct('prod-009', 3).map((url, idx) => ({
    id: `img-009-${idx}`,
    productId: 'prod-009',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-010: Công tắc an toàn
  ...getRandomImagesForProduct('prod-010', 3).map((url, idx) => ({
    id: `img-010-${idx}`,
    productId: 'prod-010',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-011: Cảm biến siêu âm
  ...getRandomImagesForProduct('prod-011', 3).map((url, idx) => ({
    id: `img-011-${idx}`,
    productId: 'prod-011',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-012: Cảm biến tầm nhìn
  ...getRandomImagesForProduct('prod-012', 3).map((url, idx) => ({
    id: `img-012-${idx}`,
    productId: 'prod-012',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-013: Cảm biến quang điện
  ...getRandomImagesForProduct('prod-013', 3).map((url, idx) => ({
    id: `img-013-${idx}`,
    productId: 'prod-013',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-014: Bộ điều khiển công suất
  ...getRandomImagesForProduct('prod-014', 3).map((url, idx) => ({
    id: `img-014-${idx}`,
    productId: 'prod-014',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),

  // prod-015: Cảm biến vị trí
  ...getRandomImagesForProduct('prod-015', 3).map((url, idx) => ({
    id: `img-015-${idx}`,
    productId: 'prod-015',
    imageUrl: url,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  })),
];

export const mockProductImagesByProductId = (productId: string) => {
  return mockProductImages.filter((img) => img.productId === productId);
};
