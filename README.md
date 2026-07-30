# TaskFlow - Modern Full-Stack Task Management Application

A production-ready, full-stack Task Management System built with **React**, **TypeScript**, **Tailwind CSS v4**, **Node.js Express REST API**, and **Supabase PostgreSQL**.

---

## 📋 Features

- ⚡ **Full-Stack CRUD Architecture**: Create, read, update, and delete tasks dynamically.
- 🎯 **Advanced Task Attributes**: Prioritization (`low`, `medium`, `high`), custom & dynamic categories, due dates, and completion status.
- 🔍 **Filtering & Search**: Real-time keyword search with combined status, priority, and category filters.
- 🔒 **Production Security Hardening**: Integrated Helmet HTTP security headers, strict dynamic CORS validation, API rate limiting, input validation/sanitization, and stack-trace masking in production.
- 🌐 **Dynamic Base Configuration**: Configurable API endpoints and environment variable bindings for standalone or proxy deployments.
- 📊 **Health & Connection Diagnostics**: Real-time database health check endpoint and status indicators.

---

## 📁 Project Structure

```text
Task Management App/
├── backend/                  # Node.js + Express REST API Server
│   ├── config/               # Supabase database client setup
│   ├── controllers/          # Endpoint request handlers & input validation
│   ├── services/             # Core business logic & database queries
│   ├── routes/               # Route declarations (/api/health, /api/tasks)
│   ├── middleware/           # Centralized error handler & security rules
│   ├── index.js              # Express app entry point & security configuration
│   ├── .env.example          # Environment variable template for backend
│   └── package.json
├── frontend/                 # React + TypeScript + Tailwind CSS v4 Client
│   ├── src/
│   │   ├── components/       # UI Components (Navbar, Footer, TaskModal, TaskList, StatsBanner)
│   │   ├── hooks/            # Custom hooks (useTasks, useDatabaseStatus)
│   │   ├── services/         # API Service (dynamic fetch abstraction)
│   │   └── types/            # TypeScript data contracts & interfaces
│   ├── index.html            # Vite HTML template
│   ├── vite.config.ts        # Dynamic API proxy configuration
│   ├── .env.example          # Environment variable template for frontend
│   └── package.json
├── package.json              # Root workspace manager & concurrent runner
└── supabase_setup.sql        # Database migration script for Supabase SQL Editor
```

---

## 🗄️ Database Schema

The application uses **Supabase (PostgreSQL)** for data storage. Execute `supabase_setup.sql` in your Supabase SQL Editor to initialize the schema.

### Table: `public.tasks`

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique task identifier |
| `title` | `TEXT` | `NOT NULL` | Task title (max 200 chars) |
| `description` | `TEXT` | `DEFAULT ''` | Detailed task notes (max 2000 chars) |
| `completed` | `BOOLEAN` | `NOT NULL`, `DEFAULT FALSE` | Task completion status |
| `priority` | `TEXT` | `NOT NULL`, `DEFAULT 'medium'`, `CHECK (priority IN ('low', 'medium', 'high'))` | Priority classification |
| `category` | `TEXT` | `NOT NULL`, `DEFAULT 'Work'` | Categorization tag |
| `due_date` | `TIMESTAMPTZ` | `NULLABLE` | Target completion date & time |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of creation |

### SQL Migration Script (`supabase_setup.sql`)

```sql
-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT NOT NULL DEFAULT 'Work',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Create open RLS policies for anonymous access
CREATE POLICY "Allow public read access to tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to tasks" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to tasks" ON public.tasks FOR DELETE USING (true);

-- 4. Enable Realtime subscriptions (Optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Supabase Account**: Free project at [supabase.com](https://supabase.com)

---

### Step 1: Database Initialization
1. Log into your [Supabase Dashboard](https://app.supabase.com).
2. Open the **SQL Editor** tab.
3. Paste the contents of `supabase_setup.sql` into the editor and click **Run**.
4. Navigate to **Project Settings → API** and copy your **Project URL** and **Anon Key**.

---

### Step 2: Environment Configuration

#### Backend Environment (`backend/.env`)
Create a file named `.env` inside the `backend/` directory (or copy from `backend/.env.example`):

```env
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Allowed CORS Origins (comma-separated for multiple origins, e.g. http://localhost:5173,https://yourdomain.com)
CORS_ORIGIN=http://localhost:5173

# Supabase PostgreSQL Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

#### Frontend Environment (`frontend/.env`)
Create a file named `.env` inside the `frontend/` directory (or copy from `frontend/.env.example`):

```env
# Client API Base URL (Relative '/api' for same-origin proxy, or absolute URL for separate hosting)
VITE_API_BASE_URL=/api

# Proxy Target for Vite Development Server
VITE_API_TARGET=http://localhost:5000
```

---

### Step 3: Install Dependencies

From the project root directory, run:

```bash
npm install
```

*This will automatically install dependencies for both `backend` and `frontend` workspaces.*

---

### Step 4: Run Development Server

Start both the Express API server and Vite React frontend concurrently:

```bash
npm run dev
```

- 🌐 **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- 📡 **Backend REST API**: [http://localhost:5000](http://localhost:5000)

#### Individual Execution
```bash
# Backend server only
npm run dev:backend

# Frontend client only
npm run dev:frontend
```

---

### Step 5: Production Build & Deployment

#### 1. Build Frontend Bundle
```bash
npm run build
```
The optimized production bundle will be generated in `frontend/dist/`.

#### 2. Start Backend Server in Production Mode
Set `NODE_ENV=production` in `backend/.env` and launch:
```bash
npm --prefix backend start
```

---

## 📡 REST API Documentation

### Base URL: `/api`

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server & DB health check | None | `{ status, database, message }` |
| `GET` | `/tasks` | Retrieve all tasks | None | `{ tasks: Task[], source: string }` |
| `POST` | `/tasks` | Create a new task | `{ title, description?, priority?, category?, due_date? }` | `{ task: Task, source: string }` |
| `PUT` | `/tasks/:id` | Update an existing task | `{ title?, description?, completed?, priority?, category?, due_date? }` | `{ task: Task, source: string }` |
| `DELETE` | `/tasks/:id` | Delete a task by ID | None | `{ success: true, id: string }` |

---

## 🔒 Security Features

- **Helmet HTTP Headers**: Enforces secure HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`).
- **Dynamic CORS Policy**: Restricts origin requests strictly based on configurable `CORS_ORIGIN` environment settings.
- **Rate Limiting**: Protects `/api/*` endpoints (300 requests per 15-minute window per IP).
- **Sanitized Error Responses**: Suppresses database stack traces and internal schema logs in production mode.
- **Payload Validation**: Validates string bounds and field enumerations before database processing.

## Live Demo

👉 https://task-management-app-kappa-pied.vercel.app/

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
