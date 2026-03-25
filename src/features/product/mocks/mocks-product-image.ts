import { ProductImage } from '@/features/product/models';

export const mockProductImages: ProductImage[] = [
  {
    id: 'img-001',
    productId: 'prod-001',
    imageUrl: '/assets/images/products/cambienapsuat.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-002',
    productId: 'prod-002',
    imageUrl: '/assets/images/products/cambiennhietdo.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-003',
    productId: 'prod-003',
    imageUrl: '/assets/images/products/nutnhanvuong.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-004',
    productId: 'prod-004',
    imageUrl: '/assets/images/products/congtackhongtiepxucloaitutinh.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-005',
    productId: 'prod-005',
    imageUrl: '/assets/images/products/bokhuechdaisoiquanghienthikep.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-006',
    productId: 'prod-006',
    imageUrl: '/assets/images/products/cambienapsuat.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-007',
    productId: 'prod-007',
    imageUrl: '/assets/images/products/cambiennhietdo.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-008',
    productId: 'prod-008',
    imageUrl: '/assets/images/products/cambientiemcancamungtuloaihinhtru.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-009',
    productId: 'prod-009',
    imageUrl: '/assets/images/products/nutnhanvuong.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-010',
    productId: 'prod-010',
    imageUrl: '/assets/images/products/congtacantoan.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-011',
    productId: 'prod-011',
    imageUrl: '/assets/images/products/cambiensieuamloaihinhtru.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-012',
    productId: 'prod-012',
    imageUrl: '/assets/images/products/cambientamnhinloaimau04m.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-013',
    productId: 'prod-013',
    imageUrl: '/assets/images/products/cambienquangdienloainnhogonkhoangcachphathiendai.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-014',
    productId: 'prod-014',
    imageUrl: '/assets/images/products/bodieukhiencongsuatdakenhloaimodun.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'img-015',
    productId: 'prod-015',
    imageUrl: '/assets/images/products/cambienvitriloaituyentinhcamungtu.webp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockProductImagesByProductId = (productId: string) => {
  return mockProductImages.filter((img) => img.productId === productId);
};
