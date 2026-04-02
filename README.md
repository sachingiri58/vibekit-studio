# VibeKit Studio ✦

> Generate a theme, build a mini-site, publish it.

A full-stack web app for the Purple Merit Technologies Full Stack Vibe Coder Intern Assessment.

---

## Live Demo

**Deployed URL:** `https://YOUR-SITE.netlify.app` _(replace after deployment)_

**Test credentials:**
- Email: `test@vibekit.app`
- Password: `vibekit123`

Or sign up for a new account — no credit card needed.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + React Router v6 + Vite |
| Backend | Netlify Functions (serverless, Node.js) |
| Database | MongoDB Atlas |
| Auth | JWT (httpOnly cookie + localStorage fallback) + bcrypt |
| Deploy | Netlify |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/vibekit-studio.git
cd vibekit-studio
```

### 2. Install dependencies

```bash
# Frontend deps
npm install

# Backend (Netlify Functions) deps
cd netlify/functions && npm install && cd ../..
```

### 3. Set environment variables

Create a `.env` file in the root (never commit this):

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=vibekit
JWT_SECRET=your_super_secret_key_here_min_32_chars
```

### 4. Run locally with Netlify CLI

```bash
# Install Netlify CLI globally (one-time)
npm install -g netlify-cli

# Run dev server + functions together
netlify dev
```

The app runs at `http://localhost:8888`.

---

## Netlify Deployment

### Step 1 — Push to GitHub

```bash
git add . && git commit -m "Initial commit" && git push
```

### Step 2 — Create Netlify site

1. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import from Git"
2. Select your GitHub repo
3. Build settings are auto-detected from `netlify.toml`

### Step 3 — Set environment variables in Netlify

Go to **Site settings → Environment variables** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `DB_NAME` | `vibekit` |
| `JWT_SECRET` | A random 32+ char string |

### Step 4 — Deploy!

Click **Deploy site**. All done. ✓

---

## Environment Variables Required

```
MONGODB_URI      - MongoDB Atlas connection string
DB_NAME          - Database name (default: vibekit)
JWT_SECRET       - Secret key for JWT signing (min 32 chars)
```

---

## API Routes (Netlify Functions)

All API calls go through `/.netlify/functions/` (mapped from `/api/` via `netlify.toml`).

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth-signup` | Create account |
| POST | `/api/auth-login` | Sign in |
| POST | `/api/auth-logout` | Clear session cookie |

### Pages (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pages` | List user's pages |
| POST | `/api/pages` | Create page |
| GET | `/api/page-by-id/:id` | Get single page |
| PUT | `/api/page-by-id/:id` | Update page |
| POST | `/api/page-by-id/:id/publish` | Publish |
| POST | `/api/page-by-id/:id/unpublish` | Unpublish |
| POST | `/api/page-by-id/:id/duplicate` | Duplicate |

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public-page/:slug` | Fetch published page |
| POST | `/api/public-page/:slug/view` | Increment view count |
| POST | `/api/public-page/:slug/contact` | Submit contact form |

---

## Auth Strategy

- Passwords hashed with **bcrypt** (12 rounds)
- JWTs signed with `JWT_SECRET`, 7-day expiry
- Token stored in **httpOnly cookie** (secure in production) to prevent XSS
- Fallback to `Authorization: Bearer` header for environments where cookies may not work
- User info cached in `localStorage` (non-sensitive — no password, no token) for fast UI restore
- All pages CRUD enforces server-side ownership checks (userId match)

---

## Database Schema (MongoDB)

### `users`
```js
{ name, email, password (hashed), createdAt }
```

### `pages`
```js
{ userId, title, slug, theme, status, viewCount, sections: [...], createdAt, updatedAt }
```

### `contactSubmissions`
```js
{ pageId, pageSlug, pageOwnerId, name, email, message, submittedAt }
```

---

## Tradeoffs + What I'd Improve Next

1. **Real-time collaboration** — Currently no WebSocket support; adding Ably or Supabase Realtime would allow multi-user live editing.

2. **Image uploads** — Currently only image URLs. Adding Cloudinary or S3 upload would make the gallery much more usable.

3. **Custom domains** — Users can't map their own domain to `/p/:slug` yet. A CNAME + Netlify domain proxy would unlock this.

4. **More section types** — Testimonials, pricing tables, and FAQ sections would make pages more complete without much extra complexity.

5. **PostgreSQL migration** — MongoDB was chosen for speed; PostgreSQL with Supabase would give stricter schema guarantees, better relational queries (e.g. join pages + views + submissions), and row-level security.

---

## Design System — Pastel Soft

All 6 themes are implemented as CSS variable sets (`--t-*` tokens) defined in `src/lib/themes.js`. The published page and the editor preview share exactly the same `PagePreview` component — ensuring pixel-perfect consistency between preview and publish.

**Design extras implemented:**
- ✅ Micro-interactions (hover/focus/pressed states on all buttons, cards, inputs)
- ✅ Subtle animations (section reveal, skeleton loaders, spinner)
- ✅ Skeleton loaders (dashboard page list while loading)

---

Made with 🧡 for Purple Merit Technologies Assessment · April 2026
"# vibekit-studio" 
