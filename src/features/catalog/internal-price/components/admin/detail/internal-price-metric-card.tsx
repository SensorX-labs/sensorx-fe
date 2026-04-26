'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/shadcn-ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  colorClass: string;
  tooltip?: string;
}

export function MetricCard({ icon: Icon, label, value, unit, colorClass, tooltip }: MetricCardProps) {
  const content = (
    <div className="p-4 rounded border border-slate-100 bg-white shadow-sm flex items-center gap-4 w-full h-full">
      <div className={`p-3 rounded ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${colorClass.split(' ')[1]}`}>{value}</span>
          <span className={`text-xs font-medium ${colorClass.split(' ')[1]}`}>{unit}</span>
        </div>
      </div>
    </div>
  );

  if (!tooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help h-full">{content}</div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-white border-slate-800 p-2 max-w-xs shadow-xl">
          <p className="text-[11px] font-medium leading-relaxed">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
