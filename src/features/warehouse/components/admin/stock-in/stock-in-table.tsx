"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Loader2, Plus, ChevronLeft, ChevronRight, Eye, Search, Warehouse as WarehouseIcon } from "lucide-react";
import { getStockIns, getWarehouses } from "@/features/warehouse/services/warehouse-service";
import { StockIn } from "@/features/warehouse/models";
import { Warehouse as WarehouseModel } from "@/features/warehouse/models/warehouse-model";
import { AdminPageContainer } from "@/shared/components/admin/layout/admin-page-container";
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

const StockInTable = () => {
  const router = useRouter();
  const { user } = useUser();
  const isWarehouseStaff = user?.role === "WarehouseStaff";

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
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

  const fetchStockIns = useCallback(async (params: Record<string, any> = {}) => {
    if (!params.warehouseId) return;
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
      toast.error("Không thể tải danh sách phiếu nhập kho");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    const timeoutId = setTimeout(() => {
      fetchStockIns({ warehouseId: activeTab, searchTerm });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab, fetchStockIns]);

  const handleNextPage = () => {
    if (pagination.hasNext && activeTab) {
      fetchStockIns({
        warehouseId: activeTab,
        searchTerm,
        firstId: pagination.lastId,
        firstCreatedAt: pagination.lastCreatedAt,
      });
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious && activeTab) {
      fetchStockIns({
        warehouseId: activeTab,
        searchTerm,
        lastId: pagination.firstId,
        lastCreatedAt: pagination.firstCreatedAt,
      });
    }
  };

  const handleRefresh = () => {
    if (activeTab) {
      fetchStockIns({ warehouseId: activeTab, searchTerm });
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
      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-2xl font-bold admin-title uppercase">Danh sách phiếu nhập kho</h2>
        <Button onClick={() => router.push("/warehouse/stock-in/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo phiếu nhập
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
              {stockIns.length === 0 ? (
                !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-400 uppercase tracking-widest text-xs"
                    >
                      Không có dữ liệu trong kho này
                    </td>
                  </tr>
                )
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

        {activeTab && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Hiển thị <span className="font-bold text-gray-700">{stockIns.length}</span> phiếu nhập kho
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

export default StockInTable;
