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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getPickingNotes } from "@/features/warehouse/services/warehouse-service";
import { PickingNote } from "@/features/warehouse/models";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
import { cn } from "@/shared/utils";
import { toast } from "sonner";

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

  const fetchPickingNotes = useCallback(async (params: Record<string, any> = {}) => {
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
    const timeoutId = setTimeout(() => {
      fetchPickingNotes({ searchTerm });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchPickingNotes]);

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchPickingNotes({
        searchTerm,
        firstId: pagination.lastId,
        firstCreatedAt: pagination.lastCreatedAt,
      });
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      fetchPickingNotes({
        searchTerm,
        lastId: pagination.firstId,
        lastCreatedAt: pagination.firstCreatedAt,
      });
    }
  };

  const handleRefresh = () => {
    fetchPickingNotes({ searchTerm });
  };

  return (
    <AdminPageContainer
      title="Danh sách phiếu soạn kho"
      actions={
        <Button
          onClick={() => router.push("/warehouse/picking-note/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Tạo phiếu soạn kho
        </Button>
      }
    >
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : pickingNotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-gray-400 uppercase tracking-widest text-xs"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
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

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {pickingNotes.length > 0
              ? `Hiển thị ${pickingNotes.length} phiếu soạn kho`
              : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevious || loading}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.hasNext || loading}
              className="gap-1"
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminPageContainer>
  );
};

export default PickingNoteTable;
