# Frontend: Add Zustand Store

Add a new Zustand store or extend an existing one, following BiTE frontend conventions.

## Instructions

The user will provide: what state needs to be managed and which domain it belongs to.

**Rule — server state vs. client state:**
- If the state is fetched from the API, it must be managed by TanStack React Query, not Zustand.
- Zustand is for UI/client state: sidebar open, in-progress quiz attempt tracking, notification queue, etc.

**Creating a new store** (`src/stores/<domain>.ts`):

```ts
import { create } from "zustand";

type T<Domain>State = {
  // state fields
};

type T<Domain>Actions = {
  // action methods
};

type T<Domain>Store = T<Domain>State & T<Domain>Actions;

export const use<Domain>Store = create<T<Domain>Store>()((set) => ({
  // initial state
  // actions that call set(...)
}));
```

**localStorage persistence** — only use the `persist` middleware for auth state. For everything else, keep state in-memory only.

**Derived values** — compute derived values inside the component or hook that needs them, not as additional store fields.

**Updating existing stores** — keep the existing state shape; add new fields and actions rather than restructuring.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled.
