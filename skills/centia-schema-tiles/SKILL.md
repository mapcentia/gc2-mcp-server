---
name: centia-schema-tiles
description: Use when serving or configuring the merged per-schema tilesets in Centia BaaS — one combined tile layer of ALL layers in a schema, the <schema>/<schema>.mvt tileset names, /api/v4/schemas/{schema}/tile settings (getSchemaTileSettings/patchSchemaTileSettings/deleteSchemaTileSettings), 403/empty/mis-stacked schema tiles, tile URL forms (TMS/gmaps @grid vs WMTS), or clearing a schema tileset's cache.
---

# Merged per-schema tilesets

Use this skill for the tilesets drawn from **every layer of a schema at once**: `<schema>` (image) and `<schema>.mvt` (vector). They exist side by side with the per-layer tilesets (`schema.table`) and have their own cache.

## Availability

Released in GeoCloud2 **2026.10.0** (tagged) but **not deployed** to production `api.centia.io` as of 2026-10: the settings API, the `sort_id` ordering, the authorizing-proxy support and the cache-clearing semantics below all ship with that release. MCP tools in `@centia-io/mcp-server` >= 1.0.35.

## Fetching tiles — URL forms (the classic 403)

Through the authorizing proxy, base `/api/v4/mapcache/database/{database}/`:

| Service | Form | Grid goes |
|---|---|---|
| TMS | `tms/1.0.0/{tileset}@{grid}/{z}/{x}/{y}.ext` | `@`-suffix on the tileset name |
| gmaps/XYZ | `gmaps/{tileset}@{grid}/{z}/{x}/{y}.ext` | `@`-suffix on the tileset name |
| WMTS-RESTful | `wmts/1.0.0/{tileset}/{style}/{grid}/{z}/{y}/{x}.ext` (style: `default`) | **its own path segment** — never `@` |

Using `@` in the WMTS form (or a bare grid segment in TMS/gmaps) makes the tileset name unresolvable, and the proxy **fails closed with 403** — it reads like a permission denial but is a URL-shape error. `{tileset}` = `dagi`, `dagi.mvt`, or a per-layer name.

## Authorization — strictest layer wins

Since 2026.10.0 the merged tileset resolves through the authorizing proxy: it expands to the schema's OWS-enabled layers and **every layer is authorized** (the rule WMS already applies to multi-layer requests). Anonymous access therefore requires *every* layer to be anonymously readable — **one protected layer makes the whole merged tileset unreachable anonymously**, even with 11 public ones. That is deliberate (the image shows them all) but surprises; authenticated users need read on every layer too. Before 2026.10.0 the proxy dropped dot-less names entirely (every fetch → 403) — if you see that, the server predates the release.

Layers draw **by `sort_id`, lowest at the bottom**. Before 2026.10.0 the order was whatever Postgres returned — an upgrade can change a merged tileset's stacking; it now matches what the layers are configured with.

## Per-schema settings

`/api/v4/schemas/{schema}/tile` (super-user only): `cache` (`sqlite`/`disk`/`memcache`/`s3`), `format`, `ttl`, `auto_expire`, `meta_size`, `meta_buffer`, `s3_tile_set`, `title`, `abstract`.

- `getSchemaTileSettings` → the **effective** values plus `_stored` (only what is saved), `_defaults` (each key's default — visible even when the key is stored) and `schema_exists`; `vector_format` is read-only.
- `patchSchemaTileSettings` merges; an explicit `null` removes a key; → `303`. Requires the schema to exist (`404` `SCHEMA_NOT_FOUND`) so a typo cannot leave a row that takes effect later.
- `deleteSchemaTileSettings` → `204`, idempotent. **Settings deliberately survive dropping the schema** (dropping/recreating is routine) — GET/DELETE work on a dropped schema (`schema_exists: false`).
- **`format` configures the image tileset only** (`PNG`, `jpeg_low/medium/high`): `MVT` is rejected (the `.mvt` tileset's only possible value *is* MVT) and `JSON` too (no merged `.json` tileset).
- **`meta_size`/`meta_buffer` reach `<schema>` only, never `.mvt`** (the vector tileset gets no metatile).
- `ttl`: `0` is rejected (minimum 1); 1–29 is accepted but the config generator floors it to 30 — a stored `ttl: 15` behaves as 30. Default 60.
- Validation errors: `INPUT_VALIDATION_ERROR` (a field constraint) vs `INVALID_REQUEST` (the controller's own checks, e.g. an impossible schema name).

## Clearing the cache

`deleteMapcacheTileset` with the bare schema name (or `<schema>.mvt`) — super-user only for the merged names. `sqlite` full delete 200 sync; `disk` 202 background; `s3`/`memcache` full delete → 400 (scoped `?bbox=`/`?zoom=` deletes, 202, work on every backend and are the only s3 path). **Changing `cache` or `format` does not clear old tiles** — they stay in the old backend, unserved and uncollected. Never use the legacy `DELETE /controllers/tilecache/schema/<schema>` — its disk pattern misses MapCache's layout and it reports success without checking.

## Common mistakes

| Mistake | Reality |
|---|---|
| `@{grid}` in a WMTS URL (or grid segment in TMS/gmaps) | Unresolvable tileset → 403 that looks like a permission error |
| Expecting public layers to make the merged tileset public | One protected layer blocks it for everyone without read on that layer |
| `format: "MVT"` or `"JSON"` | Rejected — only image formats; `vector_format` is read-only |
| Expecting `meta_size`/`meta_buffer` on `.mvt` | Image tileset only |
| Expecting `ttl: 15` to serve 15 s expiry | Accepted but floored to 30 at config generation |
| Switching backend and expecting a clean cache | Old tiles stay in the old backend — reseed and clear yourself |
| PATCH on a dropped schema | `404 SCHEMA_NOT_FOUND` — only GET/DELETE work there, by design |
| Different stacking after upgrading to 2026.10.0 | Draw order now follows `sort_id` (lowest bottom) instead of accidental DB order |
