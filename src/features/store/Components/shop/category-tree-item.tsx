import React from 'react';
import { Category } from '@/features/catalog/category/models';

export interface CategoryNode extends Category {
    children: CategoryNode[];
}

export const buildCategoryTree = (flatCategories: Category[]): CategoryNode[] => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    flatCategories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    flatCategories.forEach(cat => {
        const node = map.get(cat.id)!;
        if (cat.parentId && map.has(cat.parentId)) {
            map.get(cat.parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
};

interface CategoryTreeItemProps {
    node: CategoryNode;
    level: number;
    selectedCategories: string[];
    onCategorySelect: (id: string) => void;
}

export function CategoryTreeItem({
    node,
    level,
    selectedCategories,
    onCategorySelect,
}: CategoryTreeItemProps) {
    const isSelected = selectedCategories.includes(node.id);
    const hasChildren = node.children.length > 0;

    return (
        <div className="space-y-1">
            <button
                onClick={() => onCategorySelect(node.id)}
                className={`w-full text-left py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest transition-all flex items-center gap-3 group/item ${isSelected
                    ? 'text-primary dark:text-secondary translate-x-1'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:translate-x-1'
                    }`}
                style={{ paddingLeft: `${level * 16}px` }}
            >
                <div className="relative flex items-center justify-center">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected
                        ? 'bg-secondary scale-125 shadow-sm'
                        : 'bg-transparent border border-gray-300 dark:border-zinc-700 group-hover/item:border-gray-900 dark:group-hover/item:border-white'
                        }`} />
                </div>
                <span>{node.name}</span>
            </button>
            {hasChildren && (
                <div className="mt-1">
                    {node.children.map((child) => (
                        <CategoryTreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedCategories={selectedCategories}
                            onCategorySelect={onCategorySelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
