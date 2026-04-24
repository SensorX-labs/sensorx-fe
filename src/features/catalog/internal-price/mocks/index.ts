import { InternalPrice } from '../models';

export const MOCK_INTERNAL_PRICES: InternalPrice[] = [
  {
    id: 'IP-001',
    productId: 'PROD-001',
    productName: 'Cảm biến áp suất công nghiệp P100',
    suggestedPrice: 1500000,
    floorPrice: 1200000,
    status: 'Active',
    createdAt: '2026-01-15T08:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    priceTiers: [
      { quantity: 10, price: 1450000 },
      { quantity: 50, price: 1350000 },
      { quantity: 100, price: 1250000 },
    ],
  },
  {
    id: 'IP-002',
    productId: 'PROD-002',
    productName: 'Van điều khiển điện V200',
    suggestedPrice: 2800000,
    floorPrice: 2400000,
    status: 'ExpiringSoon',
    createdAt: '2026-02-10T09:30:00Z',
    expiryDate: '2026-05-01T23:59:59Z',
    priceTiers: [
      { quantity: 5, price: 2700000 },
      { quantity: 20, price: 2550000 },
    ],
  },
  {
    id: 'IP-003',
    productId: 'PROD-003',
    productName: 'Đồng hồ lưu lượng nước siêu âm U3000',
    suggestedPrice: 12000000,
    floorPrice: 10500000,
    status: 'Inactive',
    createdAt: '2025-11-20T14:15:00Z',
    expiryDate: '2026-03-01T23:59:59Z',
    priceTiers: [
      { quantity: 2, price: 11500000 },
      { quantity: 10, price: 10800000 },
    ],
  },
  {
    id: 'IP-004',
    productId: 'PROD-004',
    productName: 'Module truyền thông I/O ETH-RS485',
    suggestedPrice: 850000,
    floorPrice: 700000,
    status: 'Active',
    createdAt: '2026-03-05T11:00:00Z',
    expiryDate: '2027-03-05T23:59:59Z',
    priceTiers: [
      { quantity: 20, price: 800000 },
      { quantity: 50, price: 750000 },
      { quantity: 200, price: 710000 },
    ],
  },
];

export const MOCK_PRODUCTS = [
  { id: 'P1', code: 'P001', name: 'Product A', brand: 'Siemens', unit: 'Cái' },
  { id: 'P2', code: 'P002', name: 'Product B', brand: 'Schneider', unit: 'Bộ' },
  { id: 'P3', code: 'P003', name: 'Product C', brand: 'ABB', unit: 'Cái' },
  { id: 'P4', code: 'P004', name: 'Product D', brand: 'Omron', unit: 'Cái' },
  { id: 'P5', code: 'P005', name: 'Product E', brand: 'Mitsubishi', unit: 'Bộ' },
];
