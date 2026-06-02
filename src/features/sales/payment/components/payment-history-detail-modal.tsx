import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";
import { PaymentHistoryItem, PaymentHistoryService } from "../services/payment-history-service";
import { Loader2, CreditCard, Calendar, Info, FileText } from "lucide-react";

const formatNumber = (value: number) => value.toLocaleString("vi-VN");

interface PaymentHistoryDetailModalProps {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentHistoryDetailModal({ id, open, onOpenChange }: PaymentHistoryDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaymentHistoryItem | null>(null);

  useEffect(() => {
    if (id && open) {
      setLoading(true);
      PaymentHistoryService.getHistoryById(id)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error("Error loading payment history detail:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto border-gray-200">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold uppercase text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            Chi tiết giao dịch chuyển khoản
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : !data ? (
          <div className="text-center py-12 text-gray-500 italic text-xs">
            Không tìm thấy thông tin giao dịch hoặc có lỗi xảy ra.
          </div>
        ) : (
          <div className="space-y-6 pt-4 text-sm">
            {/* Amount Section */}
            <div className="bg-emerald-50/50 rounded-lg p-5 border border-emerald-100 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Số tiền giao dịch</span>
              <span className="text-3xl font-black text-emerald-600 mt-1">
                +{formatNumber(data.transferAmount)}đ
              </span>
              <span className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(data.transactionDate).toLocaleString("vi-VN")}
              </span>
            </div>

            {/* General Info */}
            <div className="border border-gray-200 bg-white rounded overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase">Thông tin giao dịch</span>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-gray-100 text-xs">
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500 w-1/3">Mã giao dịch (Sepay)</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold">{data.id}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Cổng thanh toán</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold uppercase">{data.gateway}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Số tài khoản chuyển</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold">{data.accountNumber}</td>
                  </tr>
                  {data.subAccount && (
                    <tr>
                      <td className="px-4 py-2.5 font-bold text-gray-500">Tài khoản định danh</td>
                      <td className="px-4 py-2.5 text-gray-900 font-semibold">{data.subAccount}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Nội dung chuyển khoản</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold text-blue-600 bg-blue-50/30 rounded px-1.5 py-0.5">{data.content}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Mã tham chiếu (Ref)</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold">{data.referenceCode}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Số dư tài khoản (Lũy kế)</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold">{formatNumber(data.accumulated)}đ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">Loại giao dịch</td>
                    <td className="px-4 py-2.5 text-gray-900 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${data.transferType === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {data.transferType === 'in' ? 'Tiền vào' : 'Tiền ra'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-gray-500">ID Đơn hàng</td>
                    <td className="px-4 py-2.5 text-gray-700 font-mono text-[10px]">{data.orderId}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Full description */}
            {data.description && (
              <div className="border border-gray-200 bg-white rounded overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700 uppercase">Mô tả tin nhắn SMS gốc</span>
                </div>
                <div className="p-4 bg-gray-50/50 text-xs text-gray-600 leading-relaxed font-mono whitespace-pre-wrap">
                  {data.description}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
