---
name: Replit DB v3 response shape
description: "@replit/database v3 get() wraps responses — must unwrap { ok, value } in the db.ts helper"
---

## The Rule

`@replit/database` v3's `get(key)` returns `{ ok: boolean, value: T }`, NOT the value `T` directly.

**Why:** Version 3 changed the API surface to return a discriminated union response object rather than the raw value. This is a breaking change from v2 which returned the value directly.

**How to apply:** In the `get()` helper in `lib/db.ts`, unwrap before returning:

```typescript
const raw = await (client as any).get(key);
const val = (raw && typeof raw === "object" && "value" in raw)
  ? (raw as { value: unknown }).value
  : raw;
```

Also handle legacy string-encoded values (from any earlier double-stringify) with a `JSON.parse` fallback on strings.

For `set()`, pass the value directly — the DB handles JSON serialization natively. Do NOT wrap in `JSON.stringify()` first.
