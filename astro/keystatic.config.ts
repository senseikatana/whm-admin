import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic CMS Configuration for ESINSA (Full Site Content Management)
 * 
 * Manages all public content (Homepage, Company History, Products, Services, Contacts)
 * as well as internal warehouse notices and operational metadata.
 * 
 * Facility: Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 Tarragona.
 */
export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    /**
     * Global Site Settings
     */
    siteSettings: singleton({
      label: 'Configuración General del Sitio',
      path: 'content/settings/site',
      schema: {
        brandName: fields.text({ label: 'Nombre de Marca', defaultValue: 'ESINSA' }),
        tagline: fields.text({ label: 'Lema', defaultValue: 'Industrial Sealing Solutions' }),
        address: fields.text({
          label: 'Dirección Central',
          defaultValue: 'Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona',
        }),
        phone: fields.text({ label: 'Teléfono', defaultValue: '+34 977 553072' }),
        email: fields.text({ label: 'Email', defaultValue: 'esinsa@esinsa.es' }),
        workingHours: fields.text({ label: 'Horario Comercial', defaultValue: 'Lunes a Viernes de 8:00 a 17:00 h' }),
      },
    }),

    /**
     * Homepage Content
     */
    homePage: singleton({
      label: 'Página de Inicio (Home)',
      path: 'content/pages/home',
      schema: {
        badge: fields.text({
          label: 'Insignia Hero',
          defaultValue: 'Desde 1985 · 40 Años de Excelencia en Estanqueidad',
        }),
        heroTitle: fields.text({
          label: 'Título Principal',
          defaultValue: 'Sellado eficiente y seguro para la industria',
        }),
        heroSubtitle: fields.text({
          label: 'Subtítulo',
          multiline: true,
          defaultValue: 'En ESINSA fabricamos juntas planas de estanqueidad y distribuimos juntas espirometálicas, tornillería industrial y servicios avanzados de corte y plegado desde nuestras instalaciones en el Polígono Industrial Riu Clar de Tarragona.',
        }),
        primaryCtaText: fields.text({ label: 'Botón Principal', defaultValue: 'Explorar Catálogo de Juntas' }),
        secondaryCtaText: fields.text({ label: 'Botón Secundario (SGA)', defaultValue: 'Acceso Panel SGA' }),
      },
    }),

    /**
     * ESINSA Corporate & Facility Information (Empresa)
     */
    companyProfile: singleton({
      label: 'Nuestra Empresa & Historia',
      path: 'content/company/profile',
      schema: {
        companyName: fields.text({
          label: 'Razón Social',
          defaultValue: 'ESINSA — Estanqueidad Industrial S.A.',
          validation: { isRequired: true },
        }),
        foundationYear: fields.integer({
          label: 'Año de Fundación',
          defaultValue: 1985,
          validation: { isRequired: true },
        }),
        warehouseLocation: fields.text({
          label: 'Ubicación Planta Riu Clar',
          defaultValue: 'Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona',
          validation: { isRequired: true },
        }),
        history: fields.document({
          label: 'Nuestra Historia',
          description: 'Trayectoria histórica de ESINSA desde 1985 en estanqueidad.',
          formatting: {
            inlineMarks: true,
            listTypes: true,
            alignment: true,
            headingLevels: true,
            blockTypes: true,
            softBreaks: true,
          },
          dividers: true,
          links: true,
        }),
        mission: fields.text({
          label: 'Misión Corporativa',
          multiline: true,
          defaultValue: 'Ofrecemos soluciones de estanqueidad de alta calidad al mercado industrial mediante la fabricación de juntas planas, amplia disponibilidad de tornillería industrial, corte y plegado, calidad en los acabados e inmediatez en los plazos de entrega, fomentando relaciones de confianza y satisfacción a largo plazo.',
        }),
        vision: fields.text({
          label: 'Visión',
          multiline: true,
          defaultValue: 'Fomentamos la confianza y el compromiso con nuestros clientes y proveedores para garantizar un proceso de mejora continua y sostenibilidad ambiental, impulsados por un equipo humano altamente cualificado, innovación tecnológica constante y excelencia en la ejecución.',
        }),
        contactEmail: fields.text({ label: 'Email', defaultValue: 'esinsa@esinsa.es' }),
        contactPhone: fields.text({ label: 'Teléfono', defaultValue: '+34 977 553072' }),
      },
    }),
  },
  collections: {
    /**
     * Industrial Sealing Solutions Catalog (Productos)
     */
    sealingSolutions: collection({
      label: 'Catálogo de Juntas y Productos',
      slugField: 'code',
      path: 'content/sealing-solutions/*/',
      format: { data: 'json' },
      schema: {
        code: fields.slug({
          name: {
            label: 'Identificador / Slug',
            description: 'Identificador único (ej. espirometalica-316l-dn50)',
          },
        }),
        title: fields.text({
          label: 'Nombre del Producto',
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Familia de Producto',
          options: [
            { label: 'Juntas Planas Estándar y a Medida', value: 'flat-gaskets' },
            { label: 'Juntas Espirometálicas 316L', value: 'spiral-wound' },
            { label: 'Grafito Flexible Armado', value: 'flexible-graphite' },
            { label: 'PTFE Virgen / Expandido', value: 'ptfe' },
            { label: 'Juntas Dentadas Kammprofile', value: 'kammprofile' },
            { label: 'Anillos Metálicos RTJ', value: 'rtj' },
            { label: 'Cobre y Metales Blandos', value: 'copper' },
            { label: 'Tornillería y Espárragos B7/2H', value: 'bolting' },
            { label: 'Planchas y Materias Primas', value: 'raw-sheets' },
            { label: 'Cubrebridas de Seguridad', value: 'safety-covers' },
          ],
          defaultValue: 'flat-gaskets',
        }),
        standard: fields.text({
          label: 'Norma Técnica',
          description: 'ej. ASME B16.20, EN 1514-1, DIN 2690, ASTM A193',
        }),
        materials: fields.text({
          label: 'Materiales',
          defaultValue: 'AISI 316L + Grafito puro',
        }),
        maxTemperature: fields.integer({
          label: 'Temperatura Máxima (°C)',
          defaultValue: 450,
        }),
        maxPressureBar: fields.integer({
          label: 'Presión Máxima (bar)',
          defaultValue: 160,
        }),
        badge: fields.text({
          label: 'Etiqueta Destacada',
          defaultValue: 'Stock Inmediato',
        }),
        stockStatus: fields.text({
          label: 'Disponibilidad Almacén',
          defaultValue: 'Disponible en Almacén Riu Clar',
        }),
        description: fields.text({
          label: 'Descripción Técnica',
          multiline: true,
        }),
        applications: fields.array(
          fields.text({ label: 'Sector o Aplicación' }),
          {
            label: 'Sectores de Aplicación',
            itemLabel: (props) => props.value || 'Sector',
          }
        ),
      },
    }),

    /**
     * Technical and Workshop Services (Servicios)
     */
    industrialServices: collection({
      label: 'Servicios Técnicos y Taller',
      slugField: 'slug',
      path: 'content/services/*/',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug del Servicio' } }),
        name: fields.text({ label: 'Nombre del Servicio', validation: { isRequired: true } }),
        category: fields.text({ label: 'Categoría', defaultValue: 'Ingeniería y Taller' }),
        subtitle: fields.text({ label: 'Subtítulo explicativo', multiline: true }),
        summary: fields.text({ label: 'Resumen Corto', multiline: true }),
        description: fields.text({ label: 'Descripción Completa', multiline: true }),
        leadTimeHours: fields.integer({ label: 'Plazo Estándar (Horas)', defaultValue: 24 }),
        benefits: fields.array(
          fields.text({ label: 'Ventaja / Beneficio' }),
          {
            label: 'Beneficios Clave',
            itemLabel: (props) => props.value || 'Beneficio',
          }
        ),
        procedure: fields.text({ label: 'Metodología / Procedimiento', multiline: true }),
      },
    }),

    /**
     * Warehouse Internal Notices & Safety Bulletins (Dashboard)
     */
    warehouseNotices: collection({
      label: 'Avisos Internos de Almacén',
      slugField: 'id',
      path: 'content/notices/*/',
      format: { data: 'json' },
      schema: {
        id: fields.slug({ name: { label: 'ID de Aviso' } }),
        title: fields.text({ label: 'Título del Aviso', validation: { isRequired: true } }),
        priority: fields.select({
          label: 'Prioridad',
          options: [
            { label: 'Información General', value: 'normal' },
            { label: 'Aviso Importante', value: 'important' },
            { label: 'Alerta Crítica de Seguridad', value: 'urgent' },
          ],
          defaultValue: 'normal',
        }),
        targetRole: fields.select({
          label: 'Destinatarios',
          options: [
            { label: 'Todos los Operarios', value: 'all' },
            { label: 'Solo Pickers / Almacén', value: 'picker' },
            { label: 'Mandos y Jefatura', value: 'manager' },
          ],
          defaultValue: 'all',
        }),
        publishedAt: fields.date({
          label: 'Fecha de Publicación',
          defaultValue: { kind: 'today' },
        }),
        content: fields.text({
          label: 'Cuerpo del Comunicado',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
