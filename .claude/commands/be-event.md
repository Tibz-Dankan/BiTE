# Backend: Add Event Subscriber

Add a new async event subscriber following BiTE's event-driven architecture.

## Instructions

The user will provide: the event name, what triggers it, and what work the subscriber should do.

### When to use events

Use the event bus for side-effects that should happen **after** the HTTP response is sent:
- Recalculating rankings after a quiz attempt
- Awarding sats (Bitcoin) after completion
- Updating user progress
- Sending notification emails

Do not use events for work that the HTTP handler must wait for (e.g., validation, DB writes that affect the response).

### 1 — Publish from the handler

In the handler that triggers the event, publish after a successful DB write:

```go
import "github.com/Tibz-Dankan/BiTE/internal/events"

// After successful DB operation:
events.EventBus.Publish("<domain>.<action>", payload)
```

Choose an event name following the pattern `<domain>.<past-tense-verb>` (e.g., `quiz.attempted`, `satsreward.claimed`).

### 2 — Subscriber file

Create `server/internal/events/subscribers/<action>.go`:

```go
package subscribers

import (
    "github.com/Tibz-Dankan/BiTE/internal/events"
    "github.com/Tibz-Dankan/BiTE/internal/models"
)

func <Action>Subscriber(payload interface{}) {
    // type-assert payload
    data, ok := payload.(models.<PayloadType>)
    if !ok {
        return
    }

    // perform side-effect work
    // log errors; never panic
}

func init<Action>() {
    events.EventBus.Subscribe("<domain>.<action>", <Action>Subscriber)
}
```

### 3 — Register in init.go

Add the registration call to `server/internal/events/subscribers/init.go`:

```go
func InitSubscribers() {
    // ... existing registrations ...
    init<Action>()
}
```

### Payload types

Use an existing model struct or define a lightweight payload struct in the subscriber file. Keep payloads small — pass IDs rather than full objects where possible.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled.
