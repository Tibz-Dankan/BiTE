# Frontend: Add API Integration

Add a new API client module or extend an existing one, following BiTE frontend conventions.

## Instructions

The user will provide: the domain name (e.g. `chessPuzzle`) and the operations to support (e.g. create attempt, get by ID).

1. **Check `src/api/`** for an existing file for this domain. If one exists, add methods to it. If not, create `src/api/<domain>.ts`.

2. **Class structure** — every module exports a single class named `<Domain>API`:

```ts
import { SERVER_URL } from "@/constants/urls";
import { useAuthStore } from "@/stores/auth";
import type { T<Domain>, TGet<Domain>Response } from "@/types/<domain>";

export class <Domain>API {
  private static getAuthHeaders() {
    const token = useAuthStore.getState().token;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async create(payload: TCreate<Domain>Input): Promise<T<Domain>> {
    const res = await fetch(`${SERVER_URL}/<route>`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
```

3. **Add types** — for every new request/response shape, add a corresponding `T*` type to `src/types/<domain>.ts`. Create the file if it doesn't exist.

4. **File uploads** — use `FormData` and omit the `Content-Type` header (the browser sets it with the boundary automatically).

5. **React Query usage** — do not put `useQuery`/`useMutation` inside the API class. Those belong in hooks (`src/hooks/`). The API class is a plain async function wrapper.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled.
