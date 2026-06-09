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
        <h3 className="tracking-title uppercase text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          Danh sách sản phẩm yêu cầu
        </h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100">

      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100 uppercase">
            <th className="px-8 py-4 tracking-label border-r border-gray-100 w-[60%]">
              Thông tin sản phẩm
            </th>

            <th className="px-8 py-4 tracking-label border-r border-gray-100 text-center w-[20%]">
              ĐVT
            </th>

            <th className="px-8 py-4 tracking-label text-center w-[20%]">
              Số lượng
            </th>
          </tr>
        </thead>

        <tbody>
          {(items || []).map((item, idx) => (
            <tr
              key={`${item.productCode}-${idx}`}
              className={cn(
                'border-b border-gray-50 last:border-0 transition-colors duration-200 hover:bg-gray-50/60',
                idx % 2 === 1 && 'bg-gray-50/30'
              )}
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-200" />
                    )}
                  </div>
                  <div>
                    <p className="breadcrumb-text uppercase font-bold">
                      {item.productName}
                    </p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 meta-label uppercase !text-[9px] font-bold tracking-widest">
                        {item.productCode}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-8 py-5 text-center meta-label uppercase">
                {item.unit}
              </td>

              <td className="px-8 py-5 text-center qty-label font-bold text-lg">
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
