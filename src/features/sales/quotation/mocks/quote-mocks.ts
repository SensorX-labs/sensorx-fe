import { Quote } from "../models/quote";
import { QuoteStatus } from "../constants/quote-status";
import { QuoteResponseStatus } from "../constants/quote-response-status";
import { PaymentMethod } from "../constants/payment-method";
import { PaymentTern } from "../constants/payment-term";

export const MOCK_QUOTES: Quote[] = [
    {
        id: "q-001",
        parentId: null,
        code: "QT-2024-001",
        REQId: "rfq-001",
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
                id: "qi-001",
                productId: "p-001",
                productCode: "SEN-001",
                productName: "Cảm biến áp suất 0-10 bar",
                manufacturer: "Danfoss",
                unit: "Cái",
                quantity: 10,
                unitPrice: 1500000,
                taxRate: 10
            },
            {
                id: "qi-002",
                productId: "p-002",
                productCode: "SEN-002",
                productName: "Cảm biến nhiệt độ Pt100",
                manufacturer: "Autonics",
                unit: "Cái",
                quantity: 5,
                unitPrice: 850000,
                taxRate: 10
            }
        ],
        note: "Báo giá ưu đãi cho khách hàng thân thiết",
        status: QuoteStatus.PENDING,
        response: null,
        quoteDate: "2024-03-20T10:00:00Z"
    },
    {
        id: "q-002",
        parentId: null,
        code: "QT-2024-002",
        REQId: "rfq-002",
        customerId: "cust-002",
        customerInfo: {
            recipientName: "Trần Thị B",
            recipientPhone: "0912345678",
            companyName: "Tập đoàn Điện máy ABC",
            email: "bt@abc-corp.com",
            address: "456 Khu Công nghệ cao, Quận 10, TP.HCM",
            taxCode: "0605040302"
        },
        items: [
            {
                id: "qi-003",
                productId: "p-003",
                productCode: "PLC-001",
                productName: "Bộ lập trình PLC S7-1200",
                manufacturer: "Siemens",
                unit: "Bộ",
                quantity: 2,
                unitPrice: 12000000,
                taxRate: 10
            }
        ],
        note: null,
        status: QuoteStatus.SENT,
        response: {
            responseType: QuoteResponseStatus.ACCEPT,
            paymentMethod: PaymentMethod.BANKTRANSFER,
            paymentTerm: PaymentTern.FULLPAYMENT,
            shippingAddress: "456 Khu Công nghệ cao, Quận 10, TP.HCM",
            feedback: "Chốt báo giá, giao hàng sớm giúp mình."
        },
        quoteDate: "2024-03-15T08:30:00Z"
    },
    {
        id: "q-003",
        parentId: "q-002",
        code: "QT-2024-002-V2",
        REQId: "rfq-002",
        customerId: "cust-002",
        customerInfo: {
            recipientName: "Trần Thị B",
            recipientPhone: "0912345678",
            companyName: "Tập đoàn Điện máy ABC",
            email: "bt@abc-corp.com",
            address: "456 Khu Công nghệ cao, Quận 10, TP.HCM",
            taxCode: "0605040302"
        },
        items: [
            {
                id: "qi-003",
                productId: "p-003",
                productCode: "PLC-001",
                productName: "Bộ lập trình PLC S7-1200",
                manufacturer: "Siemens",
                unit: "Bộ",
                quantity: 2,
                unitPrice: 11500000,
                taxRate: 10
            }
        ],
        note: "Cập nhật giá theo yêu cầu khách hàng",
        status: QuoteStatus.APPROVED,
        response: null,
        quoteDate: "2024-03-18T14:00:00Z"
    },
    {
        id: "q-004",
        parentId: null,
        code: "QT-2024-004",
        REQId: "rfq-004",
        customerId: "cust-004",
        customerInfo: {
            recipientName: "Phạm Minh H",
            recipientPhone: "0933445566",
            companyName: "Xây dựng Hòa Bình",
            email: "hpm@hoabinh.com.vn",
            address: "235 Võ Thị Sáu, Quận 3, TP.HCM",
            taxCode: "0304050607"
        },
        items: [
            {
                id: "qi-004",
                productId: "p-004",
                productCode: "CON-001",
                productName: "Khởi động từ 3 pha 22kW",
                manufacturer: "Schneider",
                unit: "Cái",
                quantity: 20,
                unitPrice: 2200000,
                taxRate: 10
            }
        ],
        note: "Yêu cầu gấp cho công trình Thủ Thiêm",
        status: QuoteStatus.RETURNED,
        response: null,
        quoteDate: "2024-03-21T09:15:00Z"
    },
    {
        id: "q-005",
        parentId: null,
        code: "QT-2024-005",
        REQId: "rfq-006",
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
                id: "qi-005",
                productId: "p-005",
                productCode: "INV-001",
                productName: "Biến tần 5.5kW",
                manufacturer: "ABB",
                unit: "Bộ",
                quantity: 1,
                unitPrice: 9500000,
                taxRate: 10
            }
        ],
        note: null,
        status: QuoteStatus.ORDERED,
        response: {
            responseType: QuoteResponseStatus.ACCEPT,
            paymentMethod: PaymentMethod.CASH,
            paymentTerm: PaymentTern.FULLPAYMENT,
            shippingAddress: "Văn phòng Việt Tiến - 07 Lê Minh Xuân",
            feedback: "Xuất hóa đơn đỏ kèm theo nhé."
        },
        quoteDate: "2024-03-10T16:45:00Z"
    },
    {
        id: "q-006",
        parentId: null,
        code: "QT-2024-006",
        REQId: "rfq-005",
        customerId: "cust-005",
        customerInfo: {
            recipientName: "Hoàng Đức L",
            recipientPhone: "0944556677",
            companyName: "Logistics Toàn Cầu",
            email: "lhd@global-log.vn",
            address: "Lô M2, Đường K1, KCN Cát Lái, Quận 2, TP.HCM",
            taxCode: "0708091011"
        },
        items: [
            {
                id: "qi-006",
                productId: "p-006",
                productCode: "HMI-001",
                productName: "Màn hình HMI 7 inch",
                manufacturer: "Kinco",
                unit: "Cái",
                quantity: 3,
                unitPrice: 4200000,
                taxRate: 10
            }
        ],
        note: "Chiết khấu 5% cho đơn hàng đầu tiên",
        status: QuoteStatus.SENT,
        response: {
            responseType: QuoteResponseStatus.REVISIONREQUIRED,
            paymentMethod: PaymentMethod.ORTHER,
            paymentTerm: PaymentTern.DEPOSIT,
            shippingAddress: "Lô M2, Đường K1, KCN Cát Lái, Quận 2, TP.HCM",
            feedback: "Cần điều chỉnh lại thời hạn bảo hành thành 2 năm."
        },
        quoteDate: "2024-03-22T11:20:00Z"
    },
    {
        id: "q-007",
        parentId: null,
        code: "QT-2024-007",
        REQId: "rfq-008",
        customerId: "cust-008",
        customerInfo: {
            recipientName: "Nguyễn Thị Mai",
            recipientPhone: "0977889900",
            companyName: "FPT Software",
            email: "maintt@fpt.com.vn",
            address: "Lô T2, Đường D1, Khu Công nghệ cao, Quận 9, TP.HCM",
            taxCode: "0405060708"
        },
        items: [
            {
                id: "qi-007",
                productId: "p-007",
                productCode: "CAB-001",
                productName: "Cáp điều khiển 4x1.5mm2",
                manufacturer: "Cadivi",
                unit: "Mét",
                quantity: 100,
                unitPrice: 35000,
                taxRate: 10
            }
        ],
        note: null,
        status: QuoteStatus.EXPIRED,
        response: null,
        quoteDate: "2024-02-15T13:00:00Z"
    }
];
