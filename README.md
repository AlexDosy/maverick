# Maverick – Thin Vertical Slice Demo

This project demonstrates senior backend engineering fundamentals under a strict 10-hour constraint.

It intentionally ships **less**, but ships it **correctly**.

---

## Tech Stack

- Backend: NestJS
- ORM: Prisma
- DB: PostgreSQL
- Auth: JWT + Passport
- Frontend: Next.js (minimal)
- Infra: Docker Compose
- CI: Lint + test + build

---

## Features Implemented

### Authentication
- Email + password login
- JWT issued with `sub` and `role`
- Seeded demo users

### RBAC
- Roles: Admin, Instructor, Student
- Enforced via guards at API layer
- No DB hit on protected routes

### Learning Module (Maverick-lite)
- One course
- One quiz (MCQ)
- Quiz attempts stored
- Score calculated
- Incorrect answers returned

### Scheduling Module (Skynet-lite)
- Booking request
- Admin approval
- Instructor conflict detection
- Status flow: requested → approved

---

## Demo Credentials

| Role | Email | Password |
|----|------|---------|
| Admin | admin@test.com | password |
| Instructor | instructor@test.com | password |
| Student | student@test.com | password |

---

## Local Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
