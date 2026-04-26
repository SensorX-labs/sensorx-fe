# SensorX Project Memory (GEMINI.md)

## 📌 Project Overview
- **Goal**: Professional Catalog/Category Management system.
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, Shadcn UI, Sonner (Toasts), Dnd-kit (Drag & Drop).

## 🛠️ Feature: API Standardization & Model Refactoring (2026-04-25)
### Data Architecture
- **Unified Result Pattern**: System-wide migration to `Result<T>` and `OffsetPagedResult<T>` from `base-response.ts`.
- **Universal Axios Interceptor**:
  - **Success**: Transparently wraps responses. Spreads data fields into the root for legacy compatibility while keeping the `.value` property for new logic.
  - **Error**: Enriches `AxiosError` with `isSuccess: false` and a robustly extracted `message` (scans for `message`, `Message`, or the first entry in `errors` array/object).
- **Service Pattern**: Phased out class-based services in favor of constant objects (e.g., `export const ProductService = { ... }`) for better performance and singleton consistency.
- **Pagination**: Standardized on `BaseQueryOffsetPagedList` for requests. Keyset pagination is supported via `BaseQueryKeysetPagedList` where `lastCreatedAt` and `lastId` are used.

### UI/UX Implementation
- **Result Handling**: Components now consistently check `response.isSuccess` before accessing `response.value`.
- **Toast Integration**: `axios-config.ts` handles global error toasting, reducing boilerplate in components.
- **Admin Header Standards**:
  - **Structure**: Uses a navigation button (Back) followed by a `w-px bg-slate-100` vertical divider.
  - **Title Line**: Main action title (Uppercase, font-black) paired with a high-visibility SKU badge (`bg-emerald-50`, `font-black`, `Barcode` icon) during updates.
  - **Subtitle Line**: Brief context with an emerald indicator dot.
- **Generic Selection Framework**:
  - **Base Component**: `BaseSelectionModal<T>` used for all pickers (Product, Category).
  - **Features**: Infinite scroll, debounced search, and generic row rendering.

## 🛠️ Feature: Internal Price Management (2026-04-25)
### UI Strategy
- **2-Column Layout (Form)**: Basic Info on the left (2/5), Price Tiers on the right (3/5) for optimal workflow.
- **Expansion**: Max-width constraints removed to utilize full screen width on large monitors.
- **Standardized Typography**: Aligned with the Category module for a cohesive admin experience. Reverted aggressive weights (font-black) and sizes (text-3xl) to a balanced `font-bold` / `text-2xl` scale.
- **Lock-Height Navigation**: Main list view uses `calc(100vh - HEADER - FOOTER - BUFFER)` to prevent global scroll and lock the dashboard feel.

### Data Model
- **Price Tiers**: Quantity-based pricing where price must decrease as quantity increases.
- **Status lifecycle**: Active, Expiring Soon, Inactive, Expired.

### Navigation & State Strategy
- **Internal State vs Router**: For Product management (Create/Update), use internal `view` state within the `Management` component instead of `router.push` query parameters. This keeps the URL clean and transitions faster.
- **Detail View**: Only the "Detail" view uses persistent URL routing (`/catalog/products/[id]`).

## ⚠️ Important Notes
- **Legacy Compatibility**: `PaginationResponse` and `PaginationRequest` are deprecated. Use `OffsetPagedResult` and `BaseQueryOffsetPagedList` instead.
- **Layout Consistency**: Always use `w-full` for admin dashboard features to maximize usable space.
- **Import Constraints**: `lucide-react` is strictly for icons. UI components must be imported from `@/shared/components/shadcn-ui/...`.
- **Admin Header Buffer**: Use `-mt-4` and carefully calculated `100vh` offsets to keep content flush with the breadcrumbs/header.
- **Rounded Corners**: Standard rounding is `rounded` (approx 4px) for cards, buttons, and inputs. Avoid large rounding.
