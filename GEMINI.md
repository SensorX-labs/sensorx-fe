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

### UI/UX Implementation
- **Dual View**: Toggle between **Table View** and **Tree View**.
- **Refactored Architecture**: Split into focused components under `category-management/`.
- **Typography Standards**:
  - Labels: `text-[10px] font-semibold uppercase text-slate-400 tracking-wider`.
  - Values: `text-sm font-bold text-slate-900`.
  - Titles: `text-xl font-bold text-slate-800`.

## 🛠️ Feature: Internal Price Management (2026-04-25)
### UI Strategy
- **2-Column Layout (Form)**: Basic Info on the left (2/5), Price Tiers on the right (3/5) for optimal workflow.
- **Expansion**: Max-width constraints removed to utilize full screen width on large monitors.
- **Standardized Typography**: Aligned with the Category module for a cohesive admin experience. Reverted aggressive weights (font-black) and sizes (text-3xl) to a balanced `font-bold` / `text-2xl` scale.
- **Lock-Height Navigation**: Main list view uses `calc(100vh - HEADER - FOOTER - BUFFER)` to prevent global scroll and lock the dashboard feel.

### Data Model
- **Price Tiers**: Quantity-based pricing where price must decrease as quantity increases.
- **Status lifecycle**: Active, Expiring Soon, Inactive, Expired.

## ⚠️ Important Notes
- **Layout Consistency**: Always use `w-full` for admin dashboard features to maximize usable space.
- **Import Constraints**: `lucide-react` is strictly for icons. UI components must be imported from `@/shared/components/shadcn-ui/...`.
- **Admin Header Buffer**: Use `-mt-4` and carefully calculated `100vh` offsets to keep content flush with the breadcrumbs/header.
