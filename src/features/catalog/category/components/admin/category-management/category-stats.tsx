import React, { useMemo } from 'react';
import { Layers, FolderOpen, GitBranch } from 'lucide-react';
import { Category } from '../../../models/category-model';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`bg-white p-5 rounded-xl border ${stat.borderColor} shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1`}
        >
          <div className={`p-3 rounded-lg ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
