# Skills Index

This folder contains the Centia skills. Start with `centia-rules`, which holds the global hard rules and routes to the task-specific skills below.

## Quick Routing

Use the smallest matching skill set for the task.

| Skill | Use when |
|---|---|
| `centia-rules` | Every Centia-related task: global hard rules, tool priority, destructive-ops policy, skill routing |
| `centia-runtime-sdk` | Building or refactoring JS/TS runtime code with `@centia-io/sdk` |
| `centia-provisioning` | Changing schema, tables, columns, constraints, indexes, policies, migrations |
| `centia-json-rpc` | Creating/updating/calling JSON-RPC methods and generating TypeScript interfaces |
| `centia-auth-model` | Implementing or reviewing auth across browser, backend, CLI, and provisioning |
| `centia-types-formats` | Choosing PostgreSQL types, casts, `type_hints`, `type_formats`, output formats |
| `centia-file-import` | Importing files with `postFileUpload` and `postFileProcess` |
| `centia-openapi-docs` | Using OpenAPI/docs as fallback when MCP/SDK are insufficient |
| `centia-map-styling` | Configuring map center/zoom/extent or layer cartography: classes, styles, labels |
| `centia-privileges` | Granting sub-user privileges, groups, rights inheritance, layer authentication levels |
| `centia-keyvalue` | Storing/reading JSON state (settings, flags, preferences) in the key/value store |
| `centia-feature` | Reading/creating/updating/deleting single features as GeoJSON by primary key |
| `centia-scheduler` | Automated/cron data imports: scheduler jobs and runs, manual start/stop, monitoring |
| `centia-snapshots` | Parquet/FlatGeobuf exports of relations and reading published snapshots (DuckDB) |
| `centia-realtime` | Realtime WebSocket events, subscriptions with shapes, enabling table change events |
| `centia-ows` | Serving/querying layers via WMS, WFS, WFS-T and the MapCache (WMTS/TMS/XYZ) proxy; Basic/Bearer/anonymous access, FILTERS, srs/time-slice |
| `centia-tile-seeding` | Seeding/prerendering MapCache tile caches via the tileseeder job queue |
| `centia-schema-tiles` | Merged per-schema tilesets: URL forms, strictest-layer auth, per-schema tile settings |
| `centia-ogc` | OGC API Features/Maps: collections, GeoJSON items with bbox/limit/offset/crs/datetime, map images by URL |
| `centia-delivery` | Final delivery checklist, MCP coverage check, and handoff quality gate |
| `danish-search` | Danish address/matrikel typeahead search component (`@centia-io/danish-search`) |

## Core Rule

Global hard rules stay in `centia-rules/SKILL.md`; `AGENTS.md` at the repo root only points there.
Task-specific workflows and references stay in `skills/*/SKILL.md`.
