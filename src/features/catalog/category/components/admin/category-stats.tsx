import React, { useMemo } from 'react';
import { Layers, FolderOpen, GitBranch } from 'lucide-react';
import { Category } from '../../models/category-model';
import { StatGroup } from '@/shared/components/admin/stat-card';

interface CategoryStatsProps {
  categories: Category[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const { total, roots, subCategories } = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter(c => !c.parentId).length;
    return { total, roots, subCategories: total - roots };
  }, [categories]);

  const stats = [
    {
      label: 'Tổng danh mục',
      value: total,
      icon: Layers,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      label: 'Danh mục gốc',
      value: roots,
      icon: FolderOpen,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100',
    },
    {
      label: 'Danh mục con',
      value: subCategories,
      icon: GitBranch,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100',
    },
  ];

  return <StatGroup items={stats} gridCols={3} />;
}
