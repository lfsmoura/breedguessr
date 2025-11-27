## Project Setup
- Package manager: bun
- Framework: TanStack Start (React + Vite)
- Styling: Tailwind CSS v4
- Database: Cloudflare D1 (SQLite)
- Deployment target: Cloudflare Pages

## Key Commands
- `bun run dev` - Start dev server (port 3000)
- `bun run build` - Build for production
- `bun run db:migrate` - Run D1 migrations
- `bun run db:seed` - Seed database from JSON
- `bun run db:reset` - Reset and reseed local D1

## Architecture
- API routes in `src/routes/api/` use `server.handlers` pattern
- D1 access via `import { env } from "cloudflare:workers"`
- Uses `@cloudflare/vite-plugin` for local D1 bindings
- Config in `wrangler.jsonc` (not .toml)

## Reference
- Similar setup in /Users/leonardomoura/Workspace/nicecross/apps/web
