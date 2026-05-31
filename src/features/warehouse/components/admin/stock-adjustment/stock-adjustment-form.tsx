"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Warehouse as WarehouseIcon, FileText } from "lucide-react";
import Cookies from "js-cookie";
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
import {
  createStockAdjustment,
  getWarehouses,
} from "@/features/warehouse/services/warehouse-service";
import { AdminPageContainer } from "@/shared/components/admin/layout";
import { toast } from "sonner";

interface WarehouseOption {
  id: string;
  name: string;
}

interface AdjustmentItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  manufactureName: string;
  note: string;
}

const schema = z.object({
  warehouseId: z.string().min(1, "Vui lòng chọn kho hàng"),
  description: z.string().min(1, "Lý do/mô tả kiểm kê là bắt buộc"),
});

type FormValues = z.infer<typeof schema>;

const StockAdjustmentForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [items, setItems] = useState<AdjustmentItem[]>([
    {
      productId: "",
      productCode: "",
      productName: "",
      unit: "Cái",
      quantity: 1,
      manufactureName: "N/A",
      note: "",
    },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      warehouseId: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchW = async () => {
      try {
        const res = await getWarehouses();
        setWarehouses(res || []);
        const savedId = Cookies.get("warehouseId");
        if (savedId && res?.some((w: WarehouseOption) => w.id === savedId)) {
          form.setValue("warehouseId", savedId);
        } else if (res && res.length > 0) {
          form.setValue("warehouseId", res[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch warehouses", err);
      }
    };
    fetchW();
  }, [form]);

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        productCode: "",
        productName: "",
        unit: "Cái",
        quantity: 1,
        manufactureName: "N/A",
        note: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof AdjustmentItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm để kiểm kê");
      return;
    }

    // Kiểm tra tính hợp lệ của các dòng sản phẩm
    for (const item of items) {
      if (!item.productCode || !item.productName) {
        toast.error("Vui lòng điền đầy đủ mã và tên sản phẩm");
        return;
      }
      if (item.quantity <= 0) {
        toast.error(`Số lượng của sản phẩm ${item.productName} phải lớn hơn 0`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        description: data.description,
        items: items.map((item) => ({
          // Nếu không có productId cụ thể, tạo một Guid ngẫu nhiên hợp lệ làm placeholder
          productId: item.productId || "00000000-0000-0000-0000-000000000001",
          productCode: item.productCode,
          productName: item.productName,
          unit: item.unit || "Cái",
          quantity: item.quantity,
          manufactureName: item.manufactureName || "N/A",
          note: item.note || "",
        })),
      };

      await createStockAdjustment(payload, data.warehouseId);
      toast.success("Tạo phiếu kiểm kê/điều chỉnh kho thành công!");
      router.push("/warehouse/stock-adjustment");
    } catch (error) {
      console.error("Error creating stock adjustment:", error);
      toast.error("Tạo phiếu kiểm kê thất bại. Vui lòng kiểm tra lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageContainer>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Tạo Phiếu Kiểm Kê / Điều Chỉnh Kho
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading} className="bg-[#1f533a] hover:bg-[#1f533a]/90 text-white">
            {loading ? "Đang xử lý..." : "Lưu phiếu kiểm kê"}
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          {/* Thông tin chung */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">
                Thông tin phiếu kiểm kê
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <WarehouseIcon className="w-3.5 h-3.5" /> Kho kiểm kê *
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">-- Chọn kho hàng --</option>
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do / Mô tả kiểm kê *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Kiểm kê định kỳ tháng 5, điều chỉnh hao hụt..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Danh sách sản phẩm kiểm kê */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">
                Danh sách sản phẩm kiểm kê
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm dòng mặt hàng
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm">Chưa có mặt hàng nào được chọn</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={addItem}
                  className="text-blue-600"
                >
                  Thêm mặt hàng đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50/80 rounded-lg border border-gray-100/50 hover:border-emerald-100 transition-colors"
                  >
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Mã SP *
                      </label>
                      <Input
                        value={item.productCode}
                        onChange={(e) =>
                          updateItem(index, "productCode", e.target.value)
                        }
                        placeholder="VD: SP001"
                        className="bg-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Tên sản phẩm *
                      </label>
                      <Input
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(index, "productName", e.target.value)
                        }
                        placeholder="Tên sản phẩm"
                        className="bg-white"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Đơn vị
                      </label>
                      <Input
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(index, "unit", e.target.value)
                        }
                        placeholder="Cái"
                        className="bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Số lượng thực tế *
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="bg-white font-semibold text-emerald-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Nhà sản xuất
                      </label>
                      <Input
                        value={item.manufactureName}
                        onChange={(e) =>
                          updateItem(index, "manufactureName", e.target.value)
                        }
                        placeholder="NSX"
                        className="bg-white text-xs"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                        Ghi chú
                      </label>
                      <Input
                        value={item.note}
                        onChange={(e) =>
                          updateItem(index, "note", e.target.value)
                        }
                        placeholder="..."
                        className="bg-white text-xs"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center pb-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(index)}
                        title="Xóa dòng"
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
    </AdminPageContainer>
  );
};

export default StockAdjustmentForm;