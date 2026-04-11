import { SupplyRequest } from "../models/supply-request";
import { SupplyRequestStatus } from "../enums/supply-request-status";
import { TransferOrderStatus } from "../../transferorder/enums/transfer-order-status";

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
        ],
        purchaseOptions: [
            {
                id: "po-001",
                productId: "prod-001",
                quantity: 50,
                note: "Mua mới từ nhà cung cấp Omron"
            }
        ],
        transferOrders: []
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
        ],
        purchaseOptions: [],
        transferOrders: [
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
        ],
        purchaseOptions: [
            {
                id: "po-002",
                productId: "prod-004",
                quantity: 150,
                note: "Mua 150 cái từ nhà cung cấp"
            }
        ],
        transferOrders: [
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
        ],
        purchaseOptions: [
            {
                id: "po-003",
                productId: "prod-006",
                quantity: 30,
                note: ""
            },
            {
                id: "po-004",
                productId: "prod-007",
                quantity: 15,
                note: ""
            }
        ],
        transferOrders: []
    }
];
