---
name: writing-plans
description: "Write implementation plans: bite-sized tasks, paths, code."
version: 1.1.0
author: Hermes Agent (adapted from obra/superpowers)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [planning, design, implementation, workflow, documentation]
    related_skills: [subagent-driven-development, test-driven-development, requesting-code-review]
---

# Update quotation UI to match quote-detail-response and enhance detail view

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Align the quotation form and detail UI with `GetDetailQuoteByIdResponse`, add RFQ link, conditional display for customer feedback, and refine the customer-facing detail view with rejection reasons and approval/rejection actions.

**Architecture:** 
- quotation-detail.tsx (Admin view): Link to RFQ, conditional customer feedback, display subtotals/taxes, enable Manager actions (Approve/Reject with reason). 
- detail-quotation.tsx (Customer view): Refine display, allow Accept/Reject with reason input (like survey), and Accept button.

**Tech Stack:** React, TypeScript, Next.js, shadcn-ui components, date-fns, lucide-react.

---

### Task 1: Update `quotation-detail.tsx` (Admin View)

**Objective:** Add RFQ link, conditionally display customer feedback, show subtotal/tax, and implement Manager's reject functionality with a reason input.

**Files:**
- Modify: `D:\Thesis\sensorx-fe\src\features\sales\quotation\components\admin\quotation-detail.tsx`
- Modify: `D:\Thesis\sensorx-fe\src\features\sales\quotation\models\quote-detail-response.ts` (Add `rfqId` if not present, or adjust if model is different)
- Create (if needed): `D:\Thesis\sensorx-fe\src\features\sales\quotation\components\admin\quotation-shared\reject-quote-modal.tsx`

**Step 1: Add RFQ Link**
- In `quotation-detail.tsx`, find the header section (`flex items-start justify-between mb-8`).
- Add a new element to display the RFQ code, linking to the RFQ detail page (e.g., `/sales/rfqs/${quoteDetail.rfqId}`). Use `quoteDetail.rfqId` from the model.

**Step 2: Conditionally Display Customer Feedback Card**
- In `quotation-detail.tsx`, locate where `CustomerInfoCard` is rendered.
- Modify the rendering logic for `CustomerResponseCard` (which needs to be implemented in Task 1.5) to only show if `quoteDetail.customerFeedback` has relevant data (e.g., `responseType`, `feedback`, etc.).

**Step 3: Display Subtotal and Total Tax**
- In `quotation-detail.tsx`, find the items table footer (`<tfoot className="bg-gray-50 ...">`).
- Add rows for "Tạm tính" (`subtotal`) and "Thuế VAT" (`totalTax`), displaying their values from `quoteDetail`.

**Step 4: Implement Manager Reject Functionality with Reason Input**
- **Create Modal Component:** Create `D:\Thesis\sensorx-fe\src\features\sales\quotation\components\admin\quotation-shared\reject-quote-modal.tsx`.
  - This component should contain a shadcn-ui Popover or Dialog.
  - Inside, include a `Textarea` for the rejection reason.
  - Add a "Submit" button that calls a prop function `onReject(reason: string)`.
- **Update `quotation-detail.tsx`:**
  - Import the new modal component.
  - Add state for managing the modal's open/closed status and the rejection reason input.
  - Modify the `handleReject` function:
    - When the Manager clicks "Từ chối" (and `quoteDetail.status === QuoteStatus.PENDING`):
      - Open the rejection modal.
      - The modal's submit action will then call the actual API (`QuoteService.reject(id, { reason })`).
  - Update the `QuoteService.reject` call to include the reason.

**Step 5: Implement `CustomerResponseCard`**
- Create `D:\Thesis\sensorx-fe\src\features\sales\quotation\components\admin\quotation-shared\customer-response-card.tsx`.
- This card should display: `recipientName`, `recipientPhone`, `shippingAddress`, `paymentTerm`, and `feedback` from `quoteDetail.customerFeedback`.
- Ensure it only renders if `quoteDetail.customerFeedback` exists and has meaningful data.

**Step 6: Commit**

```bash
git add src/features/sales/quotation/components/admin/quotation-detail.tsx
git add src/features/sales/quotation/models/quote-detail-response.ts
git add src/features/sales/quotation/components/admin/quotation-shared/customer-response-card.tsx
git add src/features/sales/quotation/components/admin/quotation-shared/reject-quote-modal.tsx
git commit -m "feat: enhance admin quotation detail UI & add reject reason"
```

---

### Task 2: Refine `detail-quotation.tsx` (Customer View)

**Objective:** Improve the customer-facing detail view, allowing actions like Accept/Reject with reason input, and remove customer ID prop drilling.

**Files:**
- Modify: `d:\Thesis\sensorx-fe\src\features\store\Components\transactions\detail-quotation.tsx`
- Modify: `D:\Thesis\sensorx-fe\src\features\sales\quotation\components\admin\quotation-detail.tsx` (for consistency in button logic if needed)

**Step 1: Remove Customer ID Prop Drilling**
- Analyze where `customerId` is passed down (`MyRfqsTab`, `MyQuotationsTab`, `OrdersTab`).
- Remove these props (`customerId={customerData?.id}`). Assume these components can fetch or infer the customer ID from context if needed, or adjust their data fetching logic.

**Step 2: Improve Customer View Layout and Info**
- In `detail-quotation.tsx`, ensure all relevant details from `GetDetailQuoteByIdResponse` are displayed clearly (e.g., items, totals, sender info, note, etc.).
- Use the `CustomerResponseCard` and `SenderInfoCard` components here if applicable, adjusted for customer view context.

**Step 3: Implement Customer Actions (Accept/Reject)**
- **Conditional Display:** Show "Chốt báo giá" (Accept) and "Từ chối" (Reject) buttons only when the quote status is `SENT` or `APPROVED`.
- **Accept Button:** The "Chốt báo giá" button should call `QuoteService.accept()` (which already exists in the admin view but might need to be exposed or adapted for customer view).
- **Reject Button:** 
  - When clicked, open a modal similar to the Manager's reject modal.
  - This modal should offer pre-defined reasons (like survey options) and an "Other" text input for the reason.
  - Pre-defined reasons example: "Giá quá cao", "Không hài lòng với điều khoản", "Khác".
  - Upon submission, call `QuoteService.reject()` with the chosen/entered reason.
- **Create Reject Reason Modal Component:** Create `D:\Thesis\sensorx-fe\src\features\store\Components\transactions\reject-quote-modal.tsx` (customer-facing version).
  - This component will handle the radio buttons/dropdown for pre-defined reasons and the text input for "Other".

**Step 4: Update `QuoteService` (if necessary)**
- Ensure `QuoteService.accept` and `QuoteService.reject` are accessible and correctly handle customer-initiated actions.

**Step 5: Commit**

```bash
git add d:\Thesis\sensorx-fe\src\features\store\Components\transactions\detail-quotation.tsx
git add src/features/sales/quotation/components/admin/quotation-detail.tsx (for button logic consistency)
git add src/features/sales/quotation/components/admin/quotation-shared/customer-response-card.tsx (if modified)
git add src/features/store/Components/transactions/reject-quote-modal.tsx
git commit -m "feat: refine customer quotation detail view & actions, remove prop drilling"
```

---

### Task 3: Final Linting and Type Checks

**Objective:** Ensure all code adheres to standards and is type-safe.

**Files:** N/A

**Step 1-5:** Run `npm run lint` and `tsc --noEmit`. Fix any reported errors.

**Commit:**

```bash
git add -u
git commit -m "chore: fix lint/type errors after quotation detail view updates"
```
