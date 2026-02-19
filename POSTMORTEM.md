# Postmortem

## What Went Well

- Clear prioritization prevented scope creep
- RBAC implemented correctly and early
- Business logic (quiz scoring, conflict detection) is test-covered
- Prisma migrations tell a clean story
- Guards are composable and reusable

---

## What Went Wrong

- Prisma v7 config changes caused friction
- Seed/migrate ordering caused runtime errors
- JWT strategy wiring took longer than expected
- Codespaces networking confused early API testing
- Overhead of NestJS DI is non-trivial under time pressure

---

## What I Would Improve With More Time

- Add e2e tests with Supertest
- Centralize error handling
- Add request validation pipes globally
- Introduce refresh tokens
- Improve frontend UX
- Add API versioning

---

## Key Learnings

- Senior engineering is about **choosing what not to build**
- Correctness beats completeness
- Documentation is a feature
- Thin vertical slices surface real problems early

---

## Final Takeaway

This project is intentionally incomplete — and intentionally honest.

It demonstrates:
- Sound fundamentals
- Correct business logic
- Clear tradeoffs
- Production-aware thinking under constraint
