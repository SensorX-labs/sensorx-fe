import React from 'react';
import {
  AlertCircle,
  Bot,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { QuoteAnalysisResponse } from '../../../services/quote-analysis-service';

interface QuotationAiAnalysisProps {
  analysisLoading: boolean;
  analysisResult: QuoteAnalysisResponse | null;
  analysisError: string | null;
}

const getWarningStyles = (warningLevel?: string) => {
  const level = (warningLevel || '').trim().toLowerCase();

  if (level.includes('đỏ') || level.includes('do')) {
    return {
      badge: 'bg-red-50 text-red-700 border-red-200',
      soft: 'bg-red-50/60 border-red-100',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
    };
  }

  if (level.includes('vàng') || level.includes('vang')) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      soft: 'bg-amber-50/60 border-amber-100',
      icon: <ShieldQuestion className="w-4 h-4 text-amber-600" />,
    };
  }

  return {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    soft: 'bg-emerald-50/60 border-emerald-100',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  };
};

export function QuotationAiAnalysis({ analysisLoading, analysisResult, analysisError }: QuotationAiAnalysisProps) {
  const analysis = analysisResult?.analysis;
  const warningStyles = getWarningStyles(analysis?.warning_level);

  return (
    <div className="md:col-span-3 bg-white border border-gray-100 rounded p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3 gap-3">
        <div className="flex items-center gap-2 text-blue-600">
          <Bot size={16} className={cn((analysisResult?.status === 'pending' || analysisLoading) && 'animate-pulse')} />
          <span className="font-bold uppercase tracking-wider text-sm">Phân tích từ AI</span>
        </div>

        {analysisResult && analysisResult.status !== 'pending' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border-2 bg-slate-900 text-white border-slate-800">
              {analysis?.approval_recommendation || 'Chua xac dinh'}
            </div>
            <div className={cn('inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border', warningStyles.badge)}>
              {warningStyles.icon}
              <span>Mức cảnh báo: {analysis?.warning_level || 'N/A'}</span>
            </div>
            <div className="text-base font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border-2 bg-blue-50 text-blue-700 border-blue-200">
              {analysis?.deal_status || 'N/A'}
            </div>
          </div>
        )}
      </div>

      {analysisError ? (
        <div className="py-10 flex flex-col items-center justify-center space-y-4 bg-red-50/30 rounded-lg border border-dashed border-red-100">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="text-center">
            <p className="text-sm font-bold text-red-600 mb-1">Không thể phân tích báo giá</p>
            <p className="text-xs text-red-400">Vui lòng kiểm tra lại dịch vụ AI có đang hoạt động hay không.</p>
          </div>
        </div>
      ) : analysisLoading || analysisResult?.status === 'pending' ? (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="flex items-center gap-3 text-blue-600 font-medium">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span>{analysisResult?.message || 'Hệ thống đang tiến hành phân tích báo giá...'}</span>
          </div>
        </div>
      ) : analysisResult ? (
        <div className="space-y-4">
          <div className={cn('rounded-xl border p-5', warningStyles.soft)}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              <FileCheck2 className="w-4 h-4" />
              Kết luận phê duyệt
            </div>
            <p className="text-2xl font-black tracking-tight text-gray-900">
              {analysis?.approval_recommendation || 'Chưa có đánh giá'}
            </p>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
              {analysis?.reasoning || 'Chưa có lập luận phân tích.'}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <UserRound className="w-4 h-4" />
                Tóm tắt khách hàng
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysis?.customer_summary || 'Chưa có tóm tắt khách hàng.'}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <TrendingUp className="w-4 h-4" />
                Đề xuất thay đổi giá
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {analysis?.price_strategy || 'Chưa có đề xuất điều chỉnh giá.'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Mức cảnh báo
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {analysis?.warning_level || 'Chưa xác định'}
              </p>

              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-2">
                Trạng thái deal
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {analysis?.deal_status || 'Chưa xác định'}
              </p>
            </div>
          </div>
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
              Hệ thống AI đang chuẩn bị dữ liệu
              <br />
              và phân tích báo giá này
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
