import { UnitOfMeasure } from '@/features/refactor/catalog/product/models';

/**
 * Mock UnitOfMeasure Data
 */

export const mockUnitOfMeasures: UnitOfMeasure[] = [
  {
    id: 'unit-001',
    name: 'Cái',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'unit-002',
    name: 'Bộ',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'unit-003',
    name: 'Hộp',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'unit-004',
    name: 'Kilogam',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const mockUnitOfMeasureById = (id: string) => {
  return mockUnitOfMeasures.find((unit) => unit.id === id);
};
