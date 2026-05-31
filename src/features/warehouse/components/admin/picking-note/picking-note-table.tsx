"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import {
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  FileEdit,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { getPickingNotes, getWarehouses } from "@/features/warehouse/services/warehouse-service";
import { PickingNote } from "@/features/warehouse/models";
import { Warehouse as WarehouseModel } from "@/features/warehouse/models/warehouse-model";
import { AdminPageContainer } from '@/shared/components/admin/layout';
import { cn } from "@/shared/utils";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useUser } from "@/shared/hooks/use-user";

interface PaginationState {
  firstId: string | null;
  lastId: string | null;
  firstCreatedAt: string | null;
  lastCreatedAt: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
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

const PickingNoteTable = () => {
  const router = useRouter();
  const { user } = useUser();
  const isWarehouseStaff = user?.role === "WarehouseStaff";

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pickingNotes, setPickingNotes] = useState<PickingNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    firstId: null,
    lastId: null,
    firstCreatedAt: null,
    lastCreatedAt: null,
    hasNext: false,
    hasPrevious: false,
  });

  // Tải danh sách các kho bãi để làm tabs
  useEffect(() => {
    const loadW = async () => {
      try {
        const res = await getWarehouses();
        const loadedWarehouses = res || [];
        setWarehouses(loadedWarehouses);

        if (isWarehouseStaff && user?.warehouseId) {
          setActiveTab(user.warehouseId);
        } else if (loadedWarehouses.length > 0) {
          const savedId = Cookies.get("warehouseId");
          if (savedId && loadedWarehouses.some((w: WarehouseModel) => w.id === savedId)) {
            setActiveTab(savedId);
          } else {
            setActiveTab(loadedWarehouses[0].id!);
          }
        }
      } catch (err) {
        console.error("Failed to load warehouses for tabs", err);
      }
    };
    loadW();
  }, [isWarehouseStaff, user?.warehouseId]);

  const fetchPickingNotes = useCallback(async (params: Record<string, any> = {}) => {
    if (!params.warehouseId) return;
    setLoading(true);
    try {
      const data = await getPickingNotes(params);
      setPickingNotes(data.items || []);
      setPagination({
        firstId: data.firstId || null,
        lastId: data.lastId || null,
        firstCreatedAt: data.firstCreatedAt || null,
        lastCreatedAt: data.lastCreatedAt || null,
        hasNext: data.hasNext || false,
        hasPrevious: data.hasPrevious || false,
      });
    } catch (error) {
      console.error("Error fetching picking notes:", error);
      toast.error("Không thể tải danh sách phiếu soạn kho");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    const timeoutId = setTimeout(() => {
      fetchPickingNotes({ warehouseId: activeTab, searchTerm });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab, fetchPickingNotes]);

  const handleNextPage = () => {
    if (pagination.hasNext && activeTab) {
      fetchPickingNotes({
        warehouseId: activeTab,
        searchTerm,
        firstId: pagination.lastId,
        firstCreatedAt: pagination.lastCreatedAt,
      });
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious && activeTab) {
      fetchPickingNotes({
        warehouseId: activeTab,
        searchTerm,
        lastId: pagination.firstId,
        lastCreatedAt: pagination.firstCreatedAt,
      });
    }
  };

  const handleRefresh = () => {
    if (activeTab) {
      fetchPickingNotes({ warehouseId: activeTab, searchTerm });
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    Cookies.set("warehouseId", tabId, { expires: 7, path: "/" });
    setPagination({
      firstId: null,
      lastId: null,
      firstCreatedAt: null,
      lastCreatedAt: null,
      hasNext: false,
      hasPrevious: false,
    });
  };

  return (
    <AdminPageContainer>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-title-xl uppercase">
            Danh sách phiếu soạn kho
          </h2>
        </div>
        <Button
          onClick={() => router.push("/warehouse/picking-note/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Tạo phiếu soạn kho
        </Button>
      </div>
      {/* Tabs navigation cao cấp hiển thị danh sách kho */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px mb-4">
        {warehouses.map((w) => {
          if (isWarehouseStaff && user?.warehouseId !== w.id) {
            return null;
          }
          return (
            <button
              key={w.id}
              onClick={() => handleTabChange(w.id!)}
              className={`px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === w.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <WarehouseIcon className="w-3.5 h-3.5" />
              {w.name}
              {isWarehouseStaff && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded font-semibold">
                  Kho của bạn
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="p-4 flex items-center gap-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã phiếu, người tạo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <Loader2
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Mã phiếu
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Người tạo
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Số sản phẩm
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {pickingNotes.length === 0 ? (
                !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center text-gray-400 uppercase tracking-widest text-xs"
                    >
                      Không có dữ liệu trong kho này
                    </td>
                  </tr>
                )
              ) : (
                pickingNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileEdit className="w-4 h-4 text-purple-500" />
                        <span className="font-bold text-gray-900">
                          {note.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(note.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{note.createdBy}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold">
                        {note.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                          statusStyles[note.status] ||
                            "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                      >
                        {statusLabels[note.status] || note.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            router.push(`/warehouse/picking-note/${note.id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {note.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                            onClick={() =>
                              router.push(
                                `/warehouse/picking-note/${note.id}/edit`
                              )
                            }
                          >
                            <FileEdit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {activeTab && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Hiển thị <span className="font-bold text-gray-700">{pickingNotes.length}</span> phiếu soạn kho
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrevious || loading}
                className="gap-1 rounded h-8 text-xs font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNext || loading}
                className="gap-1 rounded h-8 text-xs font-medium"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminPageContainer>
  );
};

export default PickingNoteTable;
