import { OrderStatus } from "../enums/order-status";
import { Order } from "../models/order";

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    quoteId: "q-001",
    code: "SO-24001",
    customerId: "CUS-001",
    companyName: "Công ty TNHH Giải pháp Công nghệ Việt",
    recipientName: "Nguyễn Văn A",
    recipientPhone: "0901234567",
    customerEmail: "a.nguyen@techsolutions.vn",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    taxCode: "0101234567",
    senderName: "Bùi Thế Duy",
    senderEmail: "duy.bt@sensorx.vn",
    status: OrderStatus.PendingPayment,
    orderDate: "2024-03-25T10:00:00Z",
    orderItems: [
      {
        id: "oi-001",
        productId: "prod-001",
        productCode: "SENSOR-APM-001",
        manufacturer: "Omron",
        unit: "Cái",
        quantity: 5,
        unitPrice: 1250000,
        taxtRate: 10,
        note: "Hàng có sẵn"
      },
      {
        id: "oi-002",
        productId: "prod-002",
        productCode: "SENSOR-TEMP-002",
        manufacturer: "Autonics",
        unit: "Cái",
        quantity: 2,
        unitPrice: 850000,
        taxtRate: 10
      }
    ]
  },
  {
    id: "ord-002",
    quoteId: "q-002",
    code: "SO-24002",
    customerId: "CUS-002",
    companyName: "Hệ thống Bán lẻ WinMart",
    recipientName: "Trần Thị B",
    recipientPhone: "0912345678",
    customerEmail: "b.tran@winmart.vn",
    address: "Số 72 Ngô Quyền, Phường 6, Quận 5, TP.HCM",
    taxCode: "0301234888",
    senderName: "Lê Văn C",
    senderEmail: "c.le@sensorx.vn",
    status: OrderStatus.Processing,
    orderDate: "2024-03-26T14:30:00Z",
    orderItems: [
      {
        id: "oi-003",
        productId: "prod-003",
        productCode: "BUTTON-SQ3-003",
        manufacturer: "Schneider Electric",
        unit: "Bộ",
        quantity: 10,
        unitPrice: 450000,
        taxtRate: 10,
        note: "Giao gấp"
      }
    ]
  },
  {
    id: "ord-003",
    quoteId: "q-003",
    code: "SO-24003",
    customerId: "CUS-003",
    companyName: "Nhà máy Sữa Vinamilk",
    recipientName: "Phạm Văn C",
    recipientPhone: "0987654321",
    customerEmail: "c.pham@vinamilk.com.vn",
    address: "Khu công nghiệp VSIP, Bình Dương",
    taxCode: "3701234567",
    senderName: "Nguyễn Hoàng Nam",
    senderEmail: "nam.nh@sensorx.vn",
    status: OrderStatus.Dispatched,
    orderDate: "2024-03-27T09:15:00Z",
    orderItems: [
      {
        id: "oi-004",
        productId: "prod-006",
        productCode: "SENSOR-APM-006",
        manufacturer: "Festo",
        unit: "Cái",
        quantity: 8,
        unitPrice: 2100000,
        taxtRate: 10
      }
    ]
  }
];

export const getOrderById = (id: string) => MOCK_ORDERS.find(o => o.id === id);
export const getOrdersByStatus = (status: OrderStatus) => MOCK_ORDERS.filter(o => o.status === status);
