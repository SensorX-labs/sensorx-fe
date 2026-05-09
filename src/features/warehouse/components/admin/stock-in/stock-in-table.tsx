"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Loader2, Plus, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { getStockIns } from "@/features/warehouse/services/warehouse-service";
import { StockIn } from "@/features/warehouse/models";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
import { toast } from "sonner";

interface PaginationState {
  firstId: string | null;
  lastId: string | null;
  firstCreatedAt: string | null;
  lastCreatedAt: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

const StockInTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    firstId: null,
    lastId: null,
    firstCreatedAt: null,
    lastCreatedAt: null,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchStockIns = useCallback(async (params: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const data = await getStockIns(params);
      setStockIns(data.items || []);
      setPagination({
        firstId: data.firstId || null,
        lastId: data.lastId || null,
        firstCreatedAt: data.firstCreatedAt || null,
        lastCreatedAt: data.lastCreatedAt || null,
        hasNext: data.hasNext || false,
        hasPrevious: data.hasPrevious || false,
      });
    } catch (error) {
      console.error("Error fetching stock ins:", error);
      toast.error("Failed to fetch stock ins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStockIns({ searchTerm });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchStockIns]);

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchStockIns({
        searchTerm,
        firstId: pagination.lastId,
        firstCreatedAt: pagination.lastCreatedAt,
      });
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      fetchStockIns({
        searchTerm,
        lastId: pagination.firstId,
        lastCreatedAt: pagination.firstCreatedAt,
      });
    }
  };

  const handleRefresh = () => {
    fetchStockIns({ searchTerm });
  };

  return (
    <AdminPageContainer
      title="Danh sách phiếu nhập kho"
      actions={
        <Button onClick={() => router.push("/warehouse/stock-in/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo phiếu nhập
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
            <Loader2 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
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
                  Người giao
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Thủ kho
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  Số sản phẩm
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : stockIns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-20 text-center text-gray-400 uppercase tracking-widest text-xs"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                stockIns.map((stockIn) => (
                  <tr
                    key={stockIn.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {stockIn.code}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(stockIn.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {stockIn.createdBy}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {stockIn.devliveredBy || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {stockIn.warehouseKeeper || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                        {stockIn.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() =>
                          router.push(`/warehouse/stock-in/${stockIn.id}`)
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {stockIns.length > 0
              ? `Hiển thị ${stockIns.length} phiếu nhập kho`
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

export default StockInTable;
