import { Rfq } from '../models/rqf';
import { RfqStatus } from '../constants/rfq-status';

export const MOCK_RFQS: Rfq[] = [
  {
    id: '1',
    code: 'RFQ-001',
    status: RfqStatus.PENDING,
    userId: null,
    customerId: 'CUS-001',
    createdAt: '2024-03-20T08:00:00Z',
    items: [
      {
        productCode: 'PROD-001',
        productName: 'Cảm biến nhiệt độ công nghiệp',
        quantity: 10,
        unit: 'Cái',
        category: 'Sensors'
      },
      {
        productCode: 'PROD-002',
        productName: 'Module điều khiển PLC',
        quantity: 2,
        unit: 'Bộ',
        category: 'Controllers'
      }
    ],
    customerInfo: {
      companyName: 'Công ty TNHH Giải pháp Công nghệ Việt',
      recipientName: 'Nguyễn Văn A',
      email: 'a.nguyen@techsolutions.vn',
      recipientPhone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      taxCode: '0101234567'
    },
    logs: [
      { action: 'Khách hàng tạo yêu cầu', timestamp: '2024-03-20T08:00:00Z' }
    ]
  },
  {
    id: '2',
    code: 'RFQ-002',
    status: RfqStatus.ACCEPTED,
    userId: 'SLS-001',
    customerId: 'CUS-002',
    createdAt: '2024-03-19T14:30:00Z',
    items: [
      {
        productCode: 'PROD-005',
        productName: 'Cảm biến áp suất 0-10 bar',
        quantity: 5,
        unit: 'Cái',
        category: 'Sensors'
      }
    ],
    customerInfo: {
      companyName: 'Tập đoàn Sản xuất ABC',
      recipientName: 'Trần Thị B',
      email: 'b.tran@abccorp.com',
      recipientPhone: '0912345678',
      address: '456 Khu Công nghiệp, Bình Dương',
      taxCode: '0108889999'
    },
    logs: [
      { action: 'Khách hàng tạo yêu cầu', timestamp: '2024-03-19T14:30:00Z' },
      { action: 'Nhân viên SLS-001 tiếp nhận', timestamp: '2024-03-19T15:00:00Z' }
    ]
  },
  {
    id: '3',
    code: 'RFQ-003',
    status: RfqStatus.CONVERTED,
    userId: 'SLS-002',
    customerId: 'CUS-003',
    createdAt: '2024-03-18T09:00:00Z',
    items: [
      {
        productCode: 'PROD-012',
        productName: 'Cáp tín hiệu chống nhiễu 2x0.75mm',
        quantity: 200,
        unit: 'Mét',
        category: 'Cables'
      },
      {
        productCode: 'PROD-015',
        productName: 'Đầu nối công nghiệp M12',
        quantity: 20,
        unit: 'Cái',
        category: 'Accessories'
      }
    ],
    customerInfo: {
      companyName: 'Cửa hàng Điện máy Quang Minh',
      recipientName: 'Lê Văn C',
      email: 'c.le@quangminh.vn',
      recipientPhone: '0987654321',
      address: '789 Đường XYZ, Đà Nẵng',
      taxCode: '0401112223'
    },
    logs: [
      { action: 'Khách hàng tạo yêu cầu', timestamp: '2024-03-18T09:00:00Z' },
      { action: 'Nhân viên SLS-002 tiếp nhận', timestamp: '2024-03-18T10:00:00Z' },
      { action: 'Đã chuyển thành đơn hàng', timestamp: '2024-03-18T16:00:00Z' }
    ]
  },
  {
    id: '4',
    code: 'RFQ-004',
    status: RfqStatus.REJECTED,
    userId: 'SLS-001',
    customerId: 'CUS-004',
    createdAt: '2024-03-20T11:00:00Z',
    items: [],
    customerInfo: {
      companyName: 'Xưởng Cơ khí Thành Công',
      recipientName: 'Phạm Văn D',
      email: 'd.pham@thanhcong.vn',
      recipientPhone: '0977889900',
      address: '101 Đường DEF, Hà Nội',
      taxCode: '0105556667'
    },
    logs: [
      { action: 'Khách hàng tạo yêu cầu', timestamp: '2024-03-20T11:00:00Z' },
      { action: 'Từ chối: Khách hàng yêu cầu mặt hàng không kinh doanh', timestamp: '2024-03-20T11:30:00Z' }
    ]
  },
  {
    id: '5',
    code: 'RFQ-005',
    status: RfqStatus.PENDING,
    userId: null,
    customerId: 'CUS-005',
    createdAt: '2024-03-20T13:00:00Z',
    items: [],
    customerInfo: {
      companyName: 'Nội thất Xinh',
      recipientName: 'Hoàng Thị E',
      email: 'e.hoang@noithatxinh.com',
      recipientPhone: '0933445566',
      address: '202 Đường GHI, Cần Thơ',
      taxCode: '1809998887'
    },
    logs: [
      { action: 'Khách hàng tạo yêu cầu', timestamp: '2024-03-20T13:00:00Z' }
    ]
  }
];
