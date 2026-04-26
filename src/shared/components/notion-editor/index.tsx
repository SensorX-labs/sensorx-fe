'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Markdown } from 'tiptap-markdown';
import {
  Bold, Italic, Code,
  Underline as UnderlineIcon,
  CheckSquare, Heading1, Heading2,
  Type, List, ListOrdered, Quote,
  Table as TableIcon, Plus, Trash2,
  ArrowLeftToLine, ArrowRightToLine,
  ArrowUpToLine, ArrowDownToLine,
} from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { cn } from '@/shared/utils';

interface NotionEditorProps {
  content: string; // Chuỗi Markdown
  onChange?: (content: string) => void;
  editable?: boolean;
}

const COMMANDS = [
  {
    id: 'text',
    title: 'Text',
    description: 'Just start typing with plain text.',
    icon: 'Type',
    command: (editor: any) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: 'h1',
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: 'Heading1',
    command: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'h2',
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: 'Heading2',
    command: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'table',
    title: 'Table',
    description: 'Chèn danh sách dạng bảng.',
    icon: 'Table',
    command: (editor: any) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    id: 'todo',
    title: 'To-do list',
    description: 'Track tasks với danh sách việc cần làm.',
    icon: 'CheckSquare',
    command: (editor: any) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    id: 'bullet',
    title: 'Bullet list',
    description: 'Danh sách không thứ tự.',
    icon: 'List',
    command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'ordered',
    title: 'Numbered list',
    description: 'Danh sách có thứ tự.',
    icon: 'ListOrdered',
    command: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'quote',
    title: 'Quote',
    description: 'Trích dẫn văn bản.',
    icon: 'Quote',
    command: (editor: any) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'code',
    title: 'Code',
    description: 'Khối mã lập trình.',
    icon: 'Code',
    command: (editor: any) => editor.chain().focus().toggleCodeBlock().run(),
  },
];

const IconMap: Record<string, React.ElementType> = {
  Type,
  Heading1,
  Heading2,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Table: TableIcon,
};

export function NotionEditor({ content, onChange, editable = true }: NotionEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, isAbove: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: {},
      }),
      Placeholder.configure({
        placeholder: 'Gõ / để chọn lệnh hoặc bắt đầu viết...',
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange?.(markdown);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          setTimeout(() => {
            const { selection } = view.state;
            const coords = view.coordsAtPos(selection.from);
            const spaceBelow = window.innerHeight - coords.bottom;
            const threshold = 350; // Chiều cao ước tính của menu
            const shouldShowAbove = spaceBelow < threshold;

            setMenuPos({
              top: shouldShowAbove ? coords.top - 8 : coords.bottom + 4,
              left: coords.left,
              isAbove: shouldShowAbove,
            });
            setShowSlashMenu(true);
            setSelectedIndex(0);
          }, 10);
          return false;
        }

        if (showSlashMenu) {
          if (event.key === 'ArrowDown') {
            setSelectedIndex((i) => (i + 1) % COMMANDS.length);
            return true;
          }
          if (event.key === 'ArrowUp') {
            setSelectedIndex((i) => (i - 1 + COMMANDS.length) % COMMANDS.length);
            return true;
          }
          if (event.key === 'Enter') {
            const item = COMMANDS[selectedIndex];
            editor
              ?.chain()
              .focus()
              .deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
              })
              .run();
            item.command(editor);
            setShowSlashMenu(false);
            return true;
          }
          if (event.key === 'Escape' || event.key === 'Backspace') {
            setShowSlashMenu(false);
            return false; // Cho phép kịch bản xóa ký tự diễn ra bình thường
          }
        }

        return false;
      },
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] transition-all',
          editable ? 'cursor-text bg-white p-12' : 'bg-transparent p-0 border-none shadow-none'
        ),
      },
    },
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSlashMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!editor) return null;

  const executeCommand = (item: (typeof COMMANDS)[number]) => {
    editor
      .chain()
      .focus()
      .deleteRange({
        from: editor.state.selection.from - 1,
        to: editor.state.selection.from,
      })
      .run();
    item.command(editor);
    setShowSlashMenu(false);
  };

  return (
    <div
      className={cn(
        'relative group transition-all',
        editable && 'border border-gray-100 rounded-lg shadow-sm overflow-hidden'
      )}
    >
      {editable && (
        <>
          <BubbleMenu
            editor={editor}
            shouldShow={({ state }: { state: any }) => {
              const matches = editor.isActive('table');
              return !matches && state.selection.content().size > 0;
            }}
          >
            <div className="flex bg-white shadow-xl border border-gray-200 rounded-lg p-1 gap-0.5 animate-in fade-in zoom-in duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-blue-50 text-blue-600')}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-blue-50 text-blue-600')}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('underline') && 'bg-blue-50 text-blue-600')}
              >
                <UnderlineIcon className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-blue-50 text-blue-600')}
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>
          </BubbleMenu>

          <BubbleMenu
            editor={editor}
            shouldShow={() => editor.isActive('table')}
          >
            <div className="flex bg-white shadow-xl border border-gray-200 rounded-lg p-1 gap-0.5 animate-in fade-in zoom-in duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                title="Thêm cột bên trái"
                className="h-8 w-8 p-0"
              >
                <ArrowLeftToLine className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                title="Thêm cột bên phải"
                className="h-8 w-8 p-0"
              >
                <ArrowRightToLine className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                title="Xóa cột"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                title="Thêm hàng bên trên"
                className="h-8 w-8 p-0"
              >
                <ArrowUpToLine className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                title="Thêm hàng bên dưới"
                className="h-8 w-8 p-0"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteRow().run()}
                title="Xóa hàng"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete table"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>
          </BubbleMenu>
        </>
      )}

      <EditorContent editor={editor} className="outline-none" />

      {showSlashMenu && editable && (
        <div
          ref={menuRef}
          className={cn(
            "fixed z-50 bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden min-w-[300px] animate-in duration-200",
            menuPos.isAbove ? "slide-in-from-bottom-2" : "slide-in-from-top-2"
          )}
          style={{ 
            top: menuPos.top, 
            left: menuPos.left,
            transform: menuPos.isAbove ? 'translateY(-100%)' : 'none'
          }}
        >
          <div className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50/50">
            Basic Blocks
          </div>
          <div className="max-h-[350px] overflow-y-auto p-1 py-0 px-2 pb-2">
            {COMMANDS.map((item, index) => {
              const Icon = IconMap[item.icon];
              return (
                <button
                  key={item.id}
                  onClick={() => executeCommand(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                    selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 border border-gray-100 rounded flex items-center justify-center bg-white shadow-sm">
                    {Icon && <Icon className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">{item.title}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-1">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none !important;
        }
        .ProseMirror h1 {
          font-size: 2.5rem !important;
          font-weight: 800;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .ProseMirror h2 {
          font-size: 1.75rem !important;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror ul[data-type='taskList'] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type='taskList'] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul[data-type='taskList'] li input[type='checkbox'] {
          appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          margin-top: 0.3rem;
          margin-right: 0.75rem;
          cursor: pointer;
          position: relative;
        }
        .ProseMirror ul[data-type='taskList'] li input[type='checkbox']:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        .ProseMirror ul[data-type='taskList'] li input[type='checkbox']:checked::after {
          content: '✓';
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.8rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          color: #475569;
          font-style: italic;
          background: #f8fafc;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .ProseMirror code {
          background: #f1f5f9;
          color: #ef4444;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }
        .ProseMirror pre {
          background: #1e293b;
          color: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f8fafc;
        }
        .ProseMirror table .selectedCell:after {
          z-index: 2;
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }
        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: #3b82f6;
          pointer-events: none;
        }
        .ProseMirror .tableWrapper {
          overflow-x: auto;
        }
        .ProseMirror.resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
      `}</style>
    </div>
  );
}