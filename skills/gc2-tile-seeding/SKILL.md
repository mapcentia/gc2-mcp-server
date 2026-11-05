---
name: gc2-tile-seeding
description: Use when seeding, warming, or prerendering a MapCache tile cache in GC2 BaaS — "tiles are slow the first time", prerender/seed a tileset, /api/v4/tileseeder/jobs, the postSeedJob/getSeedJob/getSeedJobs/deleteSeedJob tools, mapcache_seed, UNKNOWN_GRID or TOO_MANY_PENDING errors, cancelling or monitoring seed jobs, or the v3 tileseeder.
---

# Tile seeding (the tileseeder job queue)

Use this skill to prerender ("seed") tiles for a MapCache tileset through the v4 job queue, `/api/v4/tileseeder/jobs`. Seeding warms the cache so first views are fast; it is **a queue, not a call**.

## Availability

Released in GeoCloud2 **2026.10.0** (tagged) but **not deployed** to production `api.gc2.io` as of 2026-10 — the tools cannot be tried against production until a deploy. MCP tools ship in `@mapcentia/gc2-mcp-server` 1.1.0+. Sub-users allowed (403 `INSUFFICIENT_PRIVILEGES` without access to the tileset).

## The queue model

`postSeedJob` answers `202` and the job sits `pending` until a **once-a-minute cron tick** claims it, under the node-wide `tileseeder.maxConcurrent` cap — up to a minute (longer behind other jobs) is **normal, not a hang**. One process per job runs `mapcache_seed`; status, the log tail and cancellation live in the job row, so they work from any node.

## Queueing a job

Body (one object or an array — arrays are validated/authorized in full before anything is queued): required `tileset`, `grid`, `zoom_start`, `zoom_end`; optional `name`, `extent_layer` (nullable), `threads`. **Any other field → 400.**

- **`grid` is not free-form**: it must be a grid the tileset declares in the database's tile cache configuration — in practice GC2's generated `g20`. **`g20` is the grid's name; `GoogleMapsCompatible` is the same grid's title** (what capabilities documents and WMTS clients show) — sending the title is the classic 400 `UNKNOWN_GRID`, whose message lists the tileset's real grids: surface it to the user.
- Zoom is validated against the grid's levels (0–27 for `g20`), and **cost grows ~4× per level**: z0–12 is thousands of tiles, z0–18 is millions. Before an hours-long job: bound the area with `extent_layer`, seed broadly only to moderate zooms, and split expensive high-zoom ranges into separate cancellable jobs.
- `extent_layer` bounds the seeded area by a relation's features; it must be a **registered GC2 layer the caller may read** — a plain unregistered table → 403/404 at POST time.
- `429` `TOO_MANY_PENDING` when the queue cap is hit (`tileseeder.maxPending`, default 20).

## Monitoring and cancelling

`getSeedJobs` lists newest first (super-user: the whole database's; filters `?status=` — unknown values match nothing, not an error — and `?tileset=`) **without `log`**; `getSeedJob` (uuid, or comma list → array) includes the `log` tail. Statuses: `pending → running → succeeded|failed|cancelled`, plus computed `stale` (running with no heartbeat for 10 min — the run or its node is gone; stop it and requeue).

**Cancellation is a request, not a fact.** `deleteSeedJob` → `204` if the job was still queued (cancelled immediately) or already finished; `202` `{message: "Stopping"}` if running — then poll `getSeedJob` until `status` is `cancelled`. A job that ends `succeeded` with `cancel_requested` set lost the race deliberately: the seed finished before the stop landed. Comma lists validate every uuid before anything is written.

## Server settings and v3

The `tileseeder` block in `App.php`: `maxConcurrent`, `maxThreads`, `maxPending`, `maxHours`, `cancelGraceSeconds`, `logTailBytes`, `keepLogHours`, and `seedBinary` (a non-standard `mapcache_seed` path).

**v3 `/api/v3/tileseeder` is now a shell over the same queue** — old callers keep working unchanged (same shapes and status codes), and no pgrep/kill remains. Two deliberate differences: the `cmd` field is gone from the POST response (it carried the Postgres password), and `pid` is always `null` (a worker, not the request, starts the seed).

## Common mistakes

| Mistake | Reality |
|---|---|
| Sending `GoogleMapsCompatible` as `grid` | That is the grid's *title*; send the name (`g20`) — 400 `UNKNOWN_GRID` lists the real grids |
| Reading 45 s of `pending` as a hang | The cron tick claims jobs about once a minute, under `maxConcurrent` |
| Seeding z0–18 globally | ~4× tiles per level; bound with `extent_layer` and split high zooms into separate jobs |
| Treating the cancel `202` as "stopped" | Poll until `cancelled`; `succeeded` + `cancel_requested` means the seed won the race |
| Migrating v3 callers urgently | v3 is a shell over the v4 queue — unchanged shapes; only `cmd` (gone) and `pid` (null) differ |
| Clearing cache with `deleteSeedJob` | That cancels a *job*; deleting tiles is `deleteMapcacheTileset` (see `gc2-ows`) |
| Assuming production availability | Released in GC2 2026.10.0, not deployed to api.gc2.io as of 2026-10 |
