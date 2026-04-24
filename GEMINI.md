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

## 🛠️ Feature: Internal Price Management (2026-04-24)
### UI Strategy
- **Read-Priority Dashboard**: Optimized for data consumption with expandable rows in the list view to see Price Tiers without navigating away.
- **Tabbed Detail View**: Separates core info, tier rules, and product assignments.
- **Rule Enforcement**: Visual validation (Suggested >= Floor, Price < Suggested, Price decreasing with Quantity) shown via tooltips and helper text instead of invasive popups.
- **Action-Oriented**: Support for Extending, Deactivating, and Duplicating prices directly from the UI.

### Data Model
- **Price Tiers**: Quantity-based pricing where price must decrease as quantity increases.
- **Status lifecycle**: Active, Expiring Soon, Inactive, Expired.

## ⚠️ Important Notes
- **API Synchronization**: The `Category` model must always include `parentName` and `parentId`.
- **Internal Price Actions**: Duplicate action should NOT copy product assignments, only the pricing rules.
- **D&D Sensitivity**: Use the `GripVertical` handle for dragging.
- **Pagination**: When in Table mode, the pagination bar is sticky at the bottom.
