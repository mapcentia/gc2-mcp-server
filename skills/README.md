# Skills Index

This folder contains the GC2 (Geo Compute Cloud) skills. Start with `gc2-rules`, which holds the global hard rules and routes to the task-specific skills below.

## Quick Routing

Use the smallest matching skill set for the task.

| Skill | Use when |
|---|---|
| `gc2-rules` | Every GC2-related task: global hard rules, tool priority, destructive-ops policy, skill routing |
| `gc2-runtime-sdk` | Building or refactoring JS/TS runtime code with `@mapcentia/gc2-sdk` |
| `gc2-provisioning` | Changing schema, tables, columns, constraints, indexes, policies, migrations |
| `gc2-json-rpc` | Creating/updating/calling JSON-RPC methods and generating TypeScript interfaces |
| `gc2-auth-model` | Implementing or reviewing auth across browser, backend, CLI, and provisioning |
| `gc2-types-formats` | Choosing PostgreSQL types, casts, `type_hints`, `type_formats`, output formats |
| `gc2-file-import` | Importing files with `postFileUpload` and `postFileProcess` |
| `gc2-openapi-docs` | Using OpenAPI/docs as fallback when MCP/SDK are insufficient |
| `gc2-map-styling` | Configuring map center/zoom/extent or layer cartography: classes, styles, labels |
| `gc2-privileges` | Granting sub-user privileges, groups, rights inheritance, layer authentication levels |
| `gc2-keyvalue` | Storing/reading JSON state (settings, flags, preferences) in the key/value store |
| `gc2-feature` | Reading/creating/updating/deleting single features as GeoJSON by primary key |
| `gc2-scheduler` | Automated/cron data imports: scheduler jobs and runs, manual start/stop, monitoring |
| `gc2-snapshots` | Parquet/FlatGeobuf exports of relations and reading published snapshots (DuckDB) |
| `gc2-realtime` | Realtime WebSocket events, subscriptions with shapes, enabling table change events |
| `gc2-ows` | Serving/querying layers via WMS, WFS, WFS-T and the MapCache (WMTS/TMS/XYZ) proxy; Basic/Bearer/anonymous access, FILTERS, srs/time-slice |
| `gc2-tile-seeding` | Seeding/prerendering MapCache tile caches via the tileseeder job queue |
| `gc2-schema-tiles` | Merged per-schema tilesets: URL forms, strictest-layer auth, per-schema tile settings |
| `gc2-ogc` | OGC API Features/Maps: collections, GeoJSON items with bbox/limit/offset/crs/datetime, map images by URL |
| `gc2-delivery` | Final delivery checklist, MCP coverage check, and handoff quality gate |
| `danish-search` | Danish address/matrikel typeahead search component (`@mapcentia/danish-search`) |

## Core Rule

Global hard rules stay in `gc2-rules/SKILL.md`; `AGENTS.md` at the repo root only points there.
Task-specific workflows and references stay in `skills/*/SKILL.md`.
