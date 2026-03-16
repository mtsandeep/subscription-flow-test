# Getting Started - Payment Flow

## Project Overview

**Eazy Gym** is a modern fitness center that wants to digitize their membership subscription process. This web application allows new members to sign up and purchase gym memberships online.

### User Flow

1. **Profile** - New members create their account with basic info (name, age, weight, height for fitness tracking)
2. **Plan Selection** - Choose between Basic (gym access) or Pro (with personal trainer) membership
3. **Coupon** - Apply promotional discount codes (optional)
4. **Summary** - Review and complete the subscription purchase

### Business Requirements

- Support promotional coupon codes with usage limits (e.g., "WELCOME10" for 10% off, limited to 100 uses)
- Prevent coupon abuse by tracking usage count
- Handle concurrent signups gracefully (race conditions on limited coupons)
- Persist user profile data so accidental refreshes won't lose their profile information and to simulate a login flow

### Simplified Authentication

> **Note**: To keep this project focused on the payment flow, authentication is simplified:
> - No passwords or login screens
> - If a username already exists in the database, treat it as a **returning user** and fetch their existing profile
> - This simulates a "remember me" / auto-login experience based on username alone

---

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Basic knowledge of React and Express

## Quick Start

```bash
# Option 1: Full setup (recommended for first time)
bun run setup

# Option 2: Manual setup
# 1. Setup environment files
bun run setup:env

# 2. Install dependencies
bun install

# 3. Seed the database (creates tables and initial data)
bun run --cwd server db:seed

# 4. Start both frontend and backend
bun run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Project Structure

```
payment-flow/
├── package.json           # Root workspace config
├── GETTING_STARTED.md     # This file
├── README.md              # Task requirements
│
├── server/                # Backend (Express + Bun + SQLite)
│   ├── package.json
│   ├── index.js           # Server entry point
│   ├── db.js              # Database connection + transaction helper
│   ├── .env.example       # Environment template
│   ├── .env               # Environment variables (created by setup)
│   ├── db/
│   │   ├── seed.js        # Database seeder
│   │   ├── reset.js       # Database reset utility
│   │   ├── seed.sql       # Schema and initial data
│   │   └── payment.db     # SQLite database (created after seed)
│   └── routes/
│       ├── users.js           # Ready (create + lookup)
│       ├── plans.js           # Ready (read-only)
│       ├── coupons.js         # TODO: Implement validateCoupon
│       └── subscriptions.js   # TODO: Implement subscribe
│
└── client/                # Frontend (React + Vite + Tailwind)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example       # Environment template
    ├── .env               # Environment variables (created by setup)
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   ├── axios.js       # Axios instance config
        │   ├── index.js       # API exports
        │   ├── users.js       # Users API calls
        │   ├── plans.js       # Plans API calls
        │   ├── coupons.js     # Coupons API calls
        │   └── subscriptions.js # Subscriptions API calls
        └── pages/
            ├── Profile.jsx    # Step 1: User info
            ├── Plan.jsx       # Step 2: Plan selection
            ├── Coupon.jsx     # Step 3: Coupon code
            └── Summary.jsx    # Step 4: Complete purchase
```

## Database Schema

### Users Table (empty initially)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| name | TEXT | Full name |
| age | INTEGER | Age (optional) |
| weight | REAL | Weight in kg (optional) |
| height | REAL | Height in cm (optional) |
| created_at | DATETIME | Creation timestamp |

### Plans Table (pre-seeded)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Plan name (Basic, Pro) |
| price | INTEGER | Price in **paise** (149900 = ₹1499.00) |
| created_at | DATETIME | Creation timestamp |

### Coupons Table (pre-seeded)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| code | TEXT | Coupon code (WELCOME10, SUPER50) |
| discount_percent | INTEGER | Discount percentage |
| max_uses | INTEGER | Maximum times this coupon can be used |
| current_uses | INTEGER | Times coupon has been used |
| created_at | DATETIME | Creation timestamp |

### Subscriptions Table (empty initially)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
TODO: Add columns for subscription details

## Pre-seeded Data

### Plans
- **Basic**: ₹1499.00/month
- **Pro**: ₹2999.00/month

### Coupons
- **WELCOME10**: 10% off (max 100 uses)
- **SUPER50**: 50% off (max 5 uses)

## Your Tasks

### Backend Tasks

1. **Implement `POST /api/coupons/validate`** in [server/routes/coupons.js](server/routes/coupons.js)
   - Validate coupon code
   - Check if coupon has remaining uses
   - Return discount details

2. **Implement `POST /api/subscriptions/subscribe`** in [server/routes/subscriptions.js](server/routes/subscriptions.js)
   - Create subscription record
   - Handle coupon usage (increment current_uses)
   - Use transactions for atomic operations (see `transaction()` helper in [server/db.js](server/db.js))

### Frontend Tasks

1. **Implement state management** to pass data between pages:
   - User data from Profile (after creating user via API)
   - Selected plan from Plan
   - Applied coupon from Coupon
   - After login (if username matches in db), refresh should persist the user data

2. **Handle page refresh** - ensure if user refreshes at any step, page redirects to /profile

3. **Call POST /api/users** on Profile page to create user

4. **Fetch plans from API** on Plan page

5. **Implement coupon validation** on Coupon page

6. **Implement subscription flow** on Summary page

### Data Persistence Requirement

> Details entered in profile page (only details on profile page to be persisted) should be persisted, so if we refresh at any step it should go back to /profile and show filled data.

You decide how to implement this:
- localStorage?
- sessionStorage?
- React Context?
- URL state?
- Something else?

## Development Commands

```bash
# Setup environment files from templates
bun run setup:env

# Full setup (env + install + seed)
bun run setup

# Run both frontend and backend
bun run dev

# Run only backend
bun run dev:server

# Run only frontend
bun run dev:client

# Re-seed database (resets all data)
bun run --cwd server db:seed

# Reset database (drops and recreates tables)
bun run --cwd server db:reset
```

## API Endpoints

### Users (Ready to use)
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | /api/users/:username | Ready | Get user by username |
| POST | /api/users | Ready | Create user |

### Plans (Ready to use, pre-seeded)
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | /api/plans | Ready | Get all plans |
| GET | /api/plans/:id | Ready | Get plan by ID |

### Coupons (TODO)
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | /api/coupons | TODO | Get all coupons |
| POST | /api/coupons/validate | TODO | Validate coupon code |

### Subscriptions (TODO)
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | /api/subscriptions/subscribe | TODO | Create subscription |

### Health
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | /api/health | Ready | Health check |

## Tips

1. **Use transactions** - See the `transaction()` helper in [server/db.js](server/db.js)
2. **Never trust the frontend** - Always validate data on the backend
3. **Handle race conditions** - Multiple users might try to use a limited coupon simultaneously
4. **Test edge cases**:
   - Invalid coupon code
   - Expired coupon (max uses reached)
   - Concurrent requests
