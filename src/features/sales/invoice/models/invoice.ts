import { InvoiceStatus } from "../enums/invoice-status";
import { InvoiceItem } from "./invoice-item";
import { Payment } from "./payment";

export interface Invoice {
  id: string;
  code: string;
  orderId: string;
  companyName: string;
  taxCode: string;
  address: string;
  email: string;
  invoiceSymbol: string;
  invoiceNumber: string;
  taxAuthorityCode: string;
  issueAt: string;
  expectedTransferSyntax?: string;
  subTotal: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  payments?: Payment[];
}

export interface InvoiceListItem {
  id: string;
  code: string;
  orderId: string;
  companyName: string;
  taxCode: string;
  status: InvoiceStatus;
  issueAt: string;
  grandTotal: number;
  amountPaid: number;
  itemCount: number;
  createdAt: string;
}
