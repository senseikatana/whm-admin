# WHM Admin — SGA Multi-stack

Sistema de Gestión de Almacén (SGA / WMS) enterprise, diseñado para **ESINSA** pero adaptable a cualquier empresa. Cada versión implementa las mismas funcionalidades con frameworks distintos.

## Versiones

| Versión | Tech stack | Estado |
|---|---|---|
| [`astro/`](astro/) | Astro 7 (Hybrid SSR) + Bun | ✅ Activa |
| [`next/`](next/) | Next.js 16 + React 19 + Tailwind CSS 4 + InsForge | 🚧 En desarrollo |

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
cd astro && bun install && bun run dev

# Next.js
cd next && npm install && npm run dev
```

## Estructura

```
whm-admin/
├── astro/      # SGA con Astro 7 (Hybrid SSR + Bun)
├── next/       # SGA con Next.js 16 + React 19
└── README.md
```
