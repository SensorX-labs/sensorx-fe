import { InternalPrice } from '../models';

export const MOCK_INTERNAL_PRICES: InternalPrice[] = [
  {
    id: 'IP-001',
    productId: 'PROD-001',
    productName: 'Cảm biến áp suất công nghiệp P100',
    productCode: 'PROD-001',
    suggestedPrice: 1500000,
    suggestedPriceCurrency: 'VND',
    floorPrice: 1200000,
    floorPriceCurrency: 'VND',
    status: 'Active',
    createdAt: '2026-01-15T08:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    priceTiers: [
      { quantity: 10, price: 1450000, currency: 'VND' },
      { quantity: 50, price: 1350000, currency: 'VND' },
      { quantity: 100, price: 1250000, currency: 'VND' },
    ],
  },
  {
    id: 'IP-002',
    productId: 'PROD-002',
    productName: 'Van điều khiển điện V200',
    productCode: 'PROD-002',
    suggestedPrice: 2800000,
    suggestedPriceCurrency: 'VND',
    floorPrice: 2400000,
    floorPriceCurrency: 'VND',
    status: 'ExpiringSoon',
    createdAt: '2026-02-10T09:30:00Z',
    expiresAt: '2026-05-01T23:59:59Z',
    priceTiers: [
      { quantity: 5, price: 2700000, currency: 'VND' },
      { quantity: 20, price: 2550000, currency: 'VND' },
    ],
  },
  {
    id: 'IP-004',
    productId: 'PROD-004',
    productName: 'Module truyền thông I/O ETH-RS485',
    productCode: 'PROD-004',
    suggestedPrice: 850000,
    suggestedPriceCurrency: 'VND',
    floorPrice: 700000,
    floorPriceCurrency: 'VND',
    status: 'Active',
    createdAt: '2026-03-05T11:00:00Z',
    expiresAt: '2027-03-05T23:59:59Z',
    priceTiers: [
      { quantity: 20, price: 800000, currency: 'VND' },
      { quantity: 50, price: 750000, currency: 'VND' },
      { quantity: 200, price: 710000, currency: 'VND' },
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
