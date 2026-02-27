# SEWA Goatique

> **Handmade goat‑milk skincare e‑commerce with a built‑in CMS & admin dashboard.**

*Developed by Prateek Kumar*


This repository powers the SEWA Goatique storefront and backend: a full‑stack
React + Vite frontend coupled with an Express/SQLite API. The application is
crafted for a social‑enterprise selling artisanal goat milk soaps and skincare
while empowering rural women artisans.

---

## 🚀 Features

- **Public storefront** with:
  - Home, Shop, Product Detail, Cart, Checkout, Contact, Bulk Order, Track
    Order and Blog pages
  - Filterable / sortable product catalogue
  - Persistent client‑side cart (localStorage)
  - Newsletter signup, contact/bulk enquiry forms
  - Markdown‑powered blog with excerpts and images
- **Admin panel** protected by JWT login:
  - Manage products, orders, user messages, blog posts and site content
  - Upload images (multer) & adjust branding (logo, favicon, hero image)
  - View dashboard statistics, change order statuses
- **Backend API** (Express) handling:
  - CRUD for products, orders, messages, content and posts
  - File uploads (`/api/upload`)
  - Email notifications via Nodemailer (order confirmations, enquiries)
  - SQLite database (`better-sqlite3`) with initial seed data
- **Full TypeScript support** on both client and server.

---

## 🧱 Tech Stack

| Layer            | Technology                    |
|------------------|-------------------------------|
| Frontend         | React 18, Vite, TypeScript    |
| Styling          | Tailwind CSS + lucide-react  |
| Backend          | Node.js, Express, TypeScript  |
| Database         | SQLite (better-sqlite3)       |
| File handling    | multer                        |
| Authentication   | JWT (jsonwebtoken)            |
| Email            | nodemailer                    |
| Utilities        | clsx, motion, react-markdown, etc.

---

## 📁 Project Structure

```
/                root of repo
│  package.json   # scripts & dependencies
│  server.ts      # Express entrypoint with Vite middleware
│  sewa.db        # SQLite database (created at runtime)
│  uploads/       # files uploaded via admin panel
│
└── src/
    ├── components/      # reusable React UI pieces
    ├── context/         # CartContext & types
    ├── pages/           # each route's screen
    ├── lib/             # application utilities
    └── main.tsx & App.tsx  # react-router setup
```

---

## 🛠️ Setup & Development

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (npm included)
- Git (optional, for cloning)

### Install dependencies

```bash
npm install
```

### Environment variables

Copy `env.example` (if available) or create a `.env` file at the project root with
these values:

```env
JWT_SECRET=your_jwt_secret        # used by server for admin tokens
ADMIN_PASSWORD=admin123            # initial admin password (hashed on start)
SMTP_HOST=smtp.example.com         # email transport
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
SMTP_FROM="SEWA Goatique <noreply@sewagoatique.com>"
```

Setting `ADMIN_PASSWORD` is recommended in development so you can log into the
admin dashboard. You may also override the seeded products/content by editing
`server.ts`.

### Running locally

```
npm run dev        # transpiles & starts server with Vite middleware
```

- Frontend available at `http://localhost:3000`.
- API endpoints under `/api`.

For a production build:

```
npm run build      # compile TS, build client bundle
npm start          # run built server
```

### Resetting the database

The SQLite file `sewa.db` lives in the project root. Delete it and restart the
server to recreate the schema and reseed the default data.

---

## 📦 API Overview

Most endpoints are prefixed with `/api`.

### Public

- `GET /api/products` – list all products
- `GET /api/products/:slug` – product detail
- `POST /api/orders` – create order (sends confirmation email)
- `POST /api/messages` – save contact/bulk/newsletter message
- `GET /api/content/:key` – retrieve dynamic page content
- `GET /api/posts` – list blog posts
- `GET /api/posts/:slug` – fetch single post

### Protected (requires JWT in `Authorization: Bearer …`)

- `POST /api/admin/login` – obtain token using username/password
- `POST /api/upload` – file upload
- CRUD routes for products, orders, messages, content, posts
- `PUT /api/orders/:id/status` – update order status

Refer to `server.ts` for full implementation and payload shapes.

---

## 🧾 Frontend Highlights

- Routing handled by `react-router-dom`.
- Global cart stored via `CartContext` and persisted to
  `localStorage`.
- Pages render data by calling API endpoints; forms POST back to `/api`.
- Admin UI is a single‑page dashboard (`/admin/*` routes) that consumes the
  same API.
- Tailwind configuration lives in `tailwind.config.ts` (not shown, default
  setup).

---

## 🔐 Admin Panel

1. Start the server.
2. Visit `http://localhost:3000/admin/login`.
3. Use credentials `admin` / value-of-`ADMIN_PASSWORD` (defaults to `admin123`).

The dashboard lets you:

- View orders & change status
- Add/edit/delete products and blog posts
- Read contact/bulk/newsletter messages
- Customize homepage headline/subheadline/CTA
- Upload branding assets (logo, favicon, hero image)

Token is stored in `localStorage` and included automatically in requests by
client code.

---

## 📦 Deployment

- Build client with `npm run build`.
- Ensure environment variables are set in the production environment.
- Run `npm start`; server listens on port `3000` by default.
- Serve the `dist` directory or adapt to your hosting provider (e.g. Heroku,
  DigitalOcean, etc.).

> ⚠️ Change `JWT_SECRET` and `ADMIN_PASSWORD` before deploying!

---

## 🤝 Contributing

This project is primarily for demonstration / internal use. To extend it:

1. Fork and clone the repository.
2. Create a feature branch (`git checkout -b feature/thing`).
3. Add tests or manual instructions if you modify functionality.
4. Submit a pull request describing your changes.

Please maintain code quality by running `npm run lint` and respecting TypeScript
checks.
