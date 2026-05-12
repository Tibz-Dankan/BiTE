# Backend: Add GORM Model

Add a new GORM model or extend an existing one, following BiTE backend conventions.

## Instructions

The user will provide: the entity name and its fields.

### 1 — Model file

Create `server/internal/models/<entityCamelCase>.go`.

```go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type <Entity> struct {
    ID        string    `json:"id" gorm:"primaryKey"`
    // domain fields with json and gorm tags
    CreatedAt time.Time `json:"createdAt"`
    UpdatedAt time.Time `json:"updatedAt"`
}

func (e *<Entity>) BeforeCreate(tx *gorm.DB) error {
    e.ID = uuid.New().String()
    return nil
}
```

**Field conventions:**
- Primary key: `ID string` with `gorm:"primaryKey"` — UUID assigned in `BeforeCreate`.
- Foreign keys: `<RelatedModel>ID string` with `json:"<relatedModel>ID"`.
- Always include `CreatedAt` and `UpdatedAt`.
- Use `gorm:"not null"` for required fields; add `gorm:"default:..."` where applicable.
- Use `gorm:"uniqueIndex"` for fields that must be unique.

### 2 — DB query helpers

Add query functions in the same file (not in handlers):

```go
func Create<Entity>(input <Entity>) (<Entity>, error) {
    result := DB.Create(&input)
    return input, result.Error
}

func Get<Entity>ByID(id string) (<Entity>, error) {
    var entity <Entity>
    result := DB.Where("id = ?", id).First(&entity)
    return entity, result.Error
}
```

### 3 — Schema registration

Add the new struct to the `AutoMigrate` call in `server/internal/models/schema.go`:

```go
db.AutoMigrate(
    // ... existing models ...
    &<Entity>{},
)
```

### 4 — Relationships

Define associations using GORM struct tags (`has many`, `belongs to`, `many2many`). Follow the existing pattern in `models/quiz.go` and `models/user.go`.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled. Include the exact line to add in `schema.go`.
