# SEWA Goatique

> **Handmade goat‑milk skincare e‑commerce with a built‑in CMS & admin dashboard.**

*Developed by Prateek Kumar*

This repository powers the SEWA Goatique storefront and backend: a full‑stack React + Vite frontend coupled with an Express/SQLite API. The application is crafted for a social‑enterprise selling artisanal goat milk soaps and skincare while empowering rural women artisans.

---

## 🚀 Features (updated)

- **Public storefront**
  - Home, Shop, Product Detail, Cart, Checkout, Contact, Bulk Order, Track Order and Blog pages
  - Filterable / sortable catalogue with “Featured” sorting option
  - Products support multiple images, category tags, ingredients, benefits, stock count and featured flag
  - Schema‑org JSON‑LD and meta tags for SEO
  - Persistent cart stored in `localStorage`
  - Newsletter signup, contact/bulk inquiry forms with confirmation emails
  - Markdown‑powered blog; posts can be drafted or published via admin
- **Admin dashboard** (JWT auth)
  - Full CRUD for products (including stock levels), orders, messages, blog posts and dynamic content
  - Upload images via `/api/upload` (multer)
  - Customize branding: logo, favicon, hero image and logo heights for desktop/mobile
  - Dashboard statistics, change order statuses, view messages
  - Optional utilities such as logo generation script
- **Backend API**
  - Express + SQLite with WAL journaling
  - Automatic seeding and a users table for admin credentials
  - Endpoints for managing products, orders (with `payment_method` field), messages, site content (`homepage_hero`, `site_branding`), and blog posts (`published` flag)
  - Emails sent via Nodemailer on order creation and contact/bulk messages
  - Uploads served from `/uploads`; `BASE_URL` config influences URLs
  - Logging of uncaught exceptions/rejections to `server.log`
- **Full TypeScript support** on both sides; linting via `tsc --noEmit`.

---

## 🧱 Tech Stack

| Layer            | Technology                    |
|------------------|-------------------------------|
| Frontend         | React 18, Vite, TypeScript    |
| Styling          | Tailwind CSS + lucide-react   |
| Backend          | Node.js, Express, TypeScript  |
| Database         | SQLite (better-sqlite3)       |
| File handling    | multer                        |
| Authentication   | JWT (jsonwebtoken)            |
| Email            | nodemailer                    |
| Utilities        | clsx, motion, react-markdown, etc. |

---

## 📁 Project Structure

```
/                root of repo
│  CHECKLIST.md          # feature tracker
│  README.md             # this file
│
├─ client/               # React/Vite frontend
│   ├─ package.json
│   ├─ tsconfig.json
│   ├─ vite.config.ts
│   ├─ public/            # static assets (logo.png if generated)
│   ├─ generate_logo.ts   # optional GenAI script to create a logo
│   └─ src/
│       ├─ components/    # reusable UI pieces
│       ├─ context/       # CartContext & types
│       ├─ pages/         # route screens
│       ├─ lib/           # api and auth helpers
│       └─ main.tsx & App.tsx
│
└─ server/               # Express API
    ├─ package.json
    ├─ server.ts         # entrypoint, Vite middleware, routes
    ├─ uploads/          # stored by multer
    └─ sewa.db (generated)
```

---

## 🛠️ Setup & Development

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (npm included)
- Git (optional, for cloning)

### Install dependencies

Dependencies are managed separately for server and client.

```bash
# server
cd server && npm install
# client
cd client && npm install
```

### Environment variables

Create a `.env` at the project root with the following values (server):

```env
JWT_SECRET=your_jwt_secret        # admin token signing
ADMIN_PASSWORD=admin123            # initial admin password (hashed on start)
SMTP_HOST=smtp.example.com         # email transport
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
SMTP_FROM="SEWA Goatique <noreply@sewagoatique.com>"
BASE_URL=https://your-production-domain.com  # used to build upload URLs
```

Client variables live in `client/.env` or are prefixed with `VITE_`

```env
VITE_API_URL=http://localhost:3000  # API base when developing
GEMINI_API_KEY=...                  # optional, for logo generation script
```

> **Note:** never commit `.env` files; change secrets before deployment.

### Running locally

Start both projects in separate shells:

```bash
# API server
cd server
npm run dev

# frontend
cd ../client
npm run dev
```

- Frontend: http://localhost:3000  
- API: proxied under `/api` or directly at  http://localhost:3000/api

For a production build:

```bash
cd client && npm run build    # outputs to client/dist
cd ../server && npm start     # serves build and API
```

### Generating a logo (optional)

Run `client/generate_logo.ts` using tsx or node once you set `GEMINI_API_KEY`:

```bash
cd client
node generate_logo.ts  # or npx tsx generate_logo.ts
```

Result is saved to `client/public/logo.png`.

### Resetting the database

Remove `server/sewa.db` and restart the server; the schema is recreated
and sample data (admin user, example products/content) is seeded.

---

## 📦 API Overview

Base URL defaults to `http://localhost:3000/api`.

### Public endpoints

- `GET /products` – list all products (images parsed as arrays)
- `GET /products/:slug` – retrieve product by slug
- `POST /orders` – place an order; expects customer details, items array,
  `payment_method`; confirmation email is sent
- `POST /messages` – save contact/bulk/newsletter message and email
- `GET /content/:key` – dynamic page content (e.g. `homepage_hero`)
- `GET /posts` – list blog posts
- `GET /posts/:slug` – fetch a single post

### Protected (requires JWT in `Authorization: Bearer …` header)

- `POST /admin/login` – obtain token using username/password (`admin`)
- `POST /upload` – upload image (field name `image`)
- CRUD routes for `/products`, `/orders`, `/messages`, `/content/:key`,
  `/posts`
- `PUT /orders/:id/status` – change order status

Refer to `server/server.ts` for payload shapes and additional details.

---

## 🧾 Frontend Highlights

- React routing with `react-router-dom`; admin area under `/admin`.
- `CartContext` maintains global cart state with localStorage persistence.
- Shop page supports sorting by price or featured flag; product cards show
  stock availability.
- Product detail includes ingredients/benefits, schema‑org metadata,
  and zoomable images.
- SEO component injects meta tags and JSON‑LD.
- Admin UI for managing all content; supports file uploads and branding
  settings.
- Tailwind CSS with responsive, accessible UI.  

---

## 🔐 Admin Panel

1. Start server & frontend.
2. Open `http://localhost:3000/admin/login`.
3. Login with `admin` / `ADMIN_PASSWORD` (default `admin123`).

Features:

- Orders: list, view details, update status
- Products: create/edit/delete; stock and category management
- Messages: view contact/bulk/newsletter submissions
- Blog: manage posts, set published state
- Content: edit homepage hero, site branding (logo, favicon, hero image)
- Branding: adjust logo height for desktop/mobile

Tokens are stored in `localStorage` and auto‑attached to requests. Logout
clears the token.

---

## 📦 Deployment

1. Build client (`cd client && npm run build`).
2. Export environment variables in production.
3. Start server (`cd server && npm start`).
4. Ensure `uploads/` directory is writable and accessible.
5. Optionally front with Nginx/PM2/systemd.

> ⚠️ Change secrets (`JWT_SECRET`, `ADMIN_PASSWORD`) before public
> deployment. Consider migrating uploads to cloud storage and enabling HTTPS.

---

## 🤝 Contributing

This project is a demonstration / learning platform. To contribute:

1. Fork the repo and clone locally.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Add tests or manual instructions for any functionality changes.
4. Run `npm run lint` (client) and ensure TypeScript compiles.
5. Submit a pull request with a clear description.

See `CHECKLIST.md` for planned enhancements and outstanding tasks.

