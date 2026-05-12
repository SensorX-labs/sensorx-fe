'use client';

import React, { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, ChevronDown, Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';
import { Warehouse } from '@/features/warehouse/models/warehouse-model';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { Button } from "@/shared/components/shadcn-ui/button";
import { cn } from "@/shared/utils";

export function WarehouseSelector() {
  const [open, setOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const data = await getWarehouses();
        setWarehouses(data);
        
        const savedId = Cookies.get('warehouseId');
        if (savedId) {
          const found = data.find((w: Warehouse) => w.id === savedId);
          if (found) setSelectedWarehouse(found);
        }
      } catch (error) {
        console.error("Failed to fetch warehouses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleSelect = (warehouse: Warehouse) => {
    Cookies.set('warehouseId', warehouse.id!, { expires: 7 });
    setSelectedWarehouse(warehouse);
    setOpen(false);
    window.location.reload();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] justify-between h-10 border-gray-200 bg-white shadow-none hover:bg-gray-50 text-xs font-semibold rounded-md",
            !selectedWarehouse && "border-emerald-500 bg-emerald-50/50 animate-pulse text-emerald-700"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <WarehouseIcon className={cn("h-4 w-4 shrink-0", selectedWarehouse ? "text-emerald-600" : "text-emerald-700")} />
            <span className="truncate">
              {selectedWarehouse ? selectedWarehouse.name : "CHƯA CHỌN KHO"}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="p-2 border-b bg-gray-50/50">
          <p className="text-[10px] font-bold text-gray-500 uppercase px-2">Danh sách kho bãi</p>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          {loading && <div className="p-4 text-center text-xs text-gray-500">Đang tải...</div>}
          {!loading && warehouses.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500 italic">Không có dữ liệu</div>
          )}
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-xs transition-colors",
                selectedWarehouse?.id === warehouse.id 
                  ? "bg-emerald-50 text-emerald-700 font-bold" 
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => handleSelect(warehouse)}
            >
              <div className="flex items-center gap-2">
                <WarehouseIcon className={cn("h-3 w-3", selectedWarehouse?.id === warehouse.id ? "text-emerald-600" : "text-gray-400")} />
                <span>{warehouse.name}</span>
              </div>
              {selectedWarehouse?.id === warehouse.id && (
                <Check className="h-3 w-3 text-emerald-600" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
