# Cấu Trúc Dự Án SensorX Frontend

## Tổng Quan

Dự án **SensorX Frontend** là một ứng dụng Next.js hiện đại được tổ chức theo kiến trúc **Feature-based** (Kiến trúc dựa trên tính năng). Cách tổ chức này giúp quản lý code dễ dàng hơn khi dự án phát triển.

```
sensorx-fe/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── features/            # Các tính năng chính của ứng dụng
│   ├── layouts/             # Các layout chung của ứng dụng
│   └── shared/              # Các thành phần, hooks, utils dùng chung
├── public/                  # Tài liệu tĩnh (images, icons, etc.)
├── docs/                    # Tài liệu dự án
└── [Config files]           # TSConfig, ESLint, Next.js config, etc.
```

---

## 📁 Chi Tiết Cấu Trúc

### 1. **`src/app/`** - Next.js Application Router
- **Mục đích**: Chứa route định nghĩa và layout chính của ứng dụng
- **Files chính**:
  - `layout.tsx`: Layout chính cho toàn bộ ứng dụng
  - `page.tsx`: Trang chủ (Home page)
  - `globals.css`: CSS toàn cục

### 2. **`src/features/`** - Features (Tính Năng Chính)
Mỗi feature là một module độc lập với responsibility riêng. Hiện tại có 4 features:

#### **2.1 Auth** (Xác thực)
```
features/auth/
├── components/      # Components liên quan đến đăng nhập, đăng ký
├── models/          # Kiểu dữ liệu TypeScript
├── schemas/         # Validation schemas (Zod, Yup, etc.)
├── services/        # API services, logic xác thực
└── README.md        # Hướng dẫn chi tiết cho feature Auth
```
- **Trách nhiệm**: Quản lý đăng nhập, đăng ký, reset mật khẩu, tokens, sessions

#### **2.2 Category** (Danh Mục)
```
features/category/
├── components/      # Components hiển thị danh mục
├── models/          # Kiểu dữ liệu Category
├── schemas/         # Validation cho Category
├── services/        # API services cho Category
└── README.md
```
- **Trách nhiệm**: Quản lý danh mục sản phẩm/cảm biến

#### **2.3 Product** (Sản Phẩm)
```
features/product/
├── components/      # Components Product (listing, detail, form)
├── models/          # Kiểu dữ liệu Product
├── schemas/         # Validation cho Product
├── services/        # API services cho Product
└── README.md
```
- **Trách nhiệm**: Quản lý thông tin sản phẩm, cảm biến

#### **2.4 User** (Người Dùng)
```
features/user/
├── components/      # Components profile, settings
├── models/          # Kiểu dữ liệu User
├── schemas/         # Validation cho User
├── services/        # API services cho User
└── README.md
```
- **Trách nhiệm**: Quản lý thông tin người dùng, hồ sơ, cài đặt

### 3. **`src/layouts/`** - Layouts Chung
```
layouts/
├── client/          # Layout cho phía client/user
│   └── README.md
├── crm/             # Layout cho phía CRM/admin
│   └── README.md
└── README.md
```
- **Mục đích**: Chứa các layout được sử dụng bởi nhiều pages
- Ví dụ: Sidebar, Header, Navigation, Footer

### 4. **`src/shared/`** - Thành Phần & Utilities Dùng Chung

#### **4.1 components/**
```
shared/components/
├── common/          # Components UI chung (Modal, Card, List, etc.)
├── shadcn-ui/       # Components từ shadcn/ui library
│   ├── button.tsx
│   └── README.md
└── README.md
```
- **Mục đích**: Chứa các UI components tái sử dụng được

#### **4.2 configs/**
- **Mục đích**: Cấu hình ứng dụng (API endpoints, constants config, etc.)

#### **4.3 constants/**
- **Mục đích**: Các hằng số được dùng toàn ứng dụng (messages, enums, etc.)

#### **4.4 hooks/**
- **Mục đích**: Custom React hooks dùng chung (useAuth, useForm, etc.)

#### **4.5 models/**
- **Mục đích**: Các kiểu dữ liệu chung, interfaces

#### **4.6 services/**
- **Mục đích**: Các API services/utilities dùng chung (Axios instance, request helpers)

#### **4.7 utils/**
- **Mục đích**: Utility functions chung
- **Files chính**:
  - `cn.ts`: Utility để merge CSS classes (thường dùng tailwindcss)
  - `index.ts`: Export các utils khác

---

## 🏗️ Kiến Trúc Của Một Feature

Mỗi feature được tổ chức theo cấu trúc chuẩn:

```
feature/
├── README.md           # Tài liệu riêng cho feature
├── components/         # React components
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── README.md
├── models/             # TypeScript interfaces/types
│   ├── index.ts        # Export các types
│   └── README.md
├── schemas/            # Validation schemas
│   ├── loginSchema.ts  # Zod/Yup schemas
│   └── README.md
└── services/           # API services
    ├── authService.ts  # Business logic
    └── README.md
```

### Giải Thích Từng Thư Mục:

| Folder | Mục Đích | Ví Dụ |
|--------|----------|--------|
| **components/** | UI Components cho feature | LoginForm, RegisterModal, UserProfile |
| **models/** | TypeScript types & interfaces | `interface User { id: string; email: string; }` |
| **schemas/** | Validation rules | `const loginSchema = z.object({ email: z.string().email() })` |
| **services/** | API calls & business logic | `const login = (email, password) => api.post('/auth/login', ...)` |

---

## 📦 File Config Chính

| File | Mục Đích |
|------|----------|
| `package.json` | Dependencies và scripts |
| `tsconfig.json` | Cấu hình TypeScript |
| `next.config.ts` | Cấu hình Next.js |
| `tailwind.config.js` | Cấu hình Tailwind CSS (nếu có) |
| `eslint.config.mjs` | Quy tắc ESLint |
| `postcss.config.mjs` | Cấu hình PostCSS |
| `components.json` | Cấu hình shadcn/ui |

---

## 🔄 Flow Dữ Liệu

```
UI Component (components/)
        ↓
   Service Call (services/)
        ↓
   API Backend
        ↓
   Service → TypeScript Model (models/)
        ↓
   Component Re-render
```

---

## 💡 Best Practices

1. **Tách biệt concerns**: Mỗi thư mục có trách nhiệm riêng
2. **Tái sử dụng code**: Dùng `shared/` cho code dùng chung
3. **Validation**: Luôn validate dữ liệu trong `schemas/`
4. **Type safety**: Sử dụng TypeScript cho all files
5. **Documentation**: Mỗi feature nên có README.md chi tiết

---

## 🚀 Tiếp Theo

- Xem [**ARCHITECTURE.md**](./ARCHITECTURE.md) để hiểu chi tiết hơn về kiến trúc
- Xem [**FEATURES.md**](./FEATURES.md) để tìm hiểu về từng feature
- Xem [**DEVELOPMENT_GUIDE.md**](./DEVELOPMENT_GUIDE.md) để bắt đầu phát triển
