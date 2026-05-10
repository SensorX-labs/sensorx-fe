"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStockAdjustmentDetail } from '@/features/warehouse/services/warehouse-service';
import { StockAdjustment } from '@/features/warehouse/models';
import { Button } from '@/shared/components/shadcn-ui/button';
import { AdminPageContainer } from '@/shared/components/admin/layout/admin-page-container';

const StockAdjustmentDetail = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');
  const [loading, setLoading] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustment | null>(null);

  useEffect(() => {
    if (id) {
      fetchStockAdjustmentDetail();
    }
  }, [id]);

  const fetchStockAdjustmentDetail = async () => {
    setLoading(true);
    try {
      const data = await getStockAdjustmentDetail(id) as StockAdjustment;
      setStockAdjustment(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stockAdjustment) {
    return <div>No data found</div>;
  }

  return (
    <AdminPageContainer title={`Stock Adjustment: ${stockAdjustment.id}`}>
      <div>
        <p><strong>ID:</strong> {stockAdjustment.id}</p>
        <p><strong>Status:</strong> {stockAdjustment.status}</p>
        <p><strong>Created At:</strong> {new Date(stockAdjustment.createdAt).toLocaleString()}</p>
      </div>
      <div className="mt-4">
        <Button>Approve</Button>
        <Button>Reject</Button>
      </div>
    </AdminPageContainer>
  );
};

export default StockAdjustmentDetail;