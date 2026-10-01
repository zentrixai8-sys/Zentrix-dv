# ⚡ Zentrixs Enterprise Task & Ticket API (Cloudflare Worker + Hono + D1)

This backend powers the **Multi-Company Ticket Management System** and **Admin Assignment Console** for Zentrixs. It runs on Cloudflare Workers with Hono and Cloudflare D1 (Serverless SQLite).

---

## 📁 Architecture Overview
- **Framework**: [Hono v4](https://hono.dev/)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Deployment**: Cloudflare Workers
- **Authentication**: Role-based (Super Admin & Company Client)

---

## 🚀 Setup & Deployment Instructions

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
# or run via npx
```

### Step 2: Login to Cloudflare
```bash
npx wrangler login
```

### Step 3: Create Cloudflare D1 Database
Run the following command to create your edge database:
```bash
npx wrangler d1 create zentrix-db
```
You will get an output with your `database_id`, for example:
```toml
[[d1_databases]]
binding = "DB"
database_name = "zentrix-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
Copy and paste your `database_id` into `cloudflare-backend/wrangler.toml`.

### Step 4: Execute SQL Schema (Create Tables & Seed Data)

**For Local Testing:**
```bash
npx wrangler d1 execute zentrix-db --local --file=./schema.sql
```

**For Production Cloudflare Edge:**
```bash
npx wrangler d1 execute zentrix-db --remote --file=./schema.sql
```

### Step 5: Test Locally
```bash
cd cloudflare-backend
npm install
npm run dev
```
The Hono API will be available at `http://localhost:8787`.

### Step 6: Deploy to Cloudflare Workers
```bash
npm run deploy
```
You will receive your production URL, e.g.:
`https://zentrix-portal-api.your-subdomain.workers.dev`

### Step 7: Connect Frontend to Cloudflare Worker
In your main project `.env` or `.env.production` file, add:
```env
VITE_CLOUDFLARE_API_URL=https://zentrix-portal-api.your-subdomain.workers.dev
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/company-login` | Company portal login |
| `POST` | `/api/auth/admin-login` | Super Admin console login |
| `GET` | `/api/tasks` | Get all tasks (supports `?companyId=`, `?status=`, `?assignedTo=`, `?search=`) |
| `POST` | `/api/tasks` | Raise new ticket / assign work |
| `PUT` | `/api/tasks/:id/assign` | Admin assigns ticket to Zentrixs developer/engineer |
| `PUT` | `/api/tasks/:id/status` | Update task status & resolution notes |
| `GET` | `/api/stats` | Analytics metrics for dashboard |
| `GET` | `/api/companies` | List registered client companies |
