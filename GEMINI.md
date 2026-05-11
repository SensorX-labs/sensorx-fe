# Project Memory - SensorX B2B Store

## Overview
SensorX is a B2B E-commerce platform. This memory tracks the major UI overhaul and architectural decisions for the Storefront.

## UI Standards (Premium Dashboard Style)
- **Detail Views**: Use a **3-column grid** (2/3 for content, 1/3 for sidebar).
  - Left/Main: Lists, tables, primary data.
  - Right/Sidebar: Timelines (Process tracking), Contact info, sticky actions.
- **Typography**: Tracking-heavy uppercase labels for a technical/industrial feel (e.g., `tracking-widest`, `meta-label`).
- **Colors**:
  - Brand Green: `var(--brand-green)` for success/primary actions.
  - Grayscale: Heavy use of gray-50 to gray-900 for a clean, professional look.

## Core Components
- **StoreHeader**: 
  - Left: Logo.
  - Center: Nav Menu (Sản phẩm, Giải pháp, Thương hiệu, Liên hệ).
  - Right: Quick access icons (RFQs, Quotes, Orders) + User Profile.
- **TransactionsLayout**: Tabbed interface for RFQs, Quotations, and Orders. Uses search params (`?tab=...`) to persist state.

## Routing structure
- `/transactions`: Main list view with tabs.
- `/transactions/rfqs/[id]`: RFQ details.
- `/transactions/quotations/[id]`: Quotation details.
- `/transactions/orders/[id]`: Order details.

## Transaction Status Mapping
### Quotations:
- `WAITING` (SENT/PENDING): Chờ phản hồi
- `ACCEPTED` (ORDERED/APPROVED): Đã chốt
- `RETURNED`: Đã từ chối
- `EXPIRED`: Hết hạn

### Orders:
- `PendingPayment`: Chờ thanh toán
- `Processing`: Đang xử lý
- `Dispatched`: Đã xuất kho
- `Cancelled`: Đã hủy

## Recent Updates (2026-05-11)
- Redesigned `StoreHeader` and fixed JSX syntax errors.
- Implemented `QuotationDetailView` and `OrderDetailView` in dual-column layout.
- Standardized status filters in transaction tabs.
- Added `OrderService` for mock data retrieval.