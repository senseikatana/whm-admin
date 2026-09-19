# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **feat(public-ui)**: Transition of public website from legacy WordPress to native `.astro` components (zero-JS by default, optimal SEO and Core Web Vitals).
- **feat(catalog-cards)**: Public product catalog representation as responsive industrial cards with technical specs, temperature/pressure ratings, and applications.
- **feat(protected-dashboard)**: Moved SGA administration dashboard to protected `/dashboard` route with role-based gating and table representations for inventory and logistics.
- **docs(presentation)**: Added official presentation letters for ESINSA management and HR in Catalan and Spanish (`public/carta-presentacion-*.{md,html}`).

### Changed
- **refactor(components)**: Enforced strict separation where public components are built exclusively in `.astro`, reserving React/TSX islands strictly for complex client-state requirements (voice picking, dashboard tables, real-time metrics).
- **refactor(structure)**: Removed redundant `src/core/` domain wrappers to keep the codebase lean, consolidating Prisma access in `src/lib/prisma.ts`.

## [0.2.0] - 2026-09-12

### Added
- **feat(prisma)**: Integration of Prisma ORM and schema for ESINSA SGA (Polígono Riu Clar, Tarragona), covering inventory items, locations, in/out orders, routes, and CRM entities.
- **feat(cms)**: Integration of Keystatic CMS (`@keystatic/astro`, `@keystatic/core`) for managing corporate and industrial sealing solutions content.
- **feat(architecture)**: Complete Hexagonal Architecture core domain implementing 6 Gang-of-Four (GoF) design patterns:
  - **Singleton**: `NotificationCenter` for warehouse-wide domain event broadcasting.
  - **Facade**: `WarehouseFacade` simplifying warehouse operations and orchestrating ports.
  - **Factory**: `InventoryItemFactory` for structured creation of standard gaskets, custom cuts, and bolting.
  - **Observer**: `StockObserver` handling real-time stock thresholds and replenishment alerts.
  - **Strategy**: `PickingRoutingStrategy` supporting FIFO, location-optimized, and urgent priority algorithms.
  - **Decorator**: `LoggingInventoryRepositoryDecorator` providing execution timing and audit logs over persistence ports.
- **feat(seed)**: Full CRUD seed dataset for development across all 6 collections (`inventory`, `inOrders`, `outOrders`, `routes`, `crm`, `users`).

### Fixed
- **fix(server)**: Server TypeScript check (`bun run check:server`) and build adapter configuration for multi-target deployments.

## [0.1.0] - 2026-08-24

### Added
- Initial prototype release of the WHM Admin Dashboard built with Astro, React, and InsForge.
