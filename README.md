# TaskFlow - Modern Full-Stack Task Management Application

A production-ready, full-stack Task Management System built with **React**, **TypeScript**, **Tailwind CSS v4**, **Node.js Express REST API**, and **Supabase PostgreSQL**, pre-configured for seamless single-click deployment on **Vercel**.

🌐 **Live Production App**: [https://task-management-app-kappa-pied.vercel.app](https://task-management-app-kappa-pied.vercel.app)

---

## 📋 Features

- ⚡ **Full-Stack CRUD Architecture**: Create, read, update, and delete tasks dynamically.
- 🎯 **Advanced Task Attributes**: Prioritization (`low`, `medium`, `high`), custom & dynamic categories, due dates, and completion status.
- 🔍 **Filtering & Search**: Real-time keyword search with combined status, priority, and category filters.
- 🚀 **Serverless Ready (Vercel)**: Unified monorepo build running the Vite React frontend and Express REST API as Vercel Serverless Functions.
- 🔒 **Production Security Hardening**: Integrated Helmet HTTP security headers, strict dynamic CORS validation, API rate limiting, input validation/sanitization, and stack-trace masking in production.
- 📊 **Health & Connection Diagnostics**: Real-time database health check endpoint and status indicators.

---

## 📁 Project Structure

```text
Task Management App/
├── api/                      # Vercel Serverless Function entrypoint
│   └── index.js              # Exports Express app for Vercel Serverless execution
├── backend/                  # Node.js + Express REST API Server
│   ├── config/               # Supabase database client setup
│   ├── controllers/          # Endpoint request handlers & input validation
│   ├── services/             # Core business logic & database queries
│   ├── routes/               # Route declarations (/api/health, /api/tasks)
│   ├── middleware/           # Centralized error handler & security rules
│   ├── index.js              # Express app setup & security middleware
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
├── .gitignore                # Consolidated workspace gitignore
├── package.json              # Monorepo workspace manager & root dependencies
├── supabase_setup.sql        # Database migration script for Supabase SQL Editor
└── vercel.json               # Vercel deployment, output directory, and routing configuration
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

## ⚙️ Local Setup Instructions

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
Create a file named `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

#### Frontend Environment (`frontend/.env`)
Create a file named `.env` inside `frontend/`:

```env
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:5000
```

---

### Step 3: Install Dependencies

From the project root directory:

```bash
npm install
```

---

### Step 4: Run Development Server

Start both the Express API server and Vite React frontend concurrently:

```bash
npm run dev
```

- 🌐 **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- 📡 **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Deployment (Vercel)

This repository is configured to deploy both the **React Frontend** and **Express REST API** together on Vercel using `vercel.json` and Vercel Serverless Functions.

### 1. Environment Variables in Vercel
Go to **Vercel Dashboard → Project Settings → Environment Variables** and add:

| Key | Value | Environment |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview |
| `SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Production, Preview |
| `CORS_ORIGIN` | `https://task-management-app-kappa-pied.vercel.app` | Production, Preview |

### 2. Deploy Command
Deploy directly from your terminal using Vercel CLI:

```bash
vercel --prod
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
- **Dynamic CORS Policy**: Automatically permits Vercel production/preview domains and configures `CORS_ORIGIN`.
- **Rate Limiting**: Protects `/api` endpoints (300 requests per 15-minute window per IP).
- **Sanitized Error Responses**: Suppresses database stack traces and internal schema logs in production mode while keeping clean JSON error outputs.
- **Payload Validation**: Validates string bounds and field enumerations before database processing.

## Live Demo

👉 https://task-management-app-kappa-pied.vercel.app/

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
