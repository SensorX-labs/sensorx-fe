import { SupplyRequest } from "../models/supply-request";
import { SupplyRequestStatus } from "../enums/supply-request-status";

export const MOCK_SUPPLY_REQUESTS: SupplyRequest[] = [
    {
        id: "sr-001",
        warehouseId: "wh-001",
        status: SupplyRequestStatus.PENDING,
        note: "Yêu cầu bổ sung cảm biến cho dự án mới",
        items: [
            {
                id: "sri-001",
                productId: "prod-001",
                requestedQuantity: 50
            },
            {
                id: "sri-002",
                productId: "prod-005",
                requestedQuantity: 100
            }
        ]
    },
    {
        id: "sr-002",
        warehouseId: "wh-002",
        status: SupplyRequestStatus.COMPLETED,
        note: "Bổ sung PLC và biến tần",
        items: [
            {
                id: "sri-003",
                productId: "prod-002",
                requestedQuantity: 10
            },
            {
                id: "sri-004",
                productId: "prod-003",
                requestedQuantity: 20
            }
        ]
    },
    {
        id: "sr-003",
        warehouseId: "wh-003",
        status: SupplyRequestStatus.PENDING,
        note: "Bổ sung linh kiện đóng cắt",
        items: [
            {
                id: "sri-005",
                productId: "prod-004",
                requestedQuantity: 200
            }
        ]
    },
    {
        id: "sr-004",
        warehouseId: "wh-001",
        status: SupplyRequestStatus.COMPLETED,
        note: "Yêu cầu thiết bị an toàn và bộ định thời",
        items: [
            {
                id: "sri-006",
                productId: "prod-006",
                requestedQuantity: 30
            },
            {
                id: "sri-007",
                productId: "prod-007",
                requestedQuantity: 15
            }
        ]
    }
];
