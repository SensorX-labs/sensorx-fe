'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, FileText } from 'lucide-react';

import {
  StoreRFQService,
  MyRfqDetail,
  MyRfqDetailCustomer,
} from '../../../services/store-rfq.service';
import { RfqStatus } from '../../../constants/rfq-status';

import { Send } from 'lucide-react';
import { cn } from '@/shared/utils';

import { CustomerCard, SupportCard } from '../components';
import {
  RfqHeader,
  RfqTable,
} from './components';
import { cardClass } from '../Constants/ui.constant';

export function RfqDetailView({
  onBack,
  rfqId,
}: {
  onBack: () => void;
  rfqId?: string;
}) {
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
      className: 'bg-green-50 text-green-700 border-green-200',
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />

        <p className="meta-label uppercase tracking-widest text-gray-400">
          Đang tải chi tiết yêu cầu...
        </p>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <FileText className="w-16 h-16 text-gray-100" />

        <p className="meta-label uppercase tracking-widest text-gray-400">
          Không tìm thấy thông tin yêu cầu này
        </p>

        <button
          onClick={onBack}
          className="btn-tracking border border-gray-900 px-8 py-3 uppercase text-[10px] font-bold"
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
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className={cardClass}>
            <RfqHeader code={rfq.code} config={config} />
            <RfqTable items={rfq.items || []} />
          </div>
        </div>

        <div className="space-y-6">
          {rfq.saleStaff && <SupportCard staff={rfq.saleStaff} />}

          <CustomerCard
            customer={customer}
            actionNode={
              rfq.status === RfqStatus.Draft && (
                <button
                  onClick={handleSendRFQ}
                  disabled={isSending}
                  className={cn(
                    'w-full h-12 mt-6',
                    'rounded-xl',
                    'bg-gray-900',
                    'text-white',
                    'border border-gray-900',
                    'flex items-center justify-center gap-3',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-0.5',
                    'hover:shadow-lg',
                    'hover:bg-gray-800',
                    'hover:text-white',
                    'hover:border-gray-800',
                    'disabled:opacity-60',
                    'disabled:cursor-not-allowed',
                    'group'
                  )}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white pt-0.5">
                        Gửi yêu cầu báo giá
                      </span>
                    </>
                  )}
                </button>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
