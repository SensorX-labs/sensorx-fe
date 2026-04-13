import { InternalPrice } from "../models/internal-price";
import { PriceTier } from "../models/price-tier";

export const MOCK_INTERNAL_PRICES: InternalPrice[] = [
  {
    id: "ip-001",
    productId: "prod-001", // SX-001
    suggestedPrice: 450000,
    floorPrice: 400000,
    priceTiers: [
      { fromQuantity: 1, toQuantity: 10, price: 450000 },
      { fromQuantity: 11, toQuantity: 50, price: 420000 },
      { fromQuantity: 51, price: 405000 }
    ] as PriceTier[]
  },
  {
    id: "ip-002",
    productId: "prod-002", // SX-002
    suggestedPrice: 8500000,
    floorPrice: 8000000,
    priceTiers: [
      { fromQuantity: 1, toQuantity: 2, price: 8500000 },
      { fromQuantity: 3, toQuantity: 5, price: 8200000 },
      { fromQuantity: 6, price: 8050000 }
    ] as PriceTier[]
  },
  {
    id: "ip-003",
    productId: "prod-003", // SX-003
    suggestedPrice: 2800000,
    floorPrice: 2500000,
    priceTiers: [
      { fromQuantity: 1, toQuantity: 5, price: 2800000 },
      { fromQuantity: 6, price: 2600000 }
    ] as PriceTier[]
  },
  {
    id: "ip-004",
    productId: "prod-004", // SX-004
    suggestedPrice: 150000,
    floorPrice: 120000,
    priceTiers: [
      { fromQuantity: 1, price: 150000 }
    ] as PriceTier[]
  },
  {
    id: "ip-005",
    productId: "prod-005", // SX-005
    suggestedPrice: 750000,
    floorPrice: 650000,
    priceTiers: [
      { fromQuantity: 1, toQuantity: 5, price: 750000 },
      { fromQuantity: 6, price: 700000 }
    ] as PriceTier[]
  },
  {
    id: "ip-006",
    productId: "prod-006", // SX-006
    suggestedPrice: 1200000,
    floorPrice: 1000000,
    priceTiers: [
      { fromQuantity: 1, price: 1200000 }
    ] as PriceTier[]
  },
  {
    id: "ip-007",
    productId: "prod-007", // SX-007
    suggestedPrice: 4200000,
    floorPrice: 3800000,
    priceTiers: [
      { fromQuantity: 1, price: 4200000 }
    ] as PriceTier[]
  }
];
