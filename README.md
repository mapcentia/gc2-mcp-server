# GC2 (Geo Compute Cloud) MCP Server

A Model Context Protocol (MCP) server that exposes the GC2 API as MCP tools generated from the OpenAPI spec. It communicates over STDIO and can be used with any MCP-compatible client (Claude Desktop, MCP Inspector, etc.).

## Prerequisites
- Node.js 18+ (20+ recommended)
- npm 9+

## Install
```bash
# From the project root
npm install
```

## Authentication

The MCP server uses the same login as the [`gc2-cli`](https://www.npmjs.com/package/@mapcentia/gc2-cli):

```bash
npm i -g @mapcentia/gc2-cli
gc2 connect https://api.gc2.io   # only if not the default
gc2 login                            # browser, device, or password
```

The MCP server reads `~/.config/configstore/gc2-env.json` (managed by `gc2-cli`) and refreshes the access token automatically when it expires.

For headless / CI use, set `API_TOKEN` (and optionally `API_BASE_URL`) — env vars take precedence over the stored session:

- `API_BASE_URL` (optional) — Base URL for the GC2 API. Default: `https://api.gc2.io`
- `API_TOKEN` (optional) — Static personal access token. Bypasses the stored `gc2-cli` session.

The API surface is defined in `centia-api.json` (already included in the repo). The server reads it at runtime to generate tools.

## Run locally (development)
Hot‑reload development run with `tsx`:
```bash
npm run dev
```
This starts the MCP server on STDIO. It is meant to be launched by an MCP client (see below), but you can also smoke‑test it with the MCP Inspector.

## Run with npx
You can run the server directly using `npx`.

If running from the source locally:
```bash
npm run build
npx .
```

If the package is installed or you want to use the published version:
```bash
npx @mapcentia/gc2-mcp-server
```

## Build and run (production)
```bash
npm run build
npm start
```
This compiles TypeScript to `dist/` and starts `node dist/index.js`.

If you prefer a static token over the stored `gc2-cli` session (e.g. CI):
```bash
API_TOKEN=your_token_here npm start
# or
API_BASE_URL=https://api.gc2.io API_TOKEN=your_token_here npm run dev
```

## Using with MCP Inspector (recommended for local testing)
MCP Inspector lets you connect to the server and try tools interactively.

1. Start the Inspector UI:
   ```bash
   npx @modelcontextprotocol/inspector -- npx @mapcentia/gc2-mcp-server
   ```
2. If needed, add environment variables in the Inspector connection dialog (e.g., `API_TOKEN`).

## Using with Claude Desktop
Add the server to your Claude Desktop MCP config (e.g., `claude_desktop_config.json`).

### Using npx (easiest)
```json
{
  "mcpServers": {
    "gc2": {
      "command": "npx",
      "args": ["-y", "@mapcentia/gc2-mcp-server"]
    }
  }
}
```

Run `gc2 login` once and the server will pick up the session. To force a static token instead, add `"env": { "API_TOKEN": "YOUR_CENTIA_TOKEN" }`.

### Using local source
```json
{
  "mcpServers": {
    "gc2": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/absolute/path/to/your/mcp-server"
    }
  }
}
```
- For development, replace `"args": ["run", "start"]` with `"args": ["run", "dev"]`.
- Ensure `cwd` points to this project directory.

## NPM scripts
- `npm run dev` — Run TypeScript directly with `tsx` (hot‑reload style dev loop).
- `npm run build` — Compile TypeScript to CommonJS/ESM in `dist/` via `tsc`.
- `npm start` — Run the built server (`node dist/index.js`).

## Using as a Claude Code plugin
This repository is a Claude Code plugin and its own marketplace. Installing it gives Claude Code the GC2 MCP server and all skills in one step:

```
/plugin marketplace add mapcentia/mcp-server
/plugin install gc2@mapcentia
```

Run `gc2 login` once so the server can pick up your session (see Authentication above). The skills are then available as `/gc2:gc2-rules`, `/gc2:gc2-ows`, etc., and Claude loads them automatically on GC2-related tasks.

To try the plugin from a local checkout without installing it:

```
claude --plugin-dir /path/to/mcp-server
```

## Using Skills with AI Coding Agents
This repository includes a `skills/` folder with guidance for AI coding agents (like Claude Code, Junie, etc.) when working with GC2 BaaS.

`skills/gc2-rules/SKILL.md` contains the global hard rules (tool priority, security baselines, destructive-ops policy) and routes to the other skills; each remaining skill in `skills/*/SKILL.md` covers a specific workflow area. The `AGENTS.md` at the repo root is a short pointer to `gc2-rules` for agents that discover instructions through that file.

To ensure your AI agent follows these rules while developing your application:

1. Copy `AGENTS.md` and the `skills/` folder from this repository to the root of **your own application's** repository.
2. When starting a session with your AI agent, it will automatically find and follow the guidelines.

**`gc2-rules`** covers:
- **Prime Directive**: Preferring MCP tools and official SDKs.
- **Tool Priority**: Order of interaction (MCP tools > SDK > HTTP).
- **Security & Auth**: How to handle tokens and OAuth flows correctly.
- **Destructive Operations Policy**: Requiring explicit confirmation before destructive changes.

**Task-specific skills** (`skills/*/SKILL.md`):
- `gc2-runtime-sdk` — Building JS/TS runtime code with `@mapcentia/gc2-sdk`
- `gc2-provisioning` — Schema, tables, columns, constraints, indexes, migrations
- `gc2-json-rpc` — JSON-RPC method lifecycle and TypeScript interfaces
- `gc2-auth-model` — Auth across browser, backend, CLI, and provisioning
- `gc2-types-formats` — PostgreSQL types, casts, type hints, output formats
- `gc2-file-import` — File import workflow
- `gc2-ows` — WMS/WFS/WFS-T and MapCache proxy endpoints and their access model
- `gc2-ogc` — OGC API Features and Maps (GeoJSON items, map images)
- `gc2-openapi-docs` — OpenAPI and docs fallback policy
- `gc2-delivery` — Delivery checklist and quality gate

## Troubleshooting
- Tools missing or inputs look odd: ensure `centia-api.json` exists and is valid. The server generates tools from this file at startup.
- 401/403 errors: run `gc2 login` (or set a valid `API_TOKEN` in the environment for headless use).
- JSON Schema validation errors: schemas are auto‑normalized/sanitized for MCP, but if you updated `centia-api.json`, re-run and check logs for details.
- ESM/CommonJS issues: this project uses ESM (`"type": "module"`). Use Node.js 18+ and run scripts via npm as shown above.

## License
ISC
