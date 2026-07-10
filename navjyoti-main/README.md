# Nav Jyoti — Finance & Banking Platform

A production-grade financial services web application (loans, credit cards, insurance,
investments, EMI/eligibility tools) built with the MERN stack.

> **Theme:** Modern · Minimal · Premium · Dark + Blue Gradient · Glassmorphism

---

## Tech Stack

**Frontend:** React 19 · Vite · React Router · Redux Toolkit · TanStack Query · Axios ·
Tailwind CSS · Framer Motion · React Hook Form · React Icons

**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT · bcrypt · Multer ·
Cloudinary · Nodemailer · Helmet · CORS · Compression · Morgan · Rate Limiter · dotenv

**Package manager:** npm

---

## Monorepo Layout

```
navjyoti/
├── backend/                 # Express REST API (MVC + service layer)
│   ├── src/
│   │   ├── config/          # env, db, cloudinary, mailer configs
│   │   ├── constants/       # roles, statuses, messages, enums
│   │   ├── controllers/     # request handlers (thin)
│   │   ├── loaders/         # app bootstrap (express, db, routes)
│   │   ├── middlewares/     # auth, error, rate-limit, upload, validate
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/v1/       # versioned REST routes
│   │   ├── services/        # business logic (reusable)
│   │   ├── utils/           # ApiResponse, ApiError, asyncHandler, logger
│   │   └── validators/      # express-validator schemas
│   ├── uploads/             # temp local uploads (pre-Cloudinary)
│   └── logs/                # morgan / winston output
│
└── frontend/                # React 19 SPA
    └── src/
        ├── assets/          # images, icons, fonts
        ├── components/      # ui/ common/ forms/ layout/ sections/ charts/ skeletons/
        ├── config/          # runtime config, axios instance base
        ├── constants/       # routes, roles, nav, api endpoints
        ├── context/         # React contexts (theme, ui)
        ├── hooks/           # reusable custom hooks
        ├── layouts/         # Public / Auth / Dashboard / Admin shells
        ├── pages/           # public/ auth/ loans/ dashboard/ admin/
        ├── redux/           # store, slices/, api/
        ├── routes/          # route config, ProtectedRoute, RoleRoute
        ├── services/        # API service wrappers
        ├── styles/          # global css, tailwind layers
        └── utils/           # formatters, validators, helpers
```

---

## API Contract

**Success**
```json
{ "success": true, "message": "", "data": {} }
```

**Error**
```json
{ "success": false, "message": "", "errors": [] }
```

---

## Build Order (module by module)

1. ✅ Folder structure
2. ✅ Install dependencies
3. ✅ Backend configuration (env, server, db, middleware pipeline)
4. ✅ Frontend configuration (Vite, Tailwind, router, store, query client)
5. ✅ Authentication (JWT + refresh, roles, protected routes)
6. ✅ Database models
7. ✅ Reusable UI system
8. ✅ Landing page
9. ✅ Customer dashboard
10. ✅ Admin dashboard
11. ✅ APIs
12. ✅ Testing (Vitest + Supertest; see [TESTING.md](TESTING.md))
13. ✅ Deployment (Docker + Nginx; see [DEPLOYMENT.md](DEPLOYMENT.md))

---

## Roles

`admin` · `employee` · `customer`
