'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit, CheckCircle, XCircle, Download, Bot, ShoppingCart, MessageSquare, Undo2, Send, Trash2, Link2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/shadcn-ui/button';
import { CanAccess } from '@/shared/components/common/can-access';
import { QuoteStatus } from '../../constants/quote-status';
import { GetDetailQuoteByIdResponse } from '../../models/quote-detail-response';
import { QuoteAnalysisService } from '../../services/quote-analysis-service';
import { QuoteService } from '../../services/quote.service';
import { cn } from '@/shared/utils/cn';
import {
  GeneralInfoCard,
  CustomerInfoCard,
  CustomerResponseCard,
  SenderInfoCard,
  RejectQuoteModal
} from './quotation-shared';
import { toast } from 'sonner';

export interface QuotationDetailProps {
  id: string;
  onBack?: () => void;
}

export default function QuotationDetail({ id, onBack }: QuotationDetailProps) {
  const router = useRouter();
  const [quoteDetail, setQuoteDetail] = useState<GetDetailQuoteByIdResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // AI analysis states
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await QuoteService.getQuoteById(id);
      if (response) {
        setQuoteDetail(response);
        if (response.status === QuoteStatus.PENDING) {
          handleAnalyzeQuote(response.id);
        }
      }
    } catch (error) {
      console.error(">>> Lỗi khi fetch chi tiết báo giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleAnalyzeQuote = async (quoteId: string) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const quoteAnalysisService = new QuoteAnalysisService();
      const response = await quoteAnalysisService.analyzeQuote(quoteId);
      setAnalysisResult(response);
    } catch (error: any) {
      setAnalysisError(error.message || 'Lỗi phân tích báo giá');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Tổng đã được tính sẵn từ backend
  const calculateTotal = () => quoteDetail?.grandTotal ?? 0;

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.submitForApproval(id);
      fetchDetail();
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.withdraw(id);
      fetchDetail();
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.publish(id);
      fetchDetail();
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.approve(id);
      fetchDetail();
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsSubmitting(true);
    try {
      await QuoteService.reject(id, { reason });
      fetchDetail();
      toast.success('Từ chối báo giá thành công.');
    } catch (error: any) {
      toast.error('Lỗi không từ chối được báo giá!');
    } finally {
      setIsSubmitting(false);
    }
    setIsRejectModalOpen(false);
  };


  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo giá này?')) return;
    setIsSubmitting(true);
    try {
      await QuoteService.deleteQuote(id);
      router.push('/sales/quotations');
    } catch (error: any) {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/sales/quotations');
    }
  };

  const handleEdit = () => {
    router.push(`/sales/quotations/${id}?action=edit`);
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-blue-600 font-bold uppercase">Đang tải chi tiết báo giá...</div>;
  if (!quoteDetail) return <div className="py-20 text-center text-red-500 font-bold">Không tìm thấy báo giá</div>;

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleCancel} variant="ghost" size="icon" className="h-9 w-9 border border-gray-200 bg-white hover:bg-gray-100 rounded text-gray-600 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold admin-title uppercase">Chi tiết báo giá</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Mã báo giá: {quoteDetail.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* SaleStaff actions */}
          <CanAccess roles={['SaleStaff']}>
            {/* Draft: Chỉnh sửa + Gửi duyệt */}
            {quoteDetail.status === QuoteStatus.DRAFT && (
              <>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="rounded border-blue-200 text-blue-600 hover:bg-blue-50 h-10 px-6 shadow-sm"
                >
                  <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                </Button>
                <Button
                  onClick={handleSubmitForApproval}
                  disabled={isSubmitting}
                  className="rounded bg-blue-600 hover:bg-blue-700 h-10 px-6 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Đang gửi..." : "Gửi duyệt"}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  variant="outline"
                  className="rounded border-red-200 text-red-600 hover:bg-red-50 h-10 px-6 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Xóa
                </Button>
              </>
            )}
            {/* Pending: Thu hồi */}
            {quoteDetail.status === QuoteStatus.PENDING && (
              <Button
                onClick={handleWithdraw}
                disabled={isSubmitting}
                variant="outline"
                className="rounded border-orange-200 text-orange-600 hover:bg-orange-50 h-10 px-6 shadow-sm"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                {isSubmitting ? "Đang thu hồi..." : "Thu hồi"}
              </Button>
            )}
            {/* Approved: Phát hành */}
            {quoteDetail.status === QuoteStatus.APPROVED && (
              <Button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="rounded bg-indigo-600 hover:bg-indigo-700 h-10 px-6 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isSubmitting ? "Đang phát hành..." : "Phát hành"}
              </Button>
            )}
          </CanAccess>

          {/* Manager actions: chỉ khi Pending */}
          <CanAccess roles={['Manager']}>
            {quoteDetail.status === QuoteStatus.PENDING && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="rounded bg-green-600 hover:bg-green-700 h-10 px-6 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Đang xử lý..." : "Phê duyệt"}
                </Button>
                <Button
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={isSubmitting}
                  variant="outline"
                  className="rounded border-red-200 text-red-600 hover:bg-red-50 h-10 px-6 shadow-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Đang xử lý..." : "Từ chối"}
                </Button>
                <RejectQuoteModal
                  isOpen={isRejectModalOpen}
                  onClose={() => setIsRejectModalOpen(false)}
                  onConfirm={handleReject}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </CanAccess>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CanAccess roles={['Admin', 4]}>
          <div className="md:col-span-3 bg-white border border-gray-100 rounded p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Bot size={16} className={cn((analysisResult?.status === 'pending' || analysisLoading) && "animate-pulse")} />
                <span className="font-bold uppercase tracking-wider text-sm">Phân tích từ AI</span>
              </div>
              {analysisResult && analysisResult.status !== 'pending' && (
                <div className={cn(
                  "text-xl font-black uppercase tracking-tighter px-4 py-1.5 rounded-lg border-2",
                  (() => {
                    const status = analysisResult.analysis?.deal_status || analysisResult.deal_status || "";
                    const s = status.toLowerCase();
                    if (s.includes('rủi ro') || s.includes('risk') || s.includes('cảnh báo')) return 'bg-red-50 text-red-600 border-red-200';
                    if (s.includes('tiềm năng') || s.includes('potential') || s.includes('tốt')) return 'bg-green-50 text-green-600 border-green-200';
                    return 'bg-blue-50 text-blue-600 border-blue-200';
                  })()
                )}>
                  {analysisResult.analysis?.deal_status || analysisResult.deal_status || "N/A"}
                </div>
              )}
            </div>

            {analysisLoading || analysisResult?.status === 'pending' ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <div className="flex items-center gap-3 text-blue-600 font-medium">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <span>{analysisResult?.message || "Hệ thống đang tiến hành phân tích báo giá..."}</span>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900 uppercase text-[10px] bg-gray-100 px-1.5 py-0.5 rounded mr-2">Phân tích</span>
                  {analysisResult.analysis?.reasoning}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900 uppercase text-[10px] bg-gray-100 px-1.5 py-0.5 rounded mr-2">Chiến lược</span>
                  {analysisResult.analysis?.strategy}
                </p>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 bg-blue-50/30 rounded-lg border border-dashed border-blue-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-white p-3 rounded-full shadow-sm border border-blue-100">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-1">Đang chờ phân tích</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                    Hệ thống AI đang chuẩn bị dữ liệu <br /> và phân tích báo giá này
                  </p>
                </div>
              </div>
            )}
          </div>
        </CanAccess>

        <div className="md:col-span-1 space-y-6">
          {/* Thông tin chung - đồng bộ style như order-detail */}
          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium uppercase tracking-wider">Thông tin báo giá</h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 admin-text-primary w-2/5 font-semibold">Mã báo giá</td>
                  <td className="px-6 py-3 font-bold">{quoteDetail.code || '—'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Trạng thái</td>
                  <td className="px-6 py-3">
                    <span className={cn("px-2.5 py-0.5 rounded border text-xs font-medium", "bg-gray-100 text-gray-600 border-gray-200")}>
                      {quoteDetail.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Ngày báo giá</td>
                  <td className="px-6 py-3">
                    {quoteDetail.quoteDate ? new Date(quoteDetail.quoteDate).toLocaleDateString('vi-VN') : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 admin-text-primary font-semibold">Từ RFQ</td>
                  <td className="px-6 py-3">
                    {quoteDetail.rfqId ? (
                      <Link href={`/sales/rfqs/${quoteDetail.rfqId}`} className="text-blue-600 hover:underline">
                        {quoteDetail.rfqId}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lý do từ chối (nếu có) */}
          {quoteDetail.reasonReject && (
            <div className="border border-red-200 bg-red-50 rounded shadow-sm p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-600">Lý do từ chối</div>
                <div className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{quoteDetail.reasonReject}</div>
              </div>
            </div>
          )}

          <CustomerInfoCard customerInfo={quoteDetail.customer} />

          {/* Card feedback khách chỉ hiển thị nếu có phản hồi */}
          {quoteDetail.customerFeedback && (quoteDetail.customerFeedback.responseType || quoteDetail.customerFeedback.feedback) && (
            <CustomerResponseCard customerFeedback={quoteDetail.customerFeedback} />
          )}

          {quoteDetail.sender && <SenderInfoCard senderInfo={quoteDetail.sender} />}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-200 bg-white rounded overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900">Danh sách sản phẩm</h4>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 w-28 text-center">SL</th>
                    <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                    <th className="px-4 py-3 w-28 text-center">Thuế</th>
                    <th className="px-6 py-3 w-32 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quoteDetail.items.map((item, index) => {
                    const lineValue = item.totalLineAmount;

                    return (
                      <tr key={index} className="hover:bg-gray-50/30">
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="font-semibold text-gray-900">{item.productCode}</div>
                          <div className="text-xs text-gray-500 mt-1">Mã: {item.productCode}</div>
                          {item.manufacturer && <div className="text-[10px] text-blue-600 mt-0.5 font-medium">{item.manufacturer}</div>}
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">
                          {item.quantity} {item.unit || 'cái'}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-800">
                          {item.unitPrice}đ
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">
                          {item.taxRate}%
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900 border-l border-gray-50">
                          {lineValue}đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <div className="p-6 bg-gray-50/30 border-t border-gray-100">
                  <div className="ml-auto w-full md:w-80 space-y-3">
                    <div className="flex justify-between text-xs uppercase tracking-wider">
                      <span>Tạm tính:</span>
                      <span>{(quoteDetail.subtotal || 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-xs uppercase tracking-wider">
                      <span>Thuế GTGT:</span>
                      <span>{(quoteDetail.totalTax || 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 text-blue-600">
                      <span>TỔNG CỘNG:</span>
                      <span>{(quoteDetail.grandTotal || 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                </div>
              </table>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
              <MessageSquare size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Ghi chú & Điều khoản bổ sung</h4>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {quoteDetail.note || <span className="text-gray-400 italic">Không có ghi chú bổ sung</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
