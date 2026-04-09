import { InvoiceStatus } from "../enums/invoice-status";
import { PaymentMethod } from "../enums/payment-method";
import { PaymentStatus } from "../enums/payment-status";
import { Invoice } from "../models/invoice";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    code: "INV-24001",
    orderId: "ord-001",
    companyName: "Công ty TNHH Giải pháp Công nghệ Việt",
    taxtCode: "0101234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    email: "accounting@techsolutions.vn",
    invoiceSymbol: "1C24TAA",
    invoiceNumber: "0000001",
    taxAuthorityCode: "T123456789-001",
    issueAt: "2024-03-25T10:30:00Z",
    subTotal: 7950000,
    taxAmount: 795000,
    grandTotal: 8745000,
    amountPaid: 8745000,
    status: InvoiceStatus.PAID,
    items: [
      {
        id: "ii-001",
        productId: "prod-001",
        productName: "Cảm biến áp suất - ATM Series | Omron",
        unit: "Cái",
        quantity: "5",
        unitPrice: 1250000,
        taxtRate: 10,
        lineAmount: 6250000,
        taxtAmount: 625000,
        totalLineAmount: 6875000
      },
      {
        id: "ii-002",
        productId: "prod-002",
        productName: "Cảm biến nhiệt độ - LPO Series | Autonics",
        unit: "Cái",
        quantity: "2",
        unitPrice: 850000,
        taxtRate: 10,
        lineAmount: 1700000,
        taxtAmount: 170000,
        totalLineAmount: 1870000
      }
    ],
    payments: [
      {
        id: "pay-001",
        invoiceId: "inv-001",
        orderId: "ord-001",
        amount: 8745000,
        method: PaymentMethod.BANKTRANSFER,
        status: PaymentStatus.COMPLETED,
        transactionDate: "2024-03-25T11:00:00Z",
        bankTransactionId: "FT2403250001",
        transferContent: "Thanh toan hoa don INV-24001"
      }
    ]
  },
  {
    id: "inv-002",
    code: "INV-24002",
    orderId: "ord-002",
    companyName: "Hệ thống Bán lẻ WinMart",
    taxtCode: "0301234888",
    address: "Số 72 Ngô Quyền, Phường 6, Quận 5, TP.HCM",
    email: "finance@winmart.vn",
    invoiceSymbol: "1C24TBB",
    invoiceNumber: "0000002",
    taxAuthorityCode: "T123456789-002",
    issueAt: "2024-03-26T15:00:00Z",
    subTotal: 4500000,
    taxAmount: 450000,
    grandTotal: 4950000,
    amountPaid: 0,
    status: InvoiceStatus.UNPAID,
    items: [
      {
        id: "ii-003",
        productId: "prod-003",
        productName: "Nút nhấn vuông O30 - SQ3PFS Series",
        unit: "Bộ",
        quantity: "10",
        unitPrice: 450000,
        taxtRate: 10,
        lineAmount: 4500000,
        taxtAmount: 450000,
        totalLineAmount: 4950000
      }
    ],
    payments: []
  }
];

export const getInvoiceById = (id: string) => MOCK_INVOICES.find(inv => inv.id === id);
export const getInvoicesByOrderId = (orderId: string) => MOCK_INVOICES.filter(inv => inv.orderId === orderId);
export const getInvoicesByStatus = (status: InvoiceStatus) => MOCK_INVOICES.filter(inv => inv.status === status);
