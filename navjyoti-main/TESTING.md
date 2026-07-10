# Testing

Automated tests run on **Vitest** in both apps.

## Backend (`backend/`)

- **Runner:** Vitest (`environment: node`) + **Supertest** driving the real Express app.
- **Database:** `mongodb-memory-server` — a throwaway in-memory MongoDB per test file (no external DB needed).
- **Location:** `tests/` — `setup/` (env + DB lifecycle helpers), `auth.test.js`, `api.test.js`.

```bash
cd backend
npm test          # run once
npm run test:watch
```

**Coverage:** auth (register/login/refresh/me/forgot, validation, duplicates),
RBAC (403/401 on protected routes), the application → disbursal → Loan + notification
workflow, review moderation, document upload, employee provisioning, and analytics.

Rate limiters are automatically skipped when `NODE_ENV=test` so repeated auth calls
don't trip a 429.

## Frontend (`frontend/`)

- **Runner:** Vitest (`environment: jsdom`, globals) + **React Testing Library** + `@testing-library/user-event`.
- **Location:** co-located `*.test.js(x)` files next to the code they cover.

```bash
cd frontend
npm test          # run once
npm run test:watch
```

**Coverage:** pure utilities (EMI math, currency/number formatting, CSV export) and
reusable components (Button interaction/loading/disabled states, Badge variants).

## Conventions

- Tests are deterministic and isolated — the backend clears collections between tests;
  the frontend unmounts trees after each test.
- Prefer testing **behavior and contracts** (status codes, envelopes, rendered output,
  role rules) over implementation details.
- New endpoints/components should ship with a test in the matching suite.
