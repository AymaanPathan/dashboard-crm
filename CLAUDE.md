# dashboard-crm

A multi-tenant sales CRM. Each organization moves leads through a kanban pipeline of stages,
with tasks, reminders, notes and activity logs. Leads go on to quotations (PDFs built from
templates), then orders, payments and revenue dashboards. Users have roles (admin,
sales_manager, sales_rep, telecaller, finance).

## Layout
- `backend/`: Express 5, TypeScript (ts-node), Prisma on PostgreSQL, BullMQ on Redis, Socket.IO
  - `index.ts`: app entry; mounts `routes/index.ts` at `/`; port `PORT` (default 5000)
  - `routes/index.ts` mounts `routes/crm/index.ts` at `/crm`, which mounts one router per
    feature (`auth`, `org`, `lead`, `kanban`, `people`, `stages`, `leadTask`, `template`,
    `quotation`, `dashboard`, `order`, `payment`, `revenue`), e.g. `routes/crm/lead/leadRoute.ts`
  - `controller/<feature>/`: one handler per file (`*.controller.ts`) plus an `index.ts`
  - `middleware/`: `authenticate.ts` (JWT Bearer, sets `req.user`; also `isAdmin`), `sendOtp.middleware.ts`
  - `prisma/`: `schema.prisma`, `migrations/`, `seed.ts`; client singleton in `utils/prisma.ts`
  - `utils/`: `response.utils.ts` (sendResponse), email, OTP, S3 (`utils/aws`), sockets, paginate
  - `queues/`, `workers/`, `redis/`: BullMQ jobs (task reminders), Redis at 127.0.0.1:6379
- `frontend/`: Next.js 15 app router, React 19, Redux Toolkit, Tailwind 4, Radix UI
  - Pages in `frontend/src/app`: `/`, `/login`, `/signup`, `/organizationsetup`, and under
    `/crm`: `dashboard`, `deals`, `lead/[id]`, `tasks`, `people`, `quotations`, `templates`,
    `orders`, `payments`, `finance`
  - API calls go through `src/utils/axiosSetup.ts` to `http://localhost:5000/crm/` (`src/utils/getUrl.ts`)

## Running (npm in both folders; never mix package managers)
Needs PostgreSQL (`DATABASE_URL`) and Redis on localhost:6379. Backend env vars live in
`backend/.env`: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `SMTP_*`, `AWS_*`, `*_BUCKET_NAME`.
- Backend: `cd backend && npm install && npx prisma generate && npm run dev`
  (`dev` runs the API with nodemon and the BullMQ workers together; `npm start` runs the API only)
- Schema change: `npx prisma migrate dev --name <change>`; relation-only change: `npx prisma generate`
- Frontend: `cd frontend && npm install && npm run dev` (port 8000); `npm run lint`, `npm run build`

## Tests
Backend tests use Node's built-in test runner and live in `backend/tests/*.test.ts`. Run from `backend/`:
`TS_NODE_TRANSPILE_ONLY=1 node --require ts-node/register --test --test-force-exit tests/*.test.ts`
`npm test` is still the default placeholder and fails. The frontend has no tests.
Note: the first tests are on the unmerged `test/*` branches, so `backend/tests/` is not on main yet.
Tests mount the real routers on an ephemeral port and stub Prisma where needed; no live DB required.

## Code patterns
- Every handler builds a `ResponseModel` (`{ statusCode, message, showMessage, data }`) up front,
  changes it, and always replies with `return sendResponse(res, response)` from
  `utils/response.utils.ts`, never `res.json`. Validation failures return 4xx with a clear
  `message`. The `catch` logs and returns 500 "Internal server error" with no error details.
- New controller: add `controller/<feature>/<name>.controller.ts`, re-export it from that
  folder's `index.ts`, and in the route file `import * as xController from ".../controller/<feature>/index"`.
- Protected routes put `authenticate` before the handler: `router.post("/add", authenticate, ctrl.createLead)`.
- New feature router: create it under `routes/crm/<feature>/` and mount it in `routes/crm/index.ts`.
- Use the shared `prisma` from `utils/prisma.ts`; never create a new PrismaClient.
