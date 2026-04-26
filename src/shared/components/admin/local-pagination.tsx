'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface LocalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function LocalPagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: LocalPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 text-gray-600 sticky bottom-0 z-20 ${className}`}>
      <span className="text-xs font-medium">
        Trang {currentPage} / {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage;
            if (totalPages > 5) {
              if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
            } else {
              pageNum = i + 1;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 p-0 rounded text-xs font-bold ${currentPage === pageNum ? 'admin-btn-primary' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
