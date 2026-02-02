---
agent: agent
---

# 🚀 Lumina Agency - Project Guidelines

## 📋 Project Overview
This is a **Next.js 14** agency website with an admin dashboard, built with:
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Auth**: NextAuth.js with Credentials Provider
- **Validation**: Zod v4

---

## ⚠️ CRITICAL RULES - MUST FOLLOW

### 🔴 Before ANY Change:
1. **Read the relevant file(s) completely** before making changes
2. **Understand the existing code structure** and patterns used
3. **Check for dependencies** - what other files might be affected?
4. **Never assume** - always verify by reading the code first

### 🔴 After ANY Change:
1. **Check for TypeScript errors**: `npm run build` or check VS Code errors
2. **Verify the page loads** without runtime errors
3. **Test the specific feature** you modified
4. **Check the browser console** for any errors

### 🔴 Code Quality Rules:
1. **Keep existing patterns** - don't introduce new patterns without reason
2. **Preserve RTL support** - this site supports Arabic (RTL) and English (LTR)
3. **Maintain responsive design** - all components must work on mobile
4. **Use existing utilities** - check `src/lib/utils.ts` before creating new ones
5. **Follow the validation schema** - always validate with Zod before database operations

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Backend)
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── contact/       # Contact form API
│   │   ├── portfolio/     # Projects API
│   │   ├── services/      # Services API
│   │   ├── team/          # Team members API
│   │   ├── testimonials/  # Testimonials API
│   │   └── stats/         # Site statistics API
│   ├── admin/             # Admin dashboard pages
│   └── (public pages)     # Public website pages
├── components/            # React components
├── hooks/                 # Custom React hooks (useApiData.ts)
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client singleton
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── context/              # React contexts (Language)
└── data/                 # Static data (translations)

prisma/
└── schema.prisma         # Database schema

scripts/
├── create-admin.js       # Create admin user
└── seed-data.js          # Seed sample data
```

---

## 🔌 API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | Authentication |
| `/api/contact` | GET, POST | Contact messages |
| `/api/contact/[id]` | GET, PATCH, DELETE | Single contact |
| `/api/portfolio` | GET, POST | Projects |
| `/api/portfolio/[slug]` | GET, PATCH, DELETE | Single project |
| `/api/services` | GET, POST | Services |
| `/api/services/[slug]` | GET, PATCH, DELETE | Single service |
| `/api/team` | GET, POST | Team members |
| `/api/team/[id]` | GET, PATCH, DELETE | Single member |
| `/api/testimonials` | GET, POST | Testimonials |
| `/api/testimonials/[id]` | GET, PATCH, DELETE | Single testimonial |
| `/api/stats` | GET, PATCH | Site statistics |

---

## 🎯 Component-Backend Connection

| Component | API Endpoint | Hook |
|-----------|--------------|------|
| `PortfolioSection.tsx` | `/api/portfolio` | `useProjects()` |
| `TestimonialsSection.tsx` | `/api/testimonials` | `useTestimonials()` |
| `AboutTeam.tsx` | `/api/team` | `useTeamMembers()` |
| `ServicesBento.tsx` | `/api/services` | `useServices()` |
| `StatsSection.tsx` | `/api/stats` | Direct fetch |
| `ContactForm.tsx` | `/api/contact` | Direct POST |

---

## ✅ Validation Checklist

Before marking any task complete, verify:

- [ ] **No TypeScript errors** in the modified files
- [ ] **No console errors** in the browser
- [ ] **Page loads correctly** without blank screen
- [ ] **API returns correct data** (check Network tab)
- [ ] **Both languages work** (Arabic RTL + English LTR)
- [ ] **Mobile responsive** (check at 375px width)
- [ ] **Admin panel works** if backend was modified
- [ ] **Form submissions work** if forms were modified

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot read properties of undefined"
**Solution**: Check if API data is properly loaded before rendering. Use optional chaining (`?.`) or fallback arrays (`|| []`).

### Issue: Zod validation fails
**Solution**: Zod v4 uses `result.error.issues` not `result.error.errors`. Always use `safeParse()`.

### Issue: Component shows loading forever
**Solution**: Check the API endpoint is returning `{ success: true, data: [...] }` format.

### Issue: RTL layout broken
**Solution**: Ensure `dir={isRtl ? 'rtl' : 'ltr'}` is set on container elements.

### Issue: Hydration mismatch
**Solution**: Use `useState` with `useEffect` for client-only values, or add `"use client"` directive.

---

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Build (check for errors)
npm run build

# Create admin user
node scripts/create-admin.js

# Seed sample data
node scripts/seed-data.js

# Prisma commands
npx prisma studio      # Visual database editor
npx prisma db push     # Sync schema to database
npx prisma generate    # Regenerate client
```

---

## 🔐 Admin Credentials

- **URL**: `/admin/login`
- **Email**: `admin@lumina.agency`
- **Password**: `admin123456`

---

## 📝 When Adding New Features

1. **Database**: Add model to `prisma/schema.prisma`, run `npx prisma db push`
2. **Validation**: Add Zod schema to `src/lib/validations.ts`
3. **API**: Create route in `src/app/api/[feature]/route.ts`
4. **Hook**: Add fetch hook to `src/hooks/useApiData.ts`
5. **Component**: Update component to use the hook with fallback data
6. **Admin**: Create admin page in `src/app/admin/[feature]/page.tsx`
7. **Test**: Verify all checklist items above