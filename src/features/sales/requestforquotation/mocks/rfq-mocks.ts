import { Rfq } from "../models/rqf";
import { RfqStatus } from "../constants/rfq-status";

export const MOCK_RFQS: Rfq[] = [
    {
        id: "rfq-001",
        code: "RFQ-2024-001",
        userId: "user-001",
        customerId: "cust-001",
        customerInfo: {
            recipientName: "Nguyễn Văn A",
            recipientPhone: "0901234567",
            companyName: "Công ty TNHH Giải pháp Công nghiệp Việt Nam",
            email: "vana@industry.vn",
            address: "123 Đường Số 1, KCN Tân Bình, TP.HCM",
            taxCode: "0102030405"
        },
        items: [
            {
                id: "ri-001",
                productId: "p-001",
                productCode: "SEN-001",
                productName: "Cảm biến áp suất 0-10 bar",
                manufacturer: "Danfoss",
                unit: "Cái",
                quantity: 10
            }
        ],
        status: RfqStatus.PENDING,
        createdAt: "2024-03-01T08:30:00Z"
    },
    {
        id: "rfq-002",
        code: "RFQ-2024-002",
        userId: "user-001",
        customerId: "cust-002",
        customerInfo: {
            recipientName: "Trần Thị B",
            recipientPhone: "0912345678",
            companyName: "Tập đoàn Điện máy ABC",
            email: "bt@abc-corp.com",
            address: "456 Khu Công nghệ cao, Quận 9, TP.HCM",
            taxCode: "0605040302"
        },
        items: [
            {
                id: "ri-002",
                productId: "p-003",
                productCode: "PLC-001",
                productName: "Bộ lập trình PLC S7-1200",
                manufacturer: "Siemens",
                unit: "Bộ",
                quantity: 2
            }
        ],
        status: RfqStatus.ACCEPTED,
        createdAt: "2024-03-05T10:15:00Z"
    },
    {
        id: "rfq-003",
        code: "RFQ-2024-003",
        userId: null,
        customerId: "cust-003",
        customerInfo: {
            recipientName: "Lê Văn C",
            recipientPhone: "0987654321",
            companyName: "Xưởng Cơ khí Thành Công",
            email: "cv@thanhcong.com.vn",
            address: "78 Đường 3/2, Quận 10, TP.HCM",
            taxCode: "0908070605"
        },
        items: [
            {
                id: "ri-003",
                productId: "p-004",
                productCode: "CON-001",
                productName: "Khởi động từ 3 pha 22kW",
                manufacturer: "Schneider",
                unit: "Cái",
                quantity: 5
            }
        ],
        status: RfqStatus.DRAFT,
        createdAt: "2024-03-10T14:20:00Z"
    },
    {
        id: "rfq-004",
        code: "RFQ-2024-004",
        userId: "user-003",
        customerId: "cust-004",
        customerInfo: {
            recipientName: "Phạm Minh H",
            recipientPhone: "0933445566",
            companyName: "Xây dựng Hòa Bình",
            email: "hpm@hoabinh.com.vn",
            address: "235 Võ Thị Sáu, Quận 3, TP.HCM",
            taxCode: "0304050607"
        },
        items: [],
        status: RfqStatus.REJECTED,
        createdAt: "2024-03-12T09:45:00Z"
    },
    {
        id: "rfq-006",
        code: "RFQ-2024-006",
        userId: "user-004",
        customerId: "cust-006",
        customerInfo: {
            recipientName: "Đặng Thu Thảo",
            recipientPhone: "0966778899",
            companyName: "May mặc Việt Tiến",
            email: "thaodt@viettien.com.vn",
            address: "07 Lê Minh Xuân, Quận Tân Bình, TP.HCM",
            taxCode: "0809101112"
        },
        items: [
            {
                id: "ri-004",
                productId: "p-005",
                productCode: "INV-001",
                productName: "Biến tần 5.5kW",
                manufacturer: "ABB",
                unit: "Bộ",
                quantity: 1
            }
        ],
        status: RfqStatus.CONVERTED,
        createdAt: "2024-03-15T16:00:00Z"
    }
];
