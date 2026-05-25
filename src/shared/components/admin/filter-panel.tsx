'use client';

import type { ReactNode } from 'react';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Input } from '@/shared/components/shadcn-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn-ui/select';
import { cn } from '@/shared/utils/cn';

type FilterValue = string | undefined;

interface FilterOption {
  label: string;
  value: string;
}

interface FilterFieldBase {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
}

interface SearchFieldConfig extends FilterFieldBase {
  type: 'search';
}

interface DateFieldConfig extends FilterFieldBase {
  type: 'date';
}

interface SelectFieldConfig extends FilterFieldBase {
  type: 'select';
  options: FilterOption[];
}

export type FilterFieldConfig =
  | SearchFieldConfig
  | DateFieldConfig
  | SelectFieldConfig;

export interface FilterPanelProps {
  title?: string;
  description?: string;
  fields: FilterFieldConfig[];
  values: Record<string, FilterValue>;
  onChange: (fieldId: string, value: string) => void;
  onReset: () => void;
  onRemoveFilter?: (fieldId: string) => void;
  actions?: ReactNode;
  className?: string;
  gridClassName?: string;
  hideHeader?: boolean;
}

function formatValueLabel(field: FilterFieldConfig, value: string) {
  if (field.type === 'select') {
    return field.options.find(option => option.value === value)?.label ?? value;
  }

  if (field.type === 'date') {
    return new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN');
  }

  return value;
}

export function FilterPanel({
  title = 'Bộ lọc',
  description,
  fields,
  values,
  onChange,
  onReset,
  onRemoveFilter,
  actions,
  className,
  gridClassName,
  hideHeader = false,
}: FilterPanelProps) {
  const activeFilters = fields
    .map(field => {
      const value = values[field.id];
      if (!value || value === 'all') {
        return null;
      }

      return {
        id: field.id,
        label: field.label,
        displayValue: formatValueLabel(field, value),
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    label: string;
    displayValue: string;
  }>;

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-stone-50/80 p-5', className)}>
      {!hideHeader ? (
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900">
              <Filter className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-[0.16em]">{title}</h3>
            </div>
            {description ? (
              <p className="text-sm text-slate-500">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {actions}
            <Button
              type="button"
              variant="outline"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Xóa tất cả
            </Button>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4',
          !hideHeader && 'mt-4',
          gridClassName
        )}
      >
        {fields.map(field => (
          <div key={field.id} className={cn('space-y-2', field.className)}>
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {field.label}
            </label>

            {field.type === 'search' ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={values[field.id] ?? ''}
                  onChange={event => onChange(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  className="h-11 rounded-md border-slate-200 bg-white pl-10"
                />
              </div>
            ) : null}

            {field.type === 'date' ? (
              <Input
                type="date"
                value={values[field.id] ?? ''}
                onChange={event => onChange(field.id, event.target.value)}
                className="h-11 rounded-md border-slate-200 bg-white"
              />
            ) : null}

            {field.type === 'select' ? (
              <Select
                value={values[field.id] ?? 'all'}
                onValueChange={value => onChange(field.id, value)}
              >
                <SelectTrigger className="h-11 w-full rounded-md border-slate-200 bg-white text-left">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        ))}
      </div>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4">
          {activeFilters.map(filter => (
            <button
              key={filter.id}
              type="button"
              onClick={() => (onRemoveFilter ? onRemoveFilter(filter.id) : onReset())}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span>{filter.label}: {filter.displayValue}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
