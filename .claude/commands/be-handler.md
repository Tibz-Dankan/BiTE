# Backend: Scaffold New Handler

Scaffold a new Go HTTP handler following BiTE backend conventions.

## Instructions

The user will provide: the domain (e.g. `chessPuzzle`), the HTTP method and operation (e.g. POST create attempt), and the route path.

### 1 — Handler file

Create `server/internal/handlers/<domain>/<verb><Entity>.go`. One operation per file.

```go
package <domain>

import (
    "github.com/gofiber/fiber/v2"
    "github.com/Tibz-Dankan/BiTE/internal/models"
    "github.com/Tibz-Dankan/BiTE/internal/pkg"
)

func <Verb><Entity>(c *fiber.Ctx) error {
    // 1. Parse body
    input := new(models.T<Entity>Input)
    if err := c.BodyParser(input); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, err.Error())
    }

    // 2. Validate input
    if err := pkg.ValidateInput(input); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, err.Error())
    }

    // 3. Call model function
    result, err := models.<Verb><Entity>(*input)
    if err != nil {
        return fiber.NewError(fiber.StatusInternalServerError, err.Error())
    }

    // 4. Return response
    return c.Status(fiber.StatusCreated).JSON(fiber.Map{
        "<entity>": result,
        "message":  "<Entity> created successfully",
    })
}
```

### 2 — Model function

Add the corresponding function to `server/internal/models/<entity>.go`.  
Call GORM via `models.DB` (the package-level `*gorm.DB` instance). Never call GORM directly in a handler.

### 3 — Route registration

Register the route in `server/cmd/main.go`, grouped with the existing routes for this domain. Apply `middlewares.Auth` and `middlewares.IsAdmin` as appropriate.

```go
<domain> := app.Group("/api/v1/<domain>")
<domain>.Post("/attempt", middlewares.Auth, handlers.<Domain>.Post<Entity>)
```

### 4 — Schema

If a new model struct was introduced, add it to the `AutoMigrate` call in `server/internal/models/schema.go`.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled. Include the exact line(s) to add in `main.go` and `schema.go`.
