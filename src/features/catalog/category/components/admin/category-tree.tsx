'use client';

import React, { useEffect, useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, FolderTree } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { buildTree, TreeNode, HighlightText } from './category-utils';
import { Category } from '../../models/category-model';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryMoveDialog } from './category-move-dialog';

interface CategoryTreeProps {
  categories: Category[];
  searchTerm: string;
  activeId: string | null;
  onEdit: (cat: Category) => void;
  onRefresh: () => void;
  onMatchesChange?: (matches: string[]) => void;
}

export function CategoryTree({
  categories,
  searchTerm,
  activeId,
  onEdit,
  onRefresh,
  onMatchesChange,
}: CategoryTreeProps) {
  const tree = buildTree(categories);
  
  // Logic tìm kiếm các node khớp - Vẫn nằm ở Tree vì nó liên quan đến cấu trúc dữ liệu
  useEffect(() => {
    if (searchTerm.trim()) {
      const matches = categories
        .filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map(cat => cat.id);
      onMatchesChange?.(matches);
    } else {
      onMatchesChange?.([]);
    }
  }, [searchTerm, categories]);

  // Logic cuộn - Tree tự lo việc hiển thị
  useEffect(() => {
    if (activeId) {
      const element = document.getElementById(`tree-item-${activeId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeId]);
  // D&D Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // States cho Dialogs
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveConfig, setMoveConfig] = useState<{
    active: Category | null;
    target: Category | null;
  }>({ active: null, target: null });

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setDraggingId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setDraggingId(null);

    const activeItem = categories.find(c => c.id === active.id);
    if (!activeItem) return;

    if (over === null || over.id === 'root-drop-zone') {
      if (activeItem.parentId === null) return;
      setMoveConfig({ active: activeItem, target: null });
      setIsMoveOpen(true);
      return;
    }

    if (active.id === over.id) return;
    const overItem = categories.find(c => c.id === over.id);

    if (overItem) {
      setMoveConfig({ active: activeItem, target: overItem });
      setIsMoveOpen(true);
    }
  };

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                onEdit={onEdit}
                onDelete={(cat) => {
                  setDeletingCategory(cat);
                  setIsDeleteOpen(true);
                }}
                highlight={searchTerm}
                activeId={activeId || ''}
                isDraggingAny={!!draggingId}
              />
            ))}
          </div>
        </SortableContext>

        {activeId && (
          <div className="mt-4 p-4 border-t border-gray-100 bg-gray-50/30">
            <RootDropZone />
          </div>
        )}

        <DragOverlay>
          {draggingId ? (
            <div className="bg-white px-4 py-3 rounded-lg shadow-xl border-2 border-emerald-500 flex items-center gap-3 opacity-95">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-gray-900">
                {categories.find(c => c.id === draggingId)?.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Dialogs đóng gói bên trong */}
      <CategoryDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        categoryId={deletingCategory?.id ?? null}
        categoryName={deletingCategory?.name ?? null}
        onSuccess={() => {
          setIsDeleteOpen(false);
          onRefresh();
        }}
      />

      <CategoryMoveDialog
        isOpen={isMoveOpen}
        onOpenChange={setIsMoveOpen}
        activeCategory={moveConfig.active}
        targetCategory={moveConfig.target}
        onSuccess={() => {
          setIsMoveOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}

function TreeItem({
  node,
  depth = 0,
  onEdit,
  onDelete,
  highlight = '',
  activeId = '',
  isDraggingAny = false,
}: {
  node: TreeNode;
  depth?: number;
  onEdit: (cat: any) => void;
  onDelete: (cat: any) => void;
  highlight?: string;
  activeId?: string;
  isDraggingAny?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`,
    opacity: isDragging ? 0.3 : 1,
  };

  const isActiveMatch = activeId === node.id;

  return (
    <div ref={setNodeRef} style={style} className="group" id={`tree-item-${node.id}`}>
      <div className={`
        flex items-center gap-3 bg-white p-3 rounded-lg border transition-all
        ${isActiveMatch ? 'border-orange-500 shadow-md ring-2 ring-orange-100' : 'border-gray-100 hover:border-blue-200 hover:shadow-sm'}
      `}>
        {/* Grip Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Content Area */}
        <div className={`flex-1 flex items-center gap-3 min-w-0 ${isDraggingAny ? 'pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              <HighlightText text={node.name} highlight={highlight} isActive={isActiveMatch} />
            </span>
            {node.description && (
              <span className="text-xs text-gray-400 truncate border-l border-gray-100 pl-2 ml-1 flex-1">
                <HighlightText text={node.description} highlight={highlight} isActive={isActiveMatch} />
              </span>
            )}
          </div>
          {node.children && node.children.length > 0 && (
            <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-medium border border-blue-100 flex-shrink-0">
              {node.children.length} con
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isDraggingAny ? 'pointer-events-none' : ''}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => onEdit(node)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(node)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              highlight={highlight}
              activeId={activeId}
              isDraggingAny={isDraggingAny}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RootDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'root-drop-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-3 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200
        ${isOver
          ? 'border-orange-500 bg-orange-50 text-orange-600 scale-[1.01] shadow-md shadow-orange-100'
          : 'border-gray-200 bg-gray-50/50 text-gray-400'
        }
      `}
    >
      <div className={`p-1.5 rounded-full transition-colors ${isOver ? 'bg-orange-100' : 'bg-gray-100'}`}>
        <FolderTree className="w-4 h-4" />
      </div>
      <p className="font-semibold text-xs text-center">Thả vào đây để làm danh mục gốc</p>
      <p className="text-[10px] opacity-60 text-center">Xóa danh mục cha hiện tại</p>
    </div>
  );
}
