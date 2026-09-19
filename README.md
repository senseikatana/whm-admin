# WHM Admin — SGA Multi-stack

Sistema de Gestión de Almacén (SGA / WMS) enterprise, diseñado para **ESINSA** pero adaptable a cualquier empresa. Cada versión implementa las mismas funcionalidades con frameworks distintos.

## Versiones

| Versión | Tech stack | Estado |
|---|---|---|
| [`withastro/`](withastro/) | Astro 7 (static + adapter) + React islands + InsForge + Bun | ✅ Activa |
| [`withnext/`](withnext/) | Next.js 16 + React 19 + Tailwind CSS 4 + InsForge | 🚧 En desarrollo |

## Funcionalidades

- Gestión de inventario (+60,000 referencias)
- Control de almacén (entradas, salidas, ubicaciones)
- Gestión de clientes y pedidos
- Trazabilidad por códigos NUT
- Reportes y estadísticas
- Multi-rol (admin, operario, consulta)

## Instalación

```bash
# Astro
cd withastro && bun install && bun run dev

# Next.js
cd withnext && bun install && bun run dev
```

Ambos proyectos usan **Bun** como package manager y lockfile (`bun.lock`).

## Deploy

- `withastro/` — build estático cuyo adapter se elige con `ASTRO_ADAPTER` (`netlify` | `vercel` | `cloudflare` | `node`; sin definir usa `node`). Netlify lo fija en `netlify.toml`. Ver [`withastro/DEPLOY.md`](withastro/DEPLOY.md).
- `withnext/` — CI en la raíz (`.github/workflows/deploy.yml`). Push a `main` despliega en InsForge y en el Cloudflare Worker que sirve `whm.senseikatana.com`. Ver [`withnext/README.md`](withnext/README.md).

## Estructura

```
sga-admin-pannel/
├── withastro/   # SGA con Astro 7
├── withnext/    # SGA con Next.js 16
├── AGENTS.md    # Guía para agentes de código
└── README.md
```

## Documentación para agentes

- [`AGENTS.md`](AGENTS.md) — layout del monorepo, comandos y gotchas.
- [`withastro/AGENTS.md`](withastro/AGENTS.md) — convenciones de Astro/SGA.
- [`withnext/AGENTS.md`](withnext/AGENTS.md) — reglas de Next.js 16 e InsForge.
