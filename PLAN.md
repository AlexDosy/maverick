# Project Plan (10-Hour Constraint)

## Goal
Demonstrate senior engineering judgment by shipping a thin but correct vertical slice:
- Auth + RBAC
- Learning (course → lesson → quiz)
- Scheduling (booking + conflict detection)
- Strong documentation
- Explicit tradeoffs

This is **not** a feature-complete system. It is a prioritization exercise.

---

## Time Budget (Strict)

| Task | Description | Time |
|-----|------------|------|
| 1 | Repo + backend skeleton | 0.5h |
| 2 | Prisma schema + migrations | 1.5h |
| 3 | Seed demo data | 0.5h |
| 4 | Auth (JWT login) + tests | 1.5h |
| 5 | RBAC (roles, guards, enforcement) | 1h |
| 6 | Learning module (course + quiz) | 1.5h |
| 7 | Scheduling + conflict detection | 1.5h |
| 8 | Docker + CI | 1h |
| 9 | Minimal frontend | 0.5h |
| 10 | Documentation | 0.5h |

**Total: 10 hours**

---

## Strategy
- Backend-first
- Business logic > UI
- Explicitly document cuts
- Tests only where signal is highest
- Avoid premature abstractions

---

## Success Criteria
- RBAC enforced at API level
- JWT contains user id + role
- Quiz scoring correct
- Booking conflict detection correct
- Docker runs on clean machine
- CI passes
- Honest documentation
