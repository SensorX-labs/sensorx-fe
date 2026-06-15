'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, Send, ArrowRight } from 'lucide-react';

import {
  StoreRFQService,
  MyRfqDetail,
  MyRfqDetailCustomer,
} from '../../../services/store-rfq.service';
import { RfqStatus } from '../../../constants/rfq-status';
import { cn } from '@/shared/utils';

import { CustomerCard, SupportCard } from '../components';
import { RfqHeader, RfqTable } from './components';
import { cardClass } from '../Constants/ui.constant';

export function RfqDetailView({
  onBack,
  rfqId,
}: {
  onBack: () => void;
  rfqId?: string;
}) {
  const router = useRouter();
  const [rfq, setRfq] = useState<MyRfqDetail | null>(null);
  const [customer, setCustomer] = useState<MyRfqDetailCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchDetail = async () => {
    if (!rfqId) return;

    try {
      setLoading(true);
      const rfqData = await StoreRFQService.getMyRFQDetail(rfqId);

      if (rfqData) {
        setRfq(rfqData);

        if (rfqData.customer) {
          setCustomer(rfqData.customer);
        }
      }
    } catch (error) {
      console.error('Failed to fetch detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [rfqId]);

  const handleSendRFQ = async () => {
    if (!rfqId) return;

    try {
      setIsSending(true);
      const success = await StoreRFQService.sendRFQ(rfqId);

      if (success) {
        localStorage.removeItem('activeRFQId');
        onBack();
      }
    } catch (error) {
      console.error('Failed to send RFQ:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleViewQuotation = () => {
    if (!rfq?.quoteId) return;
    router.push(`/transactions/quotations/${rfq.quoteId}`);
  };

  const statusConfig: Record<RfqStatus, { label: string; className: string }> = {
    [RfqStatus.Draft]: {
      label: 'Bản nháp',
      className: 'bg-gray-50 text-gray-700 border-gray-200',
    },
    [RfqStatus.Pending]: {
      label: 'Đang chờ xử lý',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    [RfqStatus.Accepted]: {
      label: 'Đã tiếp nhận',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    [RfqStatus.Responded]: {
      label: 'Đã phản hồi',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    [RfqStatus.Converted]: {
      label: 'Đã chuyển đổi',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-40">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
        <p className="meta-label uppercase tracking-widest text-gray-400">
          Đang tải chi tiết yêu cầu...
        </p>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-40">
        <FileText className="h-16 w-16 text-gray-100" />
        <p className="meta-label uppercase tracking-widest text-gray-400">
          Không tìm thấy thông tin yêu cầu này
        </p>
        <button
          onClick={onBack}
          className="btn-tracking border border-gray-900 px-8 py-3 text-[10px] font-bold uppercase"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const config = statusConfig[rfq.status] || {
    label: 'Yêu cầu báo giá',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-[#e9edf2] bg-[linear-gradient(180deg,#fcfdfe_0%,#f7f9fb_100%)] p-4 sm:p-6 xl:p-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div
            className={cn(
              cardClass,
              'overflow-hidden rounded-[24px] border-[#e6ebf1] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] shadow-[0_18px_40px_rgba(15,23,42,0.05)]'
            )}
          >
            <RfqHeader code={rfq.code} config={config} />
            <RfqTable items={rfq.items || []} />
          </div>
        </div>

        <div className="space-y-6">
          {rfq.saleStaff && <SupportCard staff={rfq.saleStaff} />}

          <CustomerCard
            customer={customer}
            actionNode={
              <div className="space-y-3">
                {rfq.status === RfqStatus.Draft && (
                  <button
                    onClick={handleSendRFQ}
                    disabled={isSending}
                    className={cn(
                      'group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-900 bg-gray-900 text-white transition-all duration-300 ease-out',
                      'hover:-translate-y-0.5 hover:border-gray-800 hover:bg-gray-800 hover:text-white hover:shadow-lg',
                      'disabled:cursor-not-allowed disabled:opacity-60'
                    )}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        <span className="pt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                          Gửi yêu cầu báo giá
                        </span>
                      </>
                    )}
                  </button>
                )}

                {rfq.status === RfqStatus.Responded && rfq.quoteId && (
                  <button
                    onClick={handleViewQuotation}
                    className={cn(
                      'group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-emerald-600 bg-emerald-600 text-white transition-all duration-300 ease-out',
                      'hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20'
                    )}
                  >
                    <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                    <span className="pt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                      {rfq.quoteCode ? `Xem báo giá ${rfq.quoteCode}` : 'Xem báo giá'}
                    </span>
                  </button>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
