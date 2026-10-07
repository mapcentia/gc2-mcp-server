---
name: centia-rules
description: Global hard rules for any work involving Centia BaaS, Centia.io, GC2, @centia-io/sdk or the Centia MCP tools. Load this first on every Centia-related task — it sets tool priority (MCP > SDK > OpenAPI > docs), runtime-vs-provisioning boundaries, security and auth baselines, the destructive-operations confirmation policy, and routes to the task-specific centia-* skills.
---

# Centia BaaS Core Rules

> Last updated: 2026-10-07

This skill only contains global hard rules. Task-specific guidance lives in the other `centia-*` skills (see section 6).

## 1) Prime Directive

- Prefer Centia MCP tools when available.
- Use `@centia-io/sdk` for all JS/TS runtime code.
- Use raw HTTP only for provisioning or SDK gaps.
- Never re-implement SDK functionality with `fetch`/`axios` in runtime app code.

## 2) Tool Priority (Hard Rule)

Use this order:

1. Centia MCP tools
2. `@centia-io/sdk`
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

- Runtime SDK patterns: `centia-runtime-sdk`
- Provisioning and migrations: `centia-provisioning`
- JSON-RPC lifecycle and typed API: `centia-json-rpc`
- Auth model by runtime context: `centia-auth-model`
- PostgreSQL types and output formats: `centia-types-formats`
- Map view config and layer styling (classes/styles/labels): `centia-map-styling`
- Sub-user privileges and rights inheritance: `centia-privileges`
- Key/value store (app state, flags, preferences): `centia-keyvalue`
- Feature CRUD as GeoJSON by primary key: `centia-feature`
- Scheduled/automated data imports (cron jobs, runs): `centia-scheduler`
- Parquet/FlatGeobuf snapshot exports and analytics reads: `centia-snapshots`
- Realtime WebSocket events: `centia-realtime`
- File import workflow: `centia-file-import`
- OGC web services (WMS/WFS/WFS-T/MapCache): `centia-ows`
- OGC API Features and Maps (GeoJSON items, map images): `centia-ogc`
- OpenAPI and docs fallback: `centia-openapi-docs`
- Delivery checklist and MCP reference: `centia-delivery`
- Danish address/matrikel search component: `danish-search`

Each skill lives in `skills/<name>/SKILL.md` next to this one.

## 7) Default Paths

- SDK client: `src/baas/client.ts`
- HTTP fallback layer: `src/baas/http.ts`
- Provisioning assets: `provision/`, `migrations/`, `schema/`
