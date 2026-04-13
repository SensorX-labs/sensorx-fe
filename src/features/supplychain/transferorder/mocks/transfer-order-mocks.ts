import { TransferOrder } from "../models/transfer-order";
import { TransferOrderStatus } from "../enums/transfer-order-status";

export const MOCK_TRANSFER_ORDERS: TransferOrder[] = [
    {
        id: "to-001",
        code: "TO-2023-001",
        sourceWarehouseId: "wh-001",
        destinationWarehouseId: "wh-002",
        status: TransferOrderStatus.COMPLETED,
        note: "Điều chuyển từ kho chính",
        supplyRequestId: "sr-002",
        items: [
            {
                id: "toi-001",
                productId: "prod-002",
                productCode: "E2E-X5ME1",
                productName: "Cảm biến tiệm cận Omron",
                unit: "Cái",
                quantity: 10,
                manufacturerName: "Omron"
            },
            {
                id: "toi-002",
                productId: "prod-003",
                productCode: "E3Z-D61",
                productName: "Cảm biến quang Omron",
                unit: "Cái",
                quantity: 20,
                manufacturerName: "Omron"
            }
        ]
    },
    {
        id: "to-002",
        code: "TO-2023-002",
        sourceWarehouseId: "wh-001",
        destinationWarehouseId: "wh-003",
        status: TransferOrderStatus.PROCESSING,
        note: "Điều chuyển 50 cái có sẵn trong kho",
        supplyRequestId: "sr-003",
        items: [
            {
                id: "toi-003",
                productId: "prod-004",
                productCode: "LC1D12M7",
                productName: "Khởi động từ Schneider",
                unit: "Cái",
                quantity: 50,
                manufacturerName: "Schneider"
            }
        ]
    }
];
