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
import {
  createPickingNote,
  getPickingNote,
} from "@/features/warehouse/services/warehouse-service";
import { PickingNote, PickingNoteItem } from "@/features/warehouse/models";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
import { toast } from "sonner";

const schema = z.object({
  code: z.string().min(1, "Mã phiếu là bắt buộc"),
  description: z.string().optional(),
  receiverName: z.string().min(1, "Tên người nhận là bắt buộc"),
  receiverPhone: z.string().min(1, "Số điện thoại là bắt buộc"),
  deliveryAddress: z.string().min(1, "Địa chỉ giao hàng là bắt buộc"),
  companyName: z.string().optional(),
  taxCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PickingNoteFormProps {
  id?: string;
}

const PickingNoteForm = ({ id }: PickingNoteFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PickingNoteItem[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      description: "",
      receiverName: "",
      receiverPhone: "",
      deliveryAddress: "",
      companyName: "",
      taxCode: "",
    },
  });

  useState(() => {
    if (id && id !== "new") {
      loadPickingNote(id);
    }
  });

  const loadPickingNote = async (pickingNoteId: string) => {
    setLoading(true);
    try {
      const data = await getPickingNote(pickingNoteId);
      form.reset({
        code: data.code,
        description: data.description || "",
        receiverName: data.deliveryInfo?.receiverName || "",
        receiverPhone: data.deliveryInfo?.receiverPhone || "",
        deliveryAddress: data.deliveryInfo?.deliveryAddress || "",
        companyName: data.deliveryInfo?.companyName || "",
        taxCode: data.deliveryInfo?.taxCode || "",
      });
      setItems(data.items || []);
    } catch (error) {
      console.error("Error loading picking note:", error);
      toast.error("Không thể tải thông tin phiếu soạn kho");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        productCode: "",
        productName: "",
        unit: "",
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof PickingNoteItem,
    value: string | number
  ) => {
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
      await createPickingNote({
        code: data.code,
        description: data.description,
        deliveryInfo: {
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          deliveryAddress: data.deliveryAddress,
          companyName: data.companyName,
          taxCode: data.taxCode,
        },
        items,
      });
      toast.success("Tạo phiếu soạn kho thành công!");
      router.push("/warehouse/picking-note");
    } catch (error) {
      console.error("Error creating picking note:", error);
      toast.error("Tạo phiếu soạn kho thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageContainer
      title={id && id !== "new" ? "Sửa phiếu soạn kho" : "Tạo phiếu soạn kho"}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu phiếu soạn kho"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Thông tin phiếu soạn kho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã phiếu *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã phiếu" {...field} />
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
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mô tả (tùy chọn)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Thông tin giao hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người nhận *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên người nhận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Địa chỉ giao hàng *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập địa chỉ giao hàng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên công ty</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên công ty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã số thuế" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Danh sách sản phẩm</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-2"
              >
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
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Mã sản phẩm
                      </label>
                      <Input
                        value={item.productCode}
                        onChange={(e) =>
                          updateItem(index, "productCode", e.target.value)
                        }
                        placeholder="Mã SP"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tên sản phẩm
                      </label>
                      <Input
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(index, "productName", e.target.value)
                        }
                        placeholder="Tên sản phẩm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Đơn vị
                      </label>
                      <Input
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(index, "unit", e.target.value)
                        }
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
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
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
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        NSX
                      </label>
                      <Input
                        value={item.manufactureName || ""}
                        onChange={(e) =>
                          updateItem(index, "manufactureName", e.target.value)
                        }
                        placeholder="NSX"
                      />
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

export default PickingNoteForm;
