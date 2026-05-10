"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn-ui/form";
import { createStockIn } from "@/features/warehouse/services/warehouse-service";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
import { toast } from "sonner";

const schema = z.object({
  code: z.string().min(1, "Mã phiếu nhập là bắt buộc"),
  description: z.string().optional(),
  deliveredBy: z.string().optional(),
  warehouseKeeper: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface StockInItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
}

const StockInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<StockInItem[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      description: "",
      deliveredBy: "",
      warehouseKeeper: "",
    },
  });

  const addItem = () => {
    setItems([...items, { productId: "", productCode: "", productName: "", unit: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof StockInItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    setLoading(true);
    try {
      await createStockIn({
        code: data.code,
        description: data.description,
        deliveredBy: data.deliveredBy,
        warehouseKeeper: data.warehouseKeeper,
        items,
      });
      toast.success("Tạo phiếu nhập kho thành công!");
      router.push("/warehouse/stock-in");
    } catch (error) {
      console.error("Error creating stock in:", error);
      toast.error("Tạo phiếu nhập kho thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageContainer
      title="Tạo phiếu nhập kho"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu phiếu nhập"}
          </Button>
        </div>
      }
    >
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã phiếu nhập *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã phiếu nhập" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveredBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người giao</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên người giao" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warehouseKeeper"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thủ kho</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên thủ kho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mô tả (tùy chọn)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Danh sách sản phẩm</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm sản phẩm
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-sm">Chưa có sản phẩm nào</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={addItem}
                    className="text-blue-600"
                  >
                    Thêm sản phẩm đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mã sản phẩm
                        </label>
                        <Input
                          value={item.productCode}
                          onChange={(e) => updateItem(index, "productCode", e.target.value)}
                          placeholder="Mã SP"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tên sản phẩm
                        </label>
                        <Input
                          value={item.productName}
                          onChange={(e) => updateItem(index, "productName", e.target.value)}
                          placeholder="Tên sản phẩm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Đơn vị
                        </label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateItem(index, "unit", e.target.value)}
                          placeholder="Cái"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Số lượng
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </AdminPageContainer>
  );
};

export default StockInForm;
