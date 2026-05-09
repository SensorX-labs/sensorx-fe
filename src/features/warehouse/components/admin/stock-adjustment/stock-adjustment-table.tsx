"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Loader2 } from 'lucide-react';
import { getStockAdjustments } from '@/features/warehouse/services/warehouse-service';
import { StockAdjustment } from '@/features/warehouse/models';
import { AdminPageContainer } from '@/shared/components/admin/layout/admin-page-container';

interface StockAdjustmentsResponse {
  items: StockAdjustment[];
  firstId: string | null;
  lastId: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

const StockAdjustmentTable = () => {
  const [loading, setLoading] = useState(false);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ firstId: null as string | null, lastId: null as string | null });

  useEffect(() => {
    fetchStockAdjustments();
  }, [searchTerm, pagination]);

  const fetchStockAdjustments = async () => {
    setLoading(true);
    try {
      const params = { searchTerm, ...pagination };
      const data = await getStockAdjustments(params) as StockAdjustmentsResponse;
      setStockAdjustments(data.items || []);
      setPagination({ firstId: data.firstId ?? null, lastId: data.lastId ?? null });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageContainer title="Stock Adjustments">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <Button onClick={fetchStockAdjustments}>Refresh</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : stockAdjustments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              stockAdjustments.map((adjustment) => (
                <tr key={adjustment.id}>
                  <td className="px-6 py-4">{adjustment.id}</td>
                  <td className="px-6 py-4">{adjustment.status}</td>
                  <td className="px-6 py-4">{new Date(adjustment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Button>View</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPageContainer>
  );
};

export default StockAdjustmentTable;