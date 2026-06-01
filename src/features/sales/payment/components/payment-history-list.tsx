"use client";

import React, { useEffect, useState } from "react";
import { Eye, Search, CreditCard } from "lucide-react";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Input } from "@/shared/components/shadcn-ui/input";
import { AdminContentCard } from "@/shared/components/admin/layout";
import { LocalPagination } from "@/shared/components/admin/local-pagination";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { toast } from "sonner";
const formatNumber = (value: number) => value.toLocaleString("vi-VN");
import { PaymentHistoryItem, PaymentHistoryService } from "../services/payment-history-service";
import { PaymentHistoryDetailModal } from "./payment-history-detail-modal";

const statusStyles: Record<string, string> = {
  "Pendding": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Finished": "bg-green-50 text-green-700 border-green-200",
};

const statusLabels: Record<string, string> = {
  "Pendding": "Chờ xử lý",
  "Finished": "Thành công",
};

export default function PaymentHistoryList() {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const pageSize = 12;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const queryParams = {
          pageNumber: currentPage,
          pageSize,
          searchTerm: debouncedSearch.trim() || undefined,
          gateway: gatewayFilter === "all" ? undefined : gatewayFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
        };

        const response = await PaymentHistoryService.getListHistory(queryParams);
        setItems(response?.items ?? []);
        setTotalItems(response?.totalCount ?? 0);
      } catch (error) {
        console.error("Error loading payment history:", error);
        toast.error("Không thể tải danh sách lịch sử chuyển khoản");
        setItems([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, debouncedSearch, gatewayFilter, statusFilter]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <AdminContentCard className="min-h-0">
        {/* Header and filters */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-500 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1 xl:max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Tìm nhanh theo nội dung chuyển khoản, số tài khoản, mã tham chiếu..."
                className="h-11 rounded-md border-slate-200 bg-white pl-10"
              />
            </div>

            {/* Gateway Filter */}
            <select
              value={gatewayFilter}
              onChange={(e) => {
                setGatewayFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 px-3 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">Tất cả ngân hàng</option>
              <option value="Vietinbank">Vietinbank</option>
              <option value="MBBank">MBBank</option>
              <option value="Vietcombank">Vietcombank</option>
              <option value="Techcombank">Techcombank</option>
              <option value="BIDV">BIDV</option>
              <option value="ACB">ACB</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 px-3 border border-slate-200 rounded-md bg-white text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Finished">Thành công</option>
              <option value="Pendding">Chờ xử lý</option>
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="relative overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100/95 backdrop-blur-sm shadow-sm">
                <th className="px-6 py-4 text-left uppercase tracking-label">Mã GD (Sepay)</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Ngày giao dịch</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Cổng / TK nhận</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Số TK chuyển</th>
                <th className="px-6 py-4 text-left uppercase tracking-label">Nội dung</th>
                <th className="px-6 py-4 text-right uppercase tracking-label">Số tiền</th>
                <th className="px-6 py-4 text-center uppercase tracking-label">Trạng thái</th>
                <th className="px-6 py-4 text-right uppercase tracking-label">Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-medium italic text-slate-400">
                    Đang tải lịch sử giao dịch...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-medium italic text-slate-400">
                    Không tìm thấy giao dịch nào
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="group cursor-pointer odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100"
                    onClick={() => handleViewDetail(item.id)}
                  >
                    <td className="px-6 py-4 font-bold tracking-tight text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(item.transactionDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 uppercase">
                        {item.gateway}
                      </div>
                      {item.subAccount && (
                        <div className="mt-0.5 text-xs text-gray-500 font-mono">
                          {item.subAccount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {item.accountNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium line-clamp-1 max-w-[300px]" title={item.content}>
                        {item.content}
                      </div>
                      {item.referenceCode && (
                        <div className="text-xs text-gray-400">
                          Ref: {item.referenceCode}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      +{formatNumber(item.transferAmount)}đ
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                          statusStyles[item.status] || "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleViewDetail(item.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="py-3"
        />
      </AdminContentCard>

      <PaymentHistoryDetailModal
        id={selectedId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
