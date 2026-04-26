import React, { useMemo } from 'react';
import { Layers, FolderOpen, GitBranch } from 'lucide-react';
import { Category } from '../../models/category-model';
import { StatGroup } from '@/shared/components/admin/stat-card';

interface CategoryStatsProps {
  categories: Category[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CategoryStats({ categories, activeTab, onTabChange }: CategoryStatsProps) {
  const { total, roots, subCategories } = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter(c => !c.parentId).length;
    return { total, roots, subCategories: total - roots };
  }, [categories]);

  const stats = [
    {
      key: 'all',
      label: 'Tổng danh mục',
      value: total,
      icon: Layers,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/10',
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'root',
      label: 'Danh mục gốc',
      value: roots,
      icon: FolderOpen,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100',
      activeBorder: 'border-green-500 ring-2 ring-green-500/10',
      isActive: activeTab === 'root',
      onClick: () => onTabChange('root'),
    },
    {
      key: 'sub',
      label: 'Danh mục con',
      value: subCategories,
      icon: GitBranch,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/10',
      isActive: activeTab === 'sub',
      onClick: () => onTabChange('sub'),
    },
  ];

  return <StatGroup items={stats} gridCols={3} />;
}
