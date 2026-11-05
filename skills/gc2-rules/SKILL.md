---
name: gc2-rules
description: Global hard rules for any work involving GC2 (Geo Compute Cloud) BaaS, @mapcentia/gc2-sdk or the GC2 MCP tools. Load this first on every GC2-related task — it sets tool priority (MCP > SDK > OpenAPI > docs), runtime-vs-provisioning boundaries, security and auth baselines, the destructive-operations confirmation policy, and routes to the task-specific gc2-* skills.
---

# GC2 BaaS Core Rules

> Last updated: 2026-10-07

This skill only contains global hard rules. Task-specific guidance lives in the other `gc2-*` skills (see section 6).

## 1) Prime Directive

- Prefer GC2 MCP tools when available.
- Use `@mapcentia/gc2-sdk` for all JS/TS runtime code.
- Use raw HTTP only for provisioning or SDK gaps.
- Never re-implement SDK functionality with `fetch`/`axios` in runtime app code.

## 2) Tool Priority (Hard Rule)

Use this order:

1. GC2 MCP tools
2. `@mapcentia/gc2-sdk`
3. OpenAPI-defined HTTP calls
4. Docs-backed HTTP calls

Never invent endpoints or payloads.

## 3) Runtime vs Provisioning (Hard Rule)

- Runtime application code must not perform schema provisioning.
- Schema changes are provisioning/codegen tasks only.
- Runtime apps must assume schema already exists.

## 4) Security and Auth Baselines

- Never hardcode credentials or tokens.
- Never commit secrets in `.env`.
- Frontend/browser code must not embed service tokens.
- Browser auth must use SDK OAuth flows; do not implement OAuth manually.

## 5) Destructive Operations Policy (Hard Rule)

Before destructive changes, present method/tool/purpose and require explicit user confirmation.

Destructive includes:

- `DROP`, `TRUNCATE`, destructive `DELETE`
- schema/table/column/constraint/index deletes
- policy overwrite operations

## 6) Required Skill Routing

Use the minimal matching skill(s) below for each task:

- Runtime SDK patterns: `gc2-runtime-sdk`
- Provisioning and migrations: `gc2-provisioning`
- JSON-RPC lifecycle and typed API: `gc2-json-rpc`
- Auth model by runtime context: `gc2-auth-model`
- PostgreSQL types and output formats: `gc2-types-formats`
- Map view config and layer styling (classes/styles/labels): `gc2-map-styling`
- Sub-user privileges and rights inheritance: `gc2-privileges`
- Key/value store (app state, flags, preferences): `gc2-keyvalue`
- Feature CRUD as GeoJSON by primary key: `gc2-feature`
- Scheduled/automated data imports (cron jobs, runs): `gc2-scheduler`
- Parquet/FlatGeobuf snapshot exports and analytics reads: `gc2-snapshots`
- Realtime WebSocket events: `gc2-realtime`
- File import workflow: `gc2-file-import`
- OGC web services (WMS/WFS/WFS-T/MapCache): `gc2-ows`
- OGC API Features and Maps (GeoJSON items, map images): `gc2-ogc`
- OpenAPI and docs fallback: `gc2-openapi-docs`
- Delivery checklist and MCP reference: `gc2-delivery`
- Danish address/matrikel search component: `danish-search`

Each skill lives in `skills/<name>/SKILL.md` next to this one.

## 7) Default Paths

- SDK client: `src/baas/client.ts`
- HTTP fallback layer: `src/baas/http.ts`
- Provisioning assets: `provision/`, `migrations/`, `schema/`
