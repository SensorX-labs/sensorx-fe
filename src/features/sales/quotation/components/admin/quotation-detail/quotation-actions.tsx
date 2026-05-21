import React from 'react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { CanAccess } from '@/shared/components/common/can-access';
import { Edit, CheckCircle, XCircle, Undo2, Send, Trash2, Save, X } from 'lucide-react';
import { QuoteStatus } from '../../../constants/quote-status';

interface QuotationActionsProps {
  status: QuoteStatus;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onSubmitForApproval: () => void;
  onWithdraw: () => void;
  onPublish: () => void;
  onApprove: () => void;
  onRejectClick: () => void;
  onDelete: () => void;
}

export function QuotationActions({
  status,
  isEditing,
  isSubmitting,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onSubmitForApproval,
  onWithdraw,
  onPublish,
  onApprove,
  onRejectClick,
  onDelete
}: QuotationActionsProps) {

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={onCancelEdit}
          disabled={isSubmitting}
          variant="outline"
          className="rounded border-gray-200 text-gray-600 hover:bg-gray-50 h-10 px-6 shadow-sm"
        >
          <X className="w-4 h-4 mr-2" /> Hủy bỏ
        </Button>
        <Button
          onClick={onSaveEdit}
          disabled={isSubmitting}
          className="rounded admin-btn-primary h-10 px-6"
        >
          <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CanAccess roles={['SaleStaff']}>
        {(status === QuoteStatus.DRAFT || status === QuoteStatus.RETURNED) && (
          <>
            <Button
              onClick={onEdit}
              variant="outline"
              className="rounded border-blue-200 text-blue-600 hover:bg-blue-50 h-10 px-6 shadow-sm"
            >
              <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
            </Button>
            <Button
              onClick={onSubmitForApproval}
              disabled={isSubmitting}
              className="rounded bg-blue-600 hover:bg-blue-700 h-10 px-6 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang gửi..." : "Gửi duyệt"}
            </Button>
            <Button
              onClick={onDelete}
              disabled={isSubmitting}
              variant="outline"
              className="rounded border-red-200 text-red-600 hover:bg-red-50 h-10 px-6 shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Xóa
            </Button>
          </>
        )}
        {/* Pending: Thu hồi */}
        {status === QuoteStatus.PENDING && (
          <Button
            onClick={onWithdraw}
            disabled={isSubmitting}
            variant="outline"
            className="rounded border-orange-200 text-orange-600 hover:bg-orange-50 h-10 px-6 shadow-sm"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            {isSubmitting ? "Đang thu hồi..." : "Thu hồi"}
          </Button>
        )}
        {/* Approved: Phát hành */}
        {status === QuoteStatus.APPROVED && (
          <Button
            onClick={onPublish}
            disabled={isSubmitting}
            className="rounded bg-indigo-600 hover:bg-indigo-700 h-10 px-6 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isSubmitting ? "Đang phát hành..." : "Phát hành"}
          </Button>
        )}
      </CanAccess>

      {/* Manager actions: chỉ khi Pending */}
      <CanAccess roles={['Manager']}>
        {status === QuoteStatus.PENDING && (
          <>
            <Button
              onClick={onApprove}
              disabled={isSubmitting}
              className="rounded bg-green-600 hover:bg-green-700 h-10 px-6 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Phê duyệt"}
            </Button>
            <Button
              onClick={onRejectClick}
              disabled={isSubmitting}
              variant="outline"
              className="rounded border-red-200 text-red-600 hover:bg-red-50 h-10 px-6 shadow-sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </>
        )}
      </CanAccess>
    </div>
  );
}
