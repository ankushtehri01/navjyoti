# Deployment

Two supported paths: **Docker Compose** (single host, everything together) and
**split hosting** (managed frontend + backend + MongoDB).

---

## Option A — Docker Compose (recommended for a single VM)

Brings up MongoDB, the API, and the Nginx-served web app on one network. Nginx
serves the SPA and reverse-proxies `/api/v1` to the backend, so the browser only
ever talks to one origin (no CORS).

### 1. Configure secrets
```bash
cp .env.example .env
# edit .env — set JWT_* and COOKIE_SECRET (openssl rand -hex 32),
# and Cloudinary/SMTP if you want real uploads/emails.
```

### 2. Build & run
```bash
docker compose up -d --build
```
- Web: http://localhost (or `WEB_PORT`)
- API (via proxy): http://localhost/api/v1/health

### 3. Seed the admin + loan categories
```bash
docker compose exec backend npm run seed
```
Default admin: `admin@navjyoti.com` / `Admin@12345` (override in `.env`).

### Notes
- The compose file runs the API over plain HTTP internally, so it sets
  `COOKIE_SECURE=false` / `COOKIE_SAMESITE=lax`. **Behind real HTTPS, set
  `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none`** (put a TLS-terminating proxy
  such as Caddy/Traefik/an LB in front of the `frontend` service).
- The backend port is **not published** to the host — it's only reachable through
  the Nginx proxy. Publish it in `docker-compose.yml` if you need direct access.

---

## Option B — Split hosting (managed services)

| Piece | Suggested host | Notes |
|-------|----------------|-------|
| MongoDB | MongoDB Atlas | Copy the SRV connection string → `MONGO_URI`. |
| Backend | Render / Railway / Fly.io | Root: `backend/`. Build: `npm ci`. Start: `npm start`. |
| Frontend | Vercel / Netlify | Root: `frontend/`. Build: `npm run build`. Output: `dist`. |

### Backend service env
Set every key from `backend/.env.example`. Critically:
- `NODE_ENV=production`
- `MONGO_URI` = Atlas string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_RESET_SECRET`, `COOKIE_SECRET`
- `CLIENT_URL` = your frontend origin (e.g. `https://navjyoti.vercel.app`) — used
  for **CORS** and password-reset links.
- `CLOUDINARY_*` and `SMTP_*` for real uploads/emails.

Because the frontend and backend are on **different origins** here, cookies must be
cross-site: keep the production defaults `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none`
(both origins must be HTTPS).

### Frontend build env
- `VITE_API_URL=https://<your-backend-host>/api/v1`

After first deploy, run the seed once against the backend (`npm run seed` with the
production `MONGO_URI`), or trigger it from the host shell.

---

## Production checklist

- [ ] Strong, unique `JWT_*` + `COOKIE_SECRET` (32+ random bytes each).
- [ ] HTTPS everywhere; `COOKIE_SECURE=true`.
- [ ] `CLIENT_URL` matches the real frontend origin (CORS is locked to it).
- [ ] `MONGO_URI` points at a secured, backed-up database.
- [ ] Cloudinary + SMTP configured (otherwise uploads stub and emails log only).
- [ ] `npm run seed` executed once.
- [ ] `npm test` green in both apps in CI before deploy.

## Local production smoke (without Docker)
```bash
# backend
cd backend && NODE_ENV=production MONGO_URI=... npm start
# frontend
cd frontend && npm run build && npm run preview
```
