#!/usr/bin/env node
import { createRequire } from 'node:module'
process.stderr.write('@centia-io/mcp-server is renamed to @mapcentia/gc2-mcp-server\n')
await import(createRequire(import.meta.url).resolve('@mapcentia/gc2-mcp-server/dist/index.js'))
