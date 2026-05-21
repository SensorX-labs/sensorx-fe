import React from 'react';
import { Bot, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface QuotationAiAnalysisProps {
  analysisLoading: boolean;
  analysisResult: any;
  analysisError: string | null;
}

export function QuotationAiAnalysis({ analysisLoading, analysisResult, analysisError }: QuotationAiAnalysisProps) {
  return (
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
  );
}
