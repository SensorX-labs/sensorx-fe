'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/shadcn-ui/button';
import { CanAccess } from '@/shared/components/common/can-access';
import InternalPriceService from '@/features/catalog/internal-price/services/internal-price-services';
import { QuoteStatus } from '../../../constants/quote-status';
import { GetDetailQuoteByIdResponse } from '../../../models/quote-detail-response';
import { QuoteAnalysisService } from '../../../services/quote-analysis-service';
import { QuoteService } from '../../../services/quote.service';
import { RejectQuoteModal } from '../quotation-shared';
import { QuotationActions } from './quotation-actions';
import { QuotationAiAnalysis } from './quotation-ai-analysis';
import { QuotationInfo } from './quotation-info';
import { QuotationItemsEdit } from './quotation-items-edit';
import { QuotationItemsView } from './quotation-items-view';

export interface QuotationDetailProps {
  id: string;
  onBack?: () => void;
}

const ANALYSIS_POLL_INTERVAL_MS = 5000;
const ANALYSIS_VISIBLE_STATUSES = new Set<QuoteStatus>([
  QuoteStatus.PENDING,
  QuoteStatus.RETURNED,
  QuoteStatus.APPROVED,
  QuoteStatus.SENT,
  QuoteStatus.ORDERED,
  QuoteStatus.CANCELLED,
  QuoteStatus.EXPIRED,
]);

export default function QuotationDetail({ id, onBack }: QuotationDetailProps) {
  const router = useRouter();
  const [quoteDetail, setQuoteDetail] = useState<GetDetailQuoteByIdResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editNote, setEditNote] = useState('');

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await QuoteService.getQuoteById(id);
      if (response) {
        setQuoteDetail(response);
      }
    } catch (error) {
      console.error('Failed to fetch quote detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    const canLoadAnalysis =
      quoteDetail?.status != null &&
      ANALYSIS_VISIBLE_STATUSES.has(quoteDetail.status);

    if (!id || isEditing || !canLoadAnalysis) {
      setAnalysisLoading(false);
      setAnalysisError(null);
      setAnalysisResult(null);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const loadAnalysis = async () => {
      setAnalysisLoading(true);
      setAnalysisError(null);

      try {
        const quoteAnalysisService = new QuoteAnalysisService();
        const response = await quoteAnalysisService.analyzeQuote(id);
        if (cancelled) return;

        setAnalysisResult(response);

        if (response?.status === 'pending') {
          timeoutId = setTimeout(loadAnalysis, ANALYSIS_POLL_INTERVAL_MS);
        }
      } catch (error: any) {
        if (cancelled) return;
        setAnalysisError(error.message || 'Khong the tai phan tich AI');
      } finally {
        if (!cancelled) {
          setAnalysisLoading(false);
        }
      }
    };

    loadAnalysis();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, isEditing, quoteDetail?.status]);

  const calculateEditTotal = () =>
    editItems.reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const t = Number(item.taxRate) || 0;
      return sum + Math.round((q * p) * (1 + t / 100));
    }, 0);

  const handleEdit = async () => {
    if (!quoteDetail) return;

    setEditItems(quoteDetail.items.map(item => ({
      ...item,
      internalPrice: undefined,
    })));
    setEditNote(quoteDetail.note || '');
    setIsEditing(true);

    try {
      const productIds = quoteDetail.items.map(item => item.productId).filter(Boolean);
      if (productIds.length > 0) {
        const response = await InternalPriceService.getSuggest({ productIds });
        if (response) {
          const priceMap: Record<string, any> = {};
          response.forEach((price: any) => {
            const priceTiers = (price.priceTiers || []).map((t: any) => ({
              quantity: t.quantity,
              priceAmount: t.amount ?? t.priceAmount ?? t.price,
              priceCurrency: t.currency ?? t.priceCurrency,
            }));
            priceMap[price.productId] = { ...price, priceTiers };
          });

          setEditItems(prevItems => prevItems.map(item => ({
            ...item,
            internalPrice: priceMap[item.productId],
          })));
        }
      }
    } catch (error) {
      console.error('Failed to load internal prices:', error);
    }
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
        })),
      };
      await QuoteService.updateQuote(quoteDetail.id, updatePayload);
      setIsEditing(false);
      fetchDetail();
    } catch (error: any) {
      toast.error(`Loi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.submitForApproval(id);
      fetchDetail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.withdraw(id);
      fetchDetail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.publish(id);
      fetchDetail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await QuoteService.approve(id);
      fetchDetail();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsSubmitting(true);
    try {
      await QuoteService.reject(id, { reason });
      fetchDetail();
      toast.success('Tu choi bao gia thanh cong.');
    } catch (error: any) {
      toast.error('Khong the tu choi bao gia.');
    } finally {
      setIsSubmitting(false);
    }
    setIsRejectModalOpen(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Ban co chac chan muon xoa bao gia nay?')) return;
    setIsSubmitting(true);
    try {
      await QuoteService.deleteQuote(id);
      router.push('/sales/quotations');
    } finally {
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

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-blue-600 font-bold uppercase">Đang tải chi tiết báo giá...</div>;
  }

  if (!quoteDetail) {
    return <div className="py-20 text-center text-red-500 font-bold">Không tìm thấy báo giá</div>;
  }

  const canShowAnalysis = ANALYSIS_VISIBLE_STATUSES.has(quoteDetail.status);

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
        {!isEditing && canShowAnalysis && (
          <CanAccess roles={['Manager']}>
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
