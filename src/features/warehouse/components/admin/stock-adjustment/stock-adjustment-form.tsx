"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStockAdjustment } from '@/features/warehouse/services/warehouse-service';
import { toast } from 'sonner';
import { Button } from '@/shared/components/shadcn-ui/button';
import { AdminPageContainer } from '@/shared/components/admin/layout/admin-page-container';

const schema = z.object({
  adjustmentDetail: z.string().min(1, 'Adjustment detail is required'),
});

type FormValues = z.infer<typeof schema>;

const StockAdjustmentForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createStockAdjustment({ detail: data.adjustmentDetail });
      toast.success('Stock Adjustment created successfully!');
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create Stock Adjustment.');
    }
  };

  return (
    <AdminPageContainer title="Create Stock Adjustment">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Adjustment Detail</label>
          <input
            type="text"
            {...register('adjustmentDetail')}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.adjustmentDetail && <p className="text-red-500 text-sm">{errors.adjustmentDetail.message}</p>}
        </div>

        <Button type="submit">Create</Button>
      </form>
    </AdminPageContainer>
  );
};

export default StockAdjustmentForm;