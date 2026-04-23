import { Category } from '../../../models/category-model';

// --- SEARCH HIGHLIGHT ---
export function HighlightText({
  text,
  highlight,
  isActive = false
}: {
  text: string;
  highlight: string;
  isActive?: boolean
}) {
  if (!highlight.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span className="pointer-events-none">
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className={`rounded px-0.5 transition-colors ${isActive ? 'bg-orange-400 text-white' : 'bg-yellow-200 text-yellow-900'}`}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// --- TREE LOGIC ---
export interface TreeNode extends Category {
  children?: TreeNode[];
}

export function buildTree(flatList: Category[]): TreeNode[] {
  const map: Record<string, TreeNode> = {};
  const tree: TreeNode[] = [];

  flatList.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  flatList.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children?.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
}

export function getAllDescendantIds(categories: Category[], parentId: string): string[] {
  const children = categories.filter(c => c.parentId === parentId);
  let ids = children.map(c => c.id);
  children.forEach(child => {
    ids = [...ids, ...getAllDescendantIds(categories, child.id)];
  });
  return ids;
}
