import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/shared/utils';

interface RfqItem {
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  imageUrl?: string;
}

interface RfqTableProps {
  items: RfqItem[];
}

export function RfqTable({ items }: RfqTableProps) {
  return (
    <div className="px-8 pb-8">
      <div className="mb-5 mt-8">
        <h3 className="tracking-title flex items-center gap-2 rounded-2xl border border-[#edf1f4] bg-[#fbfcfd] px-4 py-3 text-lg uppercase">
          <Package className="w-5 h-5 text-gray-400" />
          Danh sách sản phẩm yêu cầu
        </h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e6ebf1] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-[#edf1f4] bg-[#f8fafc] uppercase">
              <th className="w-[60%] border-r border-gray-100 px-8 py-4 tracking-label">
                Thông tin sản phẩm
              </th>
              <th className="w-[20%] border-r border-gray-100 px-8 py-4 text-center tracking-label">
                ĐVT
              </th>
              <th className="w-[20%] px-8 py-4 text-center tracking-label">
                Số lượng
              </th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((item, idx) => (
              <tr
                key={`${item.productCode}-${idx}`}
                className={cn(
                  'border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-[#f8fafc]',
                  idx % 2 === 1 && 'bg-[#fbfcfd]'
                )}
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e6ebf1] bg-[#f8fafc] shadow-sm">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-200" />
                      )}
                    </div>

                    <div>
                      <p className="breadcrumb-text font-bold uppercase">
                        {item.productName}
                      </p>
                      <div className="mt-1">
                        <span className="meta-label rounded-full border border-[#e6ebf1] bg-[#f8fafc] px-2.5 py-1 !text-[9px] font-bold uppercase tracking-widest">
                          {item.productCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5 text-center meta-label uppercase">
                  {item.unit}
                </td>

                <td className="px-8 py-5 text-center qty-label text-lg font-bold">
                  {item.quantity}
                </td>
              </tr>
            ))}

            {(!items || items.length === 0) && (
              <tr>
                <td
                  colSpan={3}
                  className="px-8 py-12 text-center meta-label uppercase italic text-gray-300"
                >
                  Chưa có thông tin sản phẩm trong yêu cầu này
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
