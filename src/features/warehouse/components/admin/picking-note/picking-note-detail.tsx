"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Loader2,
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  Package,
  Phone,
  MapPin,
  Building,
} from "lucide-react";
import {
  getPickingNote,
  startPicking,
  completePicking,
  cancelPicking,
} from "@/features/warehouse/services/warehouse-service";
import { PickingNote } from "@/features/warehouse/models";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
import { cn } from "@/shared/utils";
import { toast } from "sonner";

interface PickingNoteDetailProps {
  id: string;
}

const statusStyles: Record<string, string> = {
  "Pending": "bg-yellow-50 text-yellow-600 border-yellow-100",
  "Picking": "bg-blue-50 text-blue-600 border-blue-100",
  "Completed": "bg-green-50 text-green-600 border-green-100",
  "Canceled": "bg-gray-50 text-gray-600 border-gray-100",
};

const statusLabels: Record<string, string> = {
  "Pending": "Chờ soạn",
  "Picking": "Đang soạn",
  "Completed": "Hoàn thành",
  "Canceled": "Đã hủy",
};

const PickingNoteDetail = ({ id }: PickingNoteDetailProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pickingNote, setPickingNote] = useState<PickingNote | null>(null);

  useEffect(() => {
    if (id && id !== "new") {
      fetchPickingNoteDetail();
    }
  }, [id]);

  const fetchPickingNoteDetail = async () => {
    setLoading(true);
    try {
      const data = await getPickingNote(id);
      setPickingNote(data);
    } catch (error) {
      console.error("Error fetching picking note:", error);
      toast.error("Không thể tải thông tin phiếu soạn kho");
    } finally {
      setLoading(false);
    }
  };

  const handleStartPicking = async () => {
    setActionLoading(true);
    try {
      await startPicking({ pickingNoteId: id });
      toast.success("Đã bắt đầu soạn kho!");
      fetchPickingNoteDetail();
    } catch (error) {
      console.error("Error starting picking:", error);
      toast.error("Không thể bắt đầu soạn kho");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompletePicking = async () => {
    setActionLoading(true);
    try {
      await completePicking({ pickingNoteId: id });
      toast.success("Đã hoàn thành soạn kho!");
      fetchPickingNoteDetail();
    } catch (error) {
      console.error("Error completing picking:", error);
      toast.error("Không thể hoàn thành soạn kho");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPicking = async () => {
    setActionLoading(true);
    try {
      await cancelPicking({ pickingNoteId: id });
      toast.success("Đã hủy phiếu soạn kho!");
      fetchPickingNoteDetail();
    } catch (error) {
      console.error("Error canceling picking:", error);
      toast.error("Không thể hủy phiếu soạn kho");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase mb-4">Chi tiết phiếu soạn kho</h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminPageContainer>
    );
  }

  if (!pickingNote) {
    return (
      <AdminPageContainer>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase mb-4">Chi tiết phiếu soạn kho</h2>
        </div>
        <div className="text-center py-20 text-gray-400">
          Không tìm thấy phiếu soạn kho
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Phiếu soạn kho: {pickingNote.code}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          {pickingNote.status === "Pending" && (
            <>
              <Button
                variant="outline"
                onClick={handleCancelPicking}
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleStartPicking}
                disabled={actionLoading}
                className="gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Bắt đầu soạn
              </Button>
            </>
          )}
          {pickingNote.status === "Picking" && (
            <Button
              onClick={handleCompletePicking}
              disabled={actionLoading}
              className="gap-2"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Hoàn thành
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Thông tin chung</h3>
            <span
              className={cn(
                "px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest border",
                statusStyles[pickingNote.status] ||
                  "bg-gray-100 text-gray-500 border-gray-200"
              )}
            >
              {statusLabels[pickingNote.status] || pickingNote.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Mã phiếu
              </p>
              <p className="font-bold text-gray-900">{pickingNote.code}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Ngày tạo
              </p>
              <p className="text-gray-700">
                {new Date(pickingNote.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Người tạo
              </p>
              <p className="text-gray-700">{pickingNote.createdBy}</p>
            </div>
          </div>

          {pickingNote.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Mô tả
              </p>
              <p className="text-gray-700">{pickingNote.description}</p>
            </div>
          )}
        </div>

        {pickingNote.deliveryInfo && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Thông tin giao hàng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Người nhận
                </p>
                <p className="font-semibold text-gray-900">
                  {pickingNote.deliveryInfo.receiverName}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-gray-700">
                  {pickingNote.deliveryInfo.receiverPhone}
                </p>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-gray-700">
                  {pickingNote.deliveryInfo.deliveryAddress}
                </p>
              </div>
              {pickingNote.deliveryInfo.companyName && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-400 mt-1" />
                  <p className="text-gray-700">
                    {pickingNote.deliveryInfo.companyName}
                  </p>
                </div>
              )}
              {pickingNote.deliveryInfo.taxCode && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Mã số thuế
                  </p>
                  <p className="text-gray-700">
                    {pickingNote.deliveryInfo.taxCode}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" />
              Danh sách sản phẩm ({pickingNote.items?.length || 0})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                    Mã SP
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                    Đơn vị
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider text-right">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                    NSX
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {pickingNote.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.productCode}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.unit}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.manufactureName || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {item.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPageContainer>
  );
};

export default PickingNoteDetail;
