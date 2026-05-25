import React, { useMemo } from 'react';
import { Layers, FolderOpen, GitBranch } from 'lucide-react';
import { Category } from '../../models';
import { StatGroup } from '@/shared/components/admin/stat-card';
import { StatColorTheme } from '@/shared/components/admin/stat-card/stat-card';

interface CategoryStatsProps {
  categories: Category[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CategoryStats({ categories, activeTab, onTabChange }: CategoryStatsProps) {
  const { total, roots, subCategories } = useMemo(() => {
    const total = categories.length;
    const roots = categories.filter(category => !category.parentId).length;

    return {
      total,
      roots,
      subCategories: total - roots,
    };
  }, [categories]);

  const stats = [
    {
      key: 'all',
      label: 'Tổng danh mục',
      value: total,
      icon: Layers,
      colorTheme: 'blue' as StatColorTheme,
      isActive: activeTab === 'all',
      onClick: () => onTabChange('all'),
    },
    {
      key: 'root',
      label: 'Danh mục gốc',
      value: roots,
      icon: FolderOpen,
      colorTheme: 'green' as StatColorTheme,
      isActive: activeTab === 'root',
      onClick: () => onTabChange('root'),
    },
    {
      key: 'sub',
      label: 'Danh mục con',
      value: subCategories,
      icon: GitBranch,
      colorTheme: 'purple' as StatColorTheme,
      isActive: activeTab === 'sub',
      onClick: () => onTabChange('sub'),
    },
  ];

  return <StatGroup items={stats} variant="pill" />;
}
