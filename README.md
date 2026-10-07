# Simatrix Academy

Full-stack website for a software training institute — public marketing site + a separate, authenticated admin panel.

- **Frontend:** React 19 + Vite + Tailwind CSS v4 (navy + gold theme, animations, code-split routes)
- **Backend:** Laravel 12 (PHP) + SQLite / MySQL, JWT authentication, rate limiting

## Features

- Dynamic course catalog (CRUD), categories, branches, blog, gallery, awards, testimonials
- Public enquiry + review submission (rate-limited)
- Admin: dashboard analytics (charts), enquiry notifications, CSV export, editable site settings
- SEO: per-page meta/OG, JSON-LD, `sitemap.xml`, `robots.txt`

---

## Local Development Setup

### 1. Backend (Laravel / PHP)
```powershell
cd backend
composer install
Copy-Item .env.example .env     # or create .env with DB_CONNECTION=sqlite
php artisan key:generate
php artisan serve --port=5000   # dev API server on http://localhost:5000
```

> **Note on Database:** By default, `.env` can use SQLite (`DB_CONNECTION=sqlite` and `DB_DATABASE=database/database.sqlite`), which comes pre-seeded with all courses and categories out of the box.

#### Admin Account Commands
- **List admin accounts:**
  ```powershell
  php artisan admin:list
  ```
- **Create or update admin account:**
  ```powershell
  php artisan admin:create admin@simatrixacademy.com --name="Super Admin"
  ```
- **Delete an admin account:**
  ```powershell
  php artisan admin:delete admin@simatrixacademy.com
  ```

---

### 2. Frontend (React / Vite)
```powershell
cd frontend
npm install
Copy-Item .env.example .env     # sets VITE_API_URL=http://localhost:5000
npm run dev                     # dev web app on http://localhost:5173
```

- **Production build:**
  ```powershell
  npm run build                 # outputs to frontend/dist/
  ```

---

## Deployment (Hostinger)

Deployment to production is automated via GitHub Actions (`.github/workflows/deploy.yml`):
- Pushes to the `main` branch build the frontend with `VITE_API_URL=https://webapi.simatrixacademy.com` and upload assets to Hostinger `public_html`.
- The backend is deployed to Hostinger under `public_html/webapi`.
