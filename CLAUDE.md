# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Book A Meal is an Express.js REST API for a meal ordering platform where caterers create meals/menus and customers place orders, with real-time notifications via an event system.

## Common Commands

```bash
# Development
yarn start:dev          # Run with nodemon (auto-restart)
yarn build              # Compile with Babel to dist/
yarn start              # Run compiled app from dist/

# Code quality
yarn lint               # ESLint with auto-fix (local)
yarn lint:ci            # ESLint without auto-fix (used in CI)

# Testing
yarn test               # Full test suite (pretest runs db:setup:test first)
yarn test:watch         # Watch mode

# Run a single test file
yarn test -- src/routes/__tests__/auth/signup.test.js

# Run tests matching a name pattern
yarn test -- --testNamePattern="should register a new user"

# Database
yarn db:setup           # Full reset: undo all → migrate → seed
yarn db:setup:test      # Prepare test database
yarn db:migrate         # Run pending migrations
yarn db:migrate:undo    # Rollback all migrations
yarn db:seed            # Run all seeders

# Docker (local dev)
yarn docker:up          # Run stack from current branch
yarn docker:main        # Run stack from main branch
yarn docker:prod:up     # Production deployment
yarn docker:prod:migrate # Run migrations in prod container
```

## Architecture

### Tech Stack
- **Framework:** Express.js 4.x with Babel (ES6+ source in `src/`, compiled to `dist/`)
- **Database:** PostgreSQL 14 + Sequelize ORM 6.x
- **Auth:** JWT (jsonwebtoken) + Passport.js + bcrypt
- **Testing:** Jest 26 + Supertest (co-located in `__tests__/` dirs)
- **Events:** Node.js EventEmitter for async order/notification processing

### Request Lifecycle

Every request passes through this middleware chain before reaching a controller:

```
Route → Validation Rules → ValidationHandler.validate
      → TrimValues.trim → ValidationHandler.isEmptyReq
      → asyncWrapper(Controller.method) → ErrorHandler
```

- `asyncWrapper` (`src/helpers/asyncWrapper.js`) wraps all route handlers to catch Promise rejections and forward to `ErrorHandler`
- `Authorization` middleware (`src/middlewares/Authorization.js`) validates and refreshes JWT tokens
- Error messages are centralized in `src/lib/errors.json`

### Event-Driven Architecture

Order creation triggers an async event pipeline decoupled from HTTP responses:
- `src/eventEmitters/` — emit events (OrderEventEmitter, NotificationEventEmitter)
- `src/eventHandlers/` — process events (email, notifications, DB writes)
- Event listeners are registered in `src/app.js`

### Database Schema

7 core tables with these key relationships:
- `Users` (role: caterer/customer/admin) → owns `Meals` and `Menu`
- `Menu` ↔ `Meals` via `MenuMeals` junction table
- `Orders` (belongs to customer User) → `OrderItems` (references Meals)
- `Notifications` (belongs to User)

Migrations live in `config/db/migrations/`, seeders in `config/db/seeders/`.

### User Roles

Three roles with distinct capabilities:
- **caterer**: creates/manages meals, menus; receives order notifications
- **customer**: browses menus, places/modifies orders
- **admin**: platform administration

### Key Configuration

Environment variables (see `.env.example`):
- `DATABASE_URL` / `DB_*` — PostgreSQL connection
- `SECRET` — JWT signing secret
- `OPENING_HOUR`/`CLOSING_HOUR` — business hours (orders only accepted in window)
- `EXPIRY` — order modification window in milliseconds
- `TZ` — timezone (used by `src/utils/moment.js` for all date handling)

### Test Setup

- `pretest` runs `db:setup:test` (migrations only — no seeding) before jest starts
- `config/tests/setup.js` (`setupFilesAfterEnv`) truncates and reseeds all tables in `beforeAll` for each test file — this is the only place seeding happens during tests
- Mock date is fixed to 13:00 of current day for reproducibility (ensures tests run during business hours)
- Nodemailer is mocked to prevent real email sending
- Route test files live in `src/routes/__tests__/<resource>/` subdirectories
- Test DB: `NODE_ENV=test` + `DATABASE_URL=postgres://postgres:postgres@localhost:5432/book_a_meal_test`

### Routes

All API routes are mounted at root (no `/api/v1` prefix):
- `GET /` — serves static HTML documentation (`docs/`)
- `/auth/*`, `/meals/*`, `/menu/*`, `/orders/*`, `/notifications/*`

### Git Hooks

Configured via Husky v3 (`package.json` `husky.hooks`):
- **pre-commit**: `lint-staged` — runs ESLint with auto-fix + `jest --findRelatedTests` on staged JS files
- **pre-push**: `scripts/pre-push.sh` — runs ESLint + `jest --findRelatedTests` on JS files changed vs upstream

### Deployment

- CI runs on GitHub Actions (push to main, or any PR against main): tests against PostgreSQL 14
- Deploy runs via Render on push to a `release/**` branch (requires `RENDER_DEPLOY_HOOK_URL` secret)
- Production config: `render.yaml` (Render) or `docker-compose.prod.yml` + Caddy for self-hosted VPS
