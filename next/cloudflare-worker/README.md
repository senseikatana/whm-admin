# Cloudflare Worker — Proxy para subruta

Este worker sirve el proyecto WarehouseFlow SGA desde `senseikatana.com/works/whm-withnext` en lugar de la raíz del dominio.

## Arquitectura

```
senseikatana.com/works/whm-withnext/*
        │
        ▼
┌─────────────────────────┐
│   Cloudflare Worker     │
│   (whm-withnext-proxy)  │
│                         │
│  /works/whm-withnext    │
│         ↓               │
│  /  (upstream)          │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  8cc79ec9.insforge.site │
│  (InsForge / Vercel)    │
└─────────────────────────┘
```

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `worker.ts` | Proxy reverso tipado en TypeScript |
| `wrangler.toml` | Configuración del Worker y rutas |

## Instalación paso a paso

### 1. Instalar Wrangler CLI

```bash
npm install -g wrangler
# o
bun add -g wrangler
```

### 2. Login en Cloudflare

```bash
wrangler login
```

### 3. Desplegar el Worker

```bash
cd cloudflare-worker
wrangler deploy
```

Esto creará el worker `whm-withnext-proxy` y configurará la ruta automáticamente.

### 4. Verificar

```bash
# Debería devolver el HTML de la app
curl -I https://senseikatana.com/works/whm-withnext
```

## Configuración

### `wrangler.toml`

```toml
name = "whm-withnext-proxy"
main = "worker.ts"
compatibility_date = "2024-01-01"

routes = [
  { pattern = "senseikatana.com/works/whm-withnext*", zone_name = "senseikatana.com" }
]
```

### `worker.ts`

El worker hace:

1. **Intercepta** requests a `/works/whm-withnext/*`
2. **Reescribe** la URL quitando el prefijo de subruta
3. **Proxea** al upstream (`8cc79ec9.insforge.site`)
4. **Reescribe** redirects y URLs en HTML para mantener la subruta

## Tipado

El worker está completamente tipado con TypeScript:

- `Env` — Variables de entorno del Worker
- `WorkerHandler` — Interfaz del handler con `fetch(request, env, ctx)`
- `REDIRECT_STATUSES` — Array readonly de códigos de redirect
- `rewriteRedirect(location, upstreamUrl, originalUrl)` — Función tipada

## Limitaciones conocidas

- **Assets de Next.js**: Las rutas de assets (`/_next/static/*`) se sirven desde la subruta correcta gracias al reescritor de HTML
- **API routes**: Los fetches a `/api/*` se reescriben a `/works/whm-withnext/api/*`
- **Client-side navigation**: Next.js usa `router.push()` que respeta el `basePath` configurado
- **Imágenes en `/public`**: Se sirven desde `/works/whm-withnext/imagen.png`

## Troubleshooting

### Error 502 en el worker

Verificar que el upstream esté activo:
```bash
curl -I https://8cc79ec9.insforge.site
```

### Assets no cargan (404)

El worker reescribe las rutas de assets en el HTML. Si algo falla, revisar los logs:
```bash
wrangler tail
```

### Redirects incorrectos

El worker reescribe los redirects del upstream para apuntar a la subruta. Si un redirect va a la raíz, revisar `rewriteRedirect()` en `worker.ts`.

## Actualizar el Worker

```bash
cd cloudflare-worker
wrangler deploy
```

## Eliminar el Worker

```bash
wrangler delete whm-withnext-proxy
```
