# SensorX Project Memory (GEMINI.md)

## 📌 Project Overview
- **Goal**: Professional Catalog/Category Management system.
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, Shadcn UI, Sonner (Toasts), Dnd-kit (Drag & Drop).

## 🛠️ Feature: Category Management
### Data Architecture
- **API Strategy**: Unified `getAll` (list-all) approach. All categories are fetched at once for high-performance Tree and Table operations.
- **Client-side Logic**: 
  - Filtering (Search) and Pagination (10 per page) are handled on the frontend.
  - Search is case-insensitive and scans both **Name** and **Description**.
  - **Circular Hierarchy Prevention**: When selecting a Parent Category, the system recursively filters out all descendants of the current category to prevent circular dependencies.
  - **Searchable Select**: Parent Category selection uses a Popover with a search input for high-efficiency management of large category lists.

### UI/UX Implementation
- **Dual View**: Toggle between **Table View** and **Tree View**.
- **Statistics Dashboard**: Real-time cards showing Total Categories, Root Categories, and Sub-categories.
- **Tree View Navigation**: Single scrollable list with auto-scroll search (similar to MS Word headings) for a seamless experience.
- **Refactored Architecture**: The module is split into focused components under `category-management/` for better maintainability.

### Recent Fixes & Improvements (2026-04-23)
- **Refactored Structure**: Moved code to `category-management/` directory.
- **Scroll Fix**: Resolved scrolling issues in searchable selects by handling event propagation.
- **Dynamic Feedback**: Integrated `response.message` from the API directly into Toast notifications.
- Fixed D&D interference caused by search highlighting (added `pointer-events-none`).
- Implemented `parentName` usage directly from API response to avoid expensive lookups.
- Configured global `Toaster` in `RootLayout`.
- Resolved scrolling issues by making the Category List container scrollable with a sticky header.

## ⚠️ Important Notes
- **API Synchronization**: The `Category` model must always include `parentName` and `parentId`.
- **D&D Sensitivity**: Use the `GripVertical` handle for dragging.
- **Pagination**: When in Table mode, the pagination bar is sticky at the bottom.
