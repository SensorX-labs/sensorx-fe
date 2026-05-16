'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/shadcn-ui/dialog";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";

interface RfqDeclineDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  declineReason: string;
  setDeclineReason: (reason: string) => void;
  onConfirm: () => void;
}

export const RfqDeclineDialog: React.FC<RfqDeclineDialogProps> = ({
  isOpen,
  onOpenChange,
  declineReason,
  setDeclineReason,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border-none shadow-xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-gray-900 uppercase tracking-widest text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Từ chối tiếp nhận RFQ
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="tracking-label uppercase block">Lý do từ chối</label>
            <Textarea
              placeholder="Nhập lý do tại đây..."
              className="text-xs min-h-[100px] border-gray-200 focus:border-gray-300 focus:ring-0 shadow-none resize-none px-3 py-2"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="text-[10px] font-bold uppercase tracking-widest border border-gray-200 bg-white h-9 px-4"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="text-[10px] font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-none h-9 px-4"
            disabled={!declineReason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
