# BiTE Backend — Server

Go + Fiber + GORM REST API for the Bitcoin High School (BiTE) education platform.  
Entry point: `server/cmd/main.go`. All Go commands run from `server/`.

## Tech Stack

| Concern | Library | Version |
|---|---|---|
| Language | Go | 1.25.0 |
| Web framework | Fiber | 2.52.9 |
| ORM | GORM | 1.30.1 |
| Database | PostgreSQL | 17+ |
| Auth | golang-jwt | 3.2.2 |
| File storage | AWS S3 SDK v2 | 1.36.6 |
| Email (primary) | Mailjet | v4 |
| Email (fallback) | Resend | v3 |
| Payments | Blink Lightning API | custom client |
| AI | Google Gemini | latest |
| Analytics | PostHog Go | 1.10.0 |
| Metrics | Prometheus | 1.23.2 |
| Headless browser | ChromeDP | 0.14.0 |

## Commands

```bash
make run            # run the server (go run ./cmd/main.go)
make install        # install dependencies (go mod tidy)
go build -o main ./cmd/main.go  # build binary
```

## Project Structure

```
server/
├── cmd/
│   └── main.go             # Entry point: Fiber app init, middleware, all route registration
├── internal/
│   ├── handlers/           # HTTP handlers, one package per domain
│   │   ├── auth/
│   │   ├── quiz/
│   │   ├── question/
│   │   ├── answer/
│   │   ├── attempt/
│   │   ├── attemptduration/
│   │   ├── quizcategory/
│   │   ├── user/
│   │   ├── categorycertificate/
│   │   ├── aipreview/
│   │   ├── chesspuzzle/
│   │   ├── ranking/
│   │   ├── analytics/
│   │   ├── satsreward/
│   │   ├── sitevisit/
│   │   ├── health/
│   │   ├── status/
│   │   └── monitor/
│   ├── models/             # GORM models + DB query helpers
│   ├── middlewares/        # Fiber middleware (auth, RBAC, rate limiting)
│   ├── pkg/                # External service integrations and utilities
│   ├── events/             # Event bus + async subscribers
│   │   └── subscribers/
│   ├── constants/          # App-wide constants
│   ├── types/              # Shared type definitions
│   ├── templates/          # Email / document templates
│   ├── data/               # Static data files (e.g. chess puzzle CSV)
│   └── assets/             # Static assets
└── .env                    # Local secrets (never commit)
```

## Conventions

### Naming
- **Packages**: lowercase, single word or hyphenated (`handlers/quiz`, `pkg`)
- **Handler files**: one operation per file, camelCase (`postQuiz.go`, `updateQuiz.go`, `deleteQuiz.go`)
- **Handler functions**: PascalCase, verb + noun (`PostQuiz`, `UpdateQuiz`, `DeleteQuiz`)
- **Model structs**: PascalCase (`User`, `Quiz`, `Question`)
- **Model files**: camelCase matching the struct (`quiz.go`, `satsReward.go`)
- **Constants**: `SCREAMING_SNAKE_CASE`

### Handlers
Each domain lives in its own package under `internal/handlers/<domain>/`. One file per HTTP operation.

```
internal/handlers/quiz/
├── postQuiz.go        # POST handler
├── updateQuiz.go      # PATCH handler
├── getQuiz.go         # GET single
├── getQuizzes.go      # GET list
└── deleteQuiz.go      # DELETE handler
```

A handler function receives `*fiber.Ctx` and returns `error`. Parse and validate the request body, call the model layer, return a JSON response.

```go
func PostQuiz(c *fiber.Ctx) error {
    // 1. Parse body
    // 2. Validate input via pkg.ValidateInput
    // 3. Call model function
    // 4. Return c.Status(...).JSON(...)
}
```

### Models (`internal/models/`)
- One file per entity, matching the struct name.
- All models must embed `gorm.Model` or define `ID`, `CreatedAt`, `UpdatedAt` manually.
- Use UUID string primary keys generated in `BeforeCreate` hooks via `google/uuid`.
- Foreign keys follow the pattern `<ModelName>ID` (e.g., `UserID`, `QuizID`).
- Keep DB query logic inside the model file; handlers call model functions, not raw GORM.
- Database schema is defined in `internal/models/schema.go` and auto-migrated at startup.

```go
type Quiz struct {
    ID          string    `json:"id" gorm:"primaryKey"`
    Title       string    `json:"title"`
    UserID      string    `json:"userID"`
    CreatedAt   time.Time `json:"createdAt"`
    UpdatedAt   time.Time `json:"updatedAt"`
}

func (q *Quiz) BeforeCreate(tx *gorm.DB) error {
    q.ID = uuid.New().String()
    return nil
}
```

### Routes (`cmd/main.go`)
All routes are registered in `main.go`. Group by resource, then apply middleware as needed.

```go
quiz := app.Group("/api/v1/quiz")
quiz.Post("/", middlewares.Auth, middlewares.IsAdmin, handlers.PostQuiz)
quiz.Get("/:id", handlers.GetQuiz)
```

Use the existing middleware chain:
- `middlewares.Auth` — validates JWT, populates `c.Locals("userID")`
- `middlewares.IsAdmin` — ensures `role == ADMIN`; always applied after `Auth`
- `middlewares.SetUserInRequest` — optional auth (sets user if token present)
- `middlewares.SetClientIp` — extracts client IP

### Middlewares
Add new middlewares to `internal/middlewares/`. A middleware is a `fiber.Handler` that calls `c.Next()` on success.

### Events (`internal/events/`)
Use the event bus for work that should happen asynchronously after an HTTP response has been sent (e.g., recalculating rankings, awarding sats after a quiz attempt).

```go
// Publish
eventBus.Publish("quiz.attempted", payload)

// Subscribe (in internal/events/subscribers/)
eventBus.Subscribe("quiz.attempted", updateRanking)
```

Register new subscribers in `internal/events/subscribers/init.go`.

### External Services (`internal/pkg/`)
Each external service has its own file:
- `s3.go` — file upload / delete via AWS S3
- `email.go` — email sending (Mailjet primary, Resend fallback)
- `blinkClient.go` — Bitcoin Lightning payments
- `gemini.go` — Google Gemini AI
- `jwt.go` — JWT generation and parsing
- `validateInput.go` — input validation helpers
- `error.go` — standardised error JSON responses

Always use these helpers rather than calling external SDKs directly in handlers.

### Authentication & Authorisation
- JWT HS256 signed with `JWT_SECRET` from env.
- Token contains `userID` and `role` claims.
- `middlewares.Auth` validates the token and puts `userID` in `c.Locals("userID")`.
- `middlewares.IsAdmin` checks `role == ADMIN`.
- Refresh tokens are rotated on each `/auth/rt-signin` call.

### Error Handling
Use `pkg.Error` helpers for consistent JSON error responses:

```go
return c.Status(fiber.StatusBadRequest).JSON(pkg.ErrorResponse("message"))
```

Do not return raw Go errors to the client.

### Input Validation
Use `pkg.ValidateInput` to validate request structs. Return 400 with validation errors before any DB call.

### Environment Variables

```env
BiTE_DEV_DSN=          # dev Postgres DSN
BiTE_PROD_DSN=         # prod Postgres DSN
JWT_SECRET=
ADMIN_EMAIL=           # comma-separated admin emails
MJ_SENDER_MAIL=
MJ_APIKEY_PUBLIC=
MJ_APIKEY_PRIVATE=
S3_ACCESS_KEY=
S3_ACCESS_KEY_ID=
S3_BUCKET_NAME=
AWS_REGION=
BLINK_API_URL=
BLINK_API_KEY=
BLINK_WALLET_ID=
RESEND_API_KEY=
RESEND_SENDER_EMAIL=
POSTHOG_API_KEY=
POSTHOG_HOST=
POSTHOG_BITE_PERSONAL_KEY=
BiTE_GEMNI_API_KEY=
```

Environment is determined by `GO_ENV` (`development` / `production`). `godotenv` auto-loads `.env` in development.

## Key Files

| File | Purpose |
|---|---|
| `cmd/main.go` | Server bootstrap, middleware, all route registration |
| `internal/models/schema.go` | Auto-migration schema (add new models here) |
| `internal/models/db.go` | GORM database instance |
| `internal/middlewares/auth.go` | JWT validation middleware |
| `internal/events/eventBus.go` | Central async event dispatcher |
| `internal/events/subscribers/init.go` | Subscriber registration |
| `internal/pkg/jwt.go` | JWT creation and parsing |
| `internal/pkg/error.go` | Standardised error responses |

## API Base Path

All resource routes are under `/api/v1/`. Public endpoints (health, metrics) live at the root.

```
GET  /health
GET  /status
GET  /metrics
POST /api/v1/user/auth/signup
...
```

## Do / Don't

**Do**
- One file per handler operation (`postQuiz.go`, not a single `quiz.go` with all operations).
- Call model functions from handlers; never call GORM directly in a handler.
- Register all new models in `schema.go` so auto-migration picks them up.
- Publish events from handlers (not from models) after a successful DB write.
- Use `pkg.ValidateInput` before touching the database.

**Don't**
- Don't write business logic inside middleware.
- Don't commit `.env` or secrets to version control.
- Don't call external service SDKs directly from handlers — use `pkg/` helpers.
- Don't use offset-based pagination for large lists; use cursor-based pagination consistent with existing quiz endpoints.
- Don't bypass `middlewares.IsAdmin` for admin-only operations.
