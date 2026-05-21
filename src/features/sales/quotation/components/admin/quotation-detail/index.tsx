'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { CanAccess } from '@/shared/components/common/can-access';
import { QuoteStatus } from '../../../constants/quote-status';
import { GetDetailQuoteByIdResponse } from '../../../models/quote-detail-response';
import { QuoteAnalysisService } from '../../../services/quote-analysis-service';
import { QuoteService } from '../../../services/quote.service';
import { RejectQuoteModal } from '../quotation-shared';
import { toast } from 'sonner';

import { QuotationActions } from './quotation-actions';
import { QuotationAiAnalysis } from './quotation-ai-analysis';
import { QuotationInfo } from './quotation-info';
import { QuotationItemsView } from './quotation-items-view';
import { QuotationItemsEdit } from './quotation-items-edit';

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

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editNote, setEditNote] = useState('');

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

  const calculateEditTotal = () =>
    editItems.reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const t = Number(item.taxRate) || 0;
      return sum + Math.round((q * p) * (1 + t / 100));
    }, 0);

  const handleEdit = () => {
    if (!quoteDetail) return;
    setEditItems(quoteDetail.items.map(item => ({
      ...item,
      internalPrice: undefined, // Add internal price fetching here if needed later
    })));
    setEditNote(quoteDetail.note || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!quoteDetail) return;
    setIsSubmitting(true);
    try {
      const updatePayload = {
        rfqId: quoteDetail.rfqId,
        note: editNote,
        items: editItems.map(i => ({
          productId: i.productId,
          unitPrice: i.unitPrice,
          taxRate: i.taxRate,
        }))
      };
      await QuoteService.updateQuote(quoteDetail.id, updatePayload);
      setIsEditing(false);
      fetchDetail();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-2xl font-bold admin-title uppercase">
              {isEditing ? 'Chỉnh sửa báo giá' : 'Chi tiết báo giá'}
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Mã báo giá: {quoteDetail.code}</p>
          </div>
        </div>

        <QuotationActions
          status={quoteDetail.status}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEdit={handleEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onSubmitForApproval={handleSubmitForApproval}
          onWithdraw={handleWithdraw}
          onPublish={handlePublish}
          onApprove={handleApprove}
          onRejectClick={() => setIsRejectModalOpen(true)}
          onDelete={handleDelete}
        />
        <RejectQuoteModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleReject}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!isEditing && (
          <CanAccess roles={['Admin', 4]}>
            <QuotationAiAnalysis
              analysisLoading={analysisLoading}
              analysisResult={analysisResult}
              analysisError={analysisError}
            />
          </CanAccess>
        )}

        <QuotationInfo quoteDetail={quoteDetail} />

        {isEditing ? (
          <QuotationItemsEdit
            editItems={editItems}
            setEditItems={setEditItems}
            editNote={editNote}
            setEditNote={setEditNote}
            calculateTotal={calculateEditTotal}
          />
        ) : (
          <QuotationItemsView quoteDetail={quoteDetail} />
        )}
      </div>
    </div>
  );
}
