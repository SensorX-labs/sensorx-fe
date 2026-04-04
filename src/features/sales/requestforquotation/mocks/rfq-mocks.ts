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
        status: RfqStatus.PENDING
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
        status: RfqStatus.ACCEPTED
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
        status: RfqStatus.DRAFT
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
        status: RfqStatus.REJECTED
    },
    {
        id: "rfq-005",
        code: "RFQ-2024-005",
        userId: "user-001",
        customerId: "cust-005",
        customerInfo: {
            recipientName: "Hoàng Đức L",
            recipientPhone: "0944556677",
            companyName: "Logistics Toàn Cầu",
            email: "lhd@global-log.vn",
            address: "Lô M2, Đường K1, KCN Cát Lái, Quận 2, TP.HCM",
            taxCode: "0708091011"
        },
        status: RfqStatus.NEGOTIATING
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
        status: RfqStatus.CONVERTED
    },
    {
        id: "rfq-007",
        code: "RFQ-2024-007",
        userId: "user-002",
        customerId: "cust-007",
        customerInfo: {
            recipientName: "Bùi Tiến Dũng",
            recipientPhone: "0922334455",
            companyName: "Thép Hòa Phát",
            email: "dungbt@hoaphat.com.vn",
            address: "KCN Phố Nối A, Hưng Yên",
            taxCode: "1011121314"
        },
        status: RfqStatus.RESPONDED
    }
];
