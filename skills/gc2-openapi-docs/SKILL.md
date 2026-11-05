---
name: gc2-openapi-docs
description: OpenAPI and documentation fallback policy for GC2 BaaS, including source priority, local caching workflow, and rules for docs-backed endpoint usage.
---

# OpenAPI and Docs Policy

Use this skill when MCP/SDK are insufficient and HTTP contracts are needed.

## Source priority

Use this order:

1. Local `openapi/openapi.json`
2. URL from `GC2_OPENAPI_URL`
3. User-provided OpenAPI JSON

OpenAPI is the contract for described endpoints.

## Fetch pattern

If allowed and needed, fetch into local cache:

```sh
mkdir -p openapi
if [ -n "$GC2_OPENAPI_URL" ] && [ ! -f "openapi/openapi.fetched.json" ]; then
  curl -fsSL -H "Authorization: Bearer $GC2_ACCESS_TOKEN" "$GC2_OPENAPI_URL" -o openapi/openapi.fetched.json
fi
```

## Documentation fallback

Primary docs:

- `https://gc2.io/docs/intro`

Optional local vendor mirror:

```sh
mkdir -p vendor
if [ ! -d "vendor/gc2-docs/docs" ]; then
  git clone --depth 1 --filter=blob:none --sparse https://github.com/mapcentia/website.git vendor/gc2-docs
  cd vendor/gc2-docs
  git sparse-checkout set docs
  cd ../..
fi
```

If clone fails (auth/network), use web docs directly.

## Rules

- Use docs-backed endpoints only when fully specified.
- Do not invent undocumented payloads.
- Document source URL for each HTTP fallback implementation.