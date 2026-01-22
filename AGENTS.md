# AGENTS.md - AI Coding Agent Guidelines for TechMedis

This document provides guidelines for AI coding agents working on the TechMedis codebase.

## Project Overview

TechMedis is a medical/veterinary equipment e-commerce platform built with:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (new-york style)
- **Database**: MySQL 8.0 + Prisma ORM
- **Forms**: react-hook-form + Zod validation
- **Animations**: Framer Motion

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Build
npm run build            # Production build

# Linting
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma Client (run after schema changes)
npx prisma db push       # Push schema to database
npx prisma migrate dev   # Run migrations in development
npx prisma studio        # Open Prisma Studio GUI

# Docker (MySQL)
docker-compose up -d     # Start MySQL database
```

### Testing (Not Yet Configured)

No testing framework is currently set up. When tests are added:
```bash
# Jest
npm test                              # Run all tests
npm test -- --testPathPattern="name"  # Run single test by name
npm test -- path/to/file.test.ts      # Run specific test file

# Vitest
npx vitest                            # Run all tests
npx vitest run path/to/test.ts        # Run specific test file
```

## Project Structure

```
app/                      # Next.js App Router pages
  ├── layout.tsx          # Root layout (client component)
  ├── globals.css         # Global styles + Tailwind + CSS variables
  ├── admin/              # Admin panel (CRUD operations)
  ├── productos/[slug]/   # Dynamic product pages
  └── [category pages]/   # Category catalogs
components/               # Shared components
  ├── ui/                 # shadcn/ui primitives
  └── [feature components]
lib/                      # Utilities and logic
  ├── utils.ts            # cn() utility for classnames
  ├── prisma.ts           # Prisma client singleton
  ├── actions/            # Server Actions
  └── validations/        # Zod schemas
prisma/                   # Database schema and migrations
public/uploads/           # User-uploaded images
```

## Code Style Guidelines

### Imports

Order imports as follows:
```typescript
// 1. React/Next.js
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 2. External libraries
import { motion } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";

// 3. Internal imports (use @ alias)
import { createProduct } from "@/lib/actions/products";
import { Product } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files (components) | kebab-case | `product-card.tsx` |
| React Components | PascalCase | `ProductCard` |
| Functions | camelCase | `createProduct`, `handleSubmit` |
| Variables | camelCase | `isLoading`, `formData` |
| Constants | SCREAMING_SNAKE_CASE | `CATEGORIES`, `STATUS_OPTIONS` |
| Types/Interfaces | PascalCase | `Product`, `ActionResponse` |
| CSS Variables | kebab-case | `--techmedis-primary` |

### TypeScript Patterns

```typescript
// Props interfaces
interface ProductCardProps {
  product: Product;
}

// Zod schema type inference
export type CreateProductInput = z.infer<typeof createProductSchema>;

// Const assertions for type-safe arrays
export const CATEGORIES = ["clinico", "veterinario"] as const;
export type Category = (typeof CATEGORIES)[number];

// Server action response type
type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Error Handling

**Server Actions**: Use try-catch with ActionResponse pattern:
```typescript
export async function createProduct(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    // ... logic
    return { success: true, data: { id: product.id } };
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear el producto" };
  }
}
```

**Client-side**: Use toast notifications:
```typescript
const result = await createProduct(form);
if (result.success) {
  toast({ title: "Producto creado", description: "..." });
} else {
  toast({ title: "Error", description: result.error, variant: "destructive" });
}
```

### Component Patterns

**Server Components** (data fetching):
```typescript
// app/admin/page.tsx
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();
  return <AdminDashboard initialProducts={products} />;
}
```

**Client Components** (interactivity):
```typescript
"use client";

import { useState } from "react";

interface ComponentProps {
  initialData: Data[];
}

export function Component({ initialData }: ComponentProps) {
  const [state, setState] = useState(initialData);
  // ...
}
```

### shadcn/ui Components

Use the cva (Class Variance Authority) pattern with forwardRef:
```typescript
const buttonVariants = cva("inline-flex items-center...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "h-9 px-4", sm: "h-8 px-3" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";
```

### Tailwind CSS

- Use custom brand colors: `techmedis-primary`, `techmedis-secondary`, `techmedis-text`
- Responsive breakpoints: `md:` (tablet), `lg:` (desktop)
- Always use `cn()` utility for conditional classes

## Server Actions

Located in `lib/actions/`. Must include:
1. `"use server"` directive at file top
2. Return `ActionResponse<T>` objects
3. Call `revalidatePath()` after mutations

## Validation Schemas

Located in `lib/validations/`:
- Use Zod for runtime validation
- Export schema and inferred TypeScript types
- Use Spanish error messages

## Database

- Prisma singleton in `lib/prisma.ts`
- CUID for primary keys
- Decimal type for prices
- Run `npx prisma generate` after schema changes

## Language

The application is in **Spanish**:
- All UI text in Spanish
- Error messages in Spanish
- `<html lang="es">`

## Key Files Reference

| Purpose | File |
|---------|------|
| Prisma Client | `lib/prisma.ts` |
| Class Merge Utility | `lib/utils.ts` |
| Product Actions | `lib/actions/products.ts` |
| Product Validation | `lib/validations/product.ts` |
| Global Styles | `app/globals.css` |
| Root Layout | `app/layout.tsx` |
| shadcn/ui Config | `components.json` |
