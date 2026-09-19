# ESINSA SGA — Warehouse Management System (WMS)
> **Location:** Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona, Spain  
> **Company:** ESINSA (Estanqueidad Industrial S.A.) — Since 1985  
> **Official Web:** [www.esinsagaskets.com](https://www.esinsagaskets.com/) | **Contact:** esinsa@esinsa.es | +34 977 553072

An administrative warehouse management system (SGA / WMS) designed for **ESINSA**, a leading manufacturer and distributor of industrial sealing flat gaskets, spiral wound gaskets, flexible graphite, virgin/expanded PTFE, kammprofile, metallic RTJ, and high-strength industrial bolting (ASTM A193 B7/B8M/B16 and 2H/8M nuts). It also manages CNC waterjet cutting and folding services with personalized technical advisory.

---

## 🏢 Corporate Profile & Operational Context

| Indicator / Field | Verified Information (esinsagaskets.com) |
|---|---|
| **Company Name** | ESINSA — Estanqueidad Industrial S.A. |
| **Foundation Year** | 1985 (40 years of specialized industrial experience) |
| **Headquarters & Warehouse** | Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona |
| **Phone / Contact** | +34 977 553072 · esinsa@esinsa.es |
| **Team Size** | +25 specialized professionals |
| **Client Base** | +1,600 industrial customers (ERCROS, DOW, BASF, REPSOL, CEPSA, MASA...) |
| **Global Reach** | Exporting to ~15 countries |
| **Inventory Scale** | +60,000 reference items (standardized under NUT traceability codes) |
| **Key Industries** | Petrochemical, chemical, energy generation, oil & gas, naval/maritime |
| **Quality & Institutional Support** | ISO 9000 certified processes · Supported by ACCIÓ (Generalitat de Catalunya) |
| **Core Values** | Technical & human excellence, productive agility, permanent innovation, certified quality |

---

## 🛠️ Tech Stack

- **Framework**: [Astro 7](https://astro.build) (Hybrid Static + Server-side SSR adapters)
- **UI Islands**: React 19 + Tailwind CSS v4 + DaisyUI + Zustand
- **Content Management (CMS)**: [Keystatic CMS](https://keystatic.com) (Integrated via `@keystatic/astro` at `/keystatic`)
- **ORM**: [Prisma 6](https://www.prisma.io) (PostgreSQL schema, migrations, automated types)
- **Database & BaaS**: [InsForge](https://insforge.dev) (PostgreSQL, Auth, Realtime, Storage)
- **Toolkit & Hexagonal Architecture**: [`katanakit-js`](https://www.npmjs.com/package/katanakit-js)
- **AI Engine**: MiMo v2.5 / DeepSeek via OpenAI-compatible endpoint
- **Voice Picking**: Web Speech API integration for hands-free warehouse routing

---

## 🌐 Dual Architecture: Public Portal vs. Protected SGA Dashboard

The application follows a dual architectural paradigm designed to replace the legacy WordPress site with maximum performance while providing a robust warehouse management intranet:

| Concern | Public Web Portal | Protected Warehouse Dashboard |
|---|---|---|
| **Route Scope** | `/`, `/empresa`, `/productos/*`, `/servicios/*`, `/contacto` | `/dashboard/*` (Gated by session & RBAC) |
| **Component Technology** | **Strictly `.astro` components** (zero client-side JS, optimal SEO & performance) | **React islands (`.tsx`)** mounted inside Astro strictly where dynamic client state is mandatory |
| **Product Representation** | **Cards layout** (visual imagery, technical specs, pressure/temp ratings, target industries) | **Data Tables layout** (`CrudView` with SKU, ABC velocity, real-time stock, threshold alerts, status actions) |
| **Rendering Strategy** | Static Site Generation (SSG) with i18n (ES / CA) | Hybrid / Server-Side Rendering (SSR) |
| **Target Audience** | Industrial clients (Repsol, Dow, BASF...), purchasing departments | Warehouse managers, pickers, logistics drivers, workshop staff |

---

## 🗄️ Database & ORM (Prisma + InsForge)

Prisma acts as the ORM layer, agnostic of the database provider (configured for InsForge PostgreSQL):
- **Schema**: `prisma/schema.prisma` (Warehouses, zones, locations, inventory items with NUT codes, in/out orders, routes, CRM).
- **Client**: `src/lib/prisma.ts` (Lightweight singleton for API routes and SSR data access).
- **Seed**: `prisma/seed.ts` (`bun run prisma:seed`) and `src/data/seed.ts` (Development dataset for all 6 collections).

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 22.12.0` or [Bun](https://bun.sh) `>= 1.2`
- An InsForge or PostgreSQL database connection string

### 1. Installation
```bash
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already ignored in `.gitignore`):
```bash
cp .env.example .env
```

Ensure the following variables are configured in `.env`:
```env
PUBLIC_INSFORGE_URL=https://5xz8euqt.ap-southeast.insforge.app
PUBLIC_INSFORGE_ANON_KEY=your_insforge_anon_key
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

### 3. Database Schema & Seeding
Generate Prisma Client and load initial ESINSA warehouse data (NUT SKUs, locations, orders, routes):
```bash
# Generate Prisma Client
bun run prisma:generate

# Seed ESINSA inventory & Riu Clar warehouse
bun run prisma:seed
```

### 4. Run Development Server
```bash
bun run dev
```
- **SGA Dashboard**: [http://localhost:4321](http://localhost:4321)
- **Keystatic CMS Admin**: [http://localhost:4321/keystatic](http://localhost:4321/keystatic)
- **Prisma Studio**: `bun run prisma:studio`

---

## 📦 Keystatic CMS Integration

Keystatic provides an in-app editorial interface to customize company and technical content without code deploys:
1. **ESINSA Profile & History**: Corporate background since 1985, continuous improvement mission, facility contact in Polígono Riu Clar.
2. **Sealing Solutions Catalog**: Technical specifications for flat gaskets, spiral wound 316L, kammprofile, RTJ, and bolting.
3. **Industrial Services**: Details on waterjet cutting, CNC folding, and custom gasket advisory.
4. **Warehouse Notices**: Internal communication board for operators and shifts.

Access the CMS anytime at `/keystatic`.

---

## 👥 Roles & Access Permissions

| Role | Dashboard | Inventory | Picking | Inbound | Outbound | Routes | Users & Roles | Keystatic CMS |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Admin** | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Full Control | Full Control |
| **Manager** | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Read Only | Edit Content |
| **Picker** | Read | Read/Edit Stock | Wave Picking | Read | Read | - | - | - |
| **Formador** | Read | Read | Demo Picking | Read | Read | Read | - | - |
| **Prácticas** | Read | Read | Supervised | - | - | - | - | - |

---

## 🧪 Quality & Verification Commands

```bash
bun run check        # Astro & TypeScript typecheck
bun run lint         # Prettier & ESLint audit
bun test             # Unit & integration tests
bun run build        # Production static/hybrid build
```

---

## 📄 License
MIT © ESINSA — Estanqueidad Industrial S.A.
