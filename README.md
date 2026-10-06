# Elysium Academy

Full-stack website for a software training institute — public marketing site + a separate, authenticated admin panel.

- **Frontend:** React 19 + Vite + Tailwind CSS v4 (navy + gold theme, animations, code-split routes)
- **Backend:** Flask + SQLAlchemy + MySQL, JWT auth, Flask-Limiter, Flask-Mail

## Features

- Dynamic course catalog (CRUD), categories, branches, blog, gallery, awards, testimonials
- Public enquiry + review submission (rate-limited)
- Admin: dashboard analytics (charts), enquiry notifications (live bell + email), CSV export, editable site settings
- SEO: per-page meta/OG, JSON-LD, `sitemap.xml`, `robots.txt`
- Tech-logo detection for courses

---

## Local development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows  (source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
cp .env.example .env             # then edit values (DB URL, secrets, SMTP)
python -m src.seed               # create tables + seed catalog + default admin
python app.py                    # dev server on http://localhost:5000
```

Create an admin account:
```bash
php artisan admin:create
# or specify inline: php artisan admin:create admin@simatrixacademy.com --name="Super Admin"
```
List admin accounts:
```bash
php artisan admin:list
```
Delete an admin account:
```bash
php artisan admin:delete admin@simatrixacademy.com
# or purge all: php artisan admin:delete --all
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env             # set VITE_API_URL=http://localhost:5000
npm run dev                      # http://localhost:5173
npm run build                    # production build -> dist/
```

---

## Environment variables (backend `.env`)

| Var | Purpose |
|-----|---------|
| `SECRET_KEY`, `JWT_SECRET_KEY` | Flask + JWT signing secrets (generate strong values) |
| `JWT_EXPIRES_HOURS` / `JWT_REFRESH_DAYS` | Token lifetimes |
| `DATABASE_URL` | SQLAlchemy DB URL (`mysql+pymysql://user:pass@host/db`) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins (or `*`) |
| `RATELIMIT_ENABLED` / `RATELIMIT_STORAGE_URI` | Rate limiting (use Redis in prod, e.g. `redis://...`) |
| `MAIL_*`, `ADMIN_ALERT_EMAIL` | SMTP for enquiry/review emails (blank = disabled) |
| `SITE_URL` | Public site URL used in email links |

Generate a secret: `python -c "import secrets; print(secrets.token_urlsafe(48))"`

---

## Deployment

**Frontend** → any static host (Vercel / Netlify / Cloudflare Pages):
- Build command `npm run build`, output `dist/`
- Set `VITE_API_URL` to the deployed backend URL
- Update the domain in `public/robots.txt` and `public/sitemap.xml`

**Backend** → any container/Python host (Render / Railway / Fly.io):
- Uses `gunicorn` (see `Procfile` / `Dockerfile`)
- Set all `.env` vars; point `DATABASE_URL` at a managed MySQL
- Set `CORS_ORIGINS` to the frontend domain, `SESSION_COOKIE_SECURE=true`, `FLASK_DEBUG=false`
- Run `python -m src.seed` once after first deploy

```bash
# Build & run the backend container locally
cd backend
docker build -t elysium-api .
docker run -p 5000:5000 --env-file .env elysium-api
```

> For production, switch `RATELIMIT_STORAGE_URI` to Redis (in-memory limits don't share across workers) and use Flask-Migrate (`flask db upgrade`) instead of `create_all()`.
