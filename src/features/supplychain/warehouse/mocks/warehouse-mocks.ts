import { Warehouse } from "../models/warehouse";

export const MOCK_WAREHOUSES: Warehouse[] = [
    {
        id: "wh-001",
        name: "Kho chính (Main Warehouse)"
    },
    {
        id: "wh-002",
        name: "Kho trung chuyển (Transit Warehouse)"
    },
    {
        id: "wh-003",
        name: "Kho linh kiện (Spare Parts Warehouse)"
    },
    {
        id: "wh-004",
        name: "Kho thành phẩm (Finished Goods Warehouse)"
    }
];
