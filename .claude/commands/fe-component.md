# Frontend: Scaffold New Component

Scaffold a new React component following BiTE frontend conventions.

## Instructions

The user will provide: component name, domain (e.g. quiz, user, auth, common), and whether it is a page or a reusable UI component.

**For a page component** (`src/components/pages/<domain>/`):
1. Create `<ComponentName>.tsx` in the correct domain subdirectory.
2. The component must be a named function export (not default export).
3. Fetch data via a dedicated custom hook (create the hook in `src/hooks/` if it doesn't exist). Do not call `useQuery` directly inside the page.
4. If the page needs a route, add it to the relevant route file (`src/routes/userRoutes.tsx` or `src/routes/adminRoutes.tsx`) using the existing `renderRoutes` pattern.

**For a reusable UI component** (`src/components/ui/`):
1. Create `<ComponentName>.tsx` in the most appropriate subdirectory under `src/components/ui/`.
2. Accept props typed with a `T<ComponentName>Props` interface defined in the same file.
3. Use Tailwind utility classes for styling. Compose classes with `clsx`/`tailwind-merge` via `@/utils/classname`.
4. Use Radix UI primitives when the component requires accessibility (dialogs, dropdowns, selects, checkboxes).

**Both component types:**
- File name: PascalCase matching the function name.
- No default exports — use named exports only.
- No inline `style` props unless the value is dynamic and cannot be expressed as a Tailwind class.
- Import paths use the `@/` alias.

## Output

Provide the complete file content for every file created or modified, with file paths clearly labelled.
