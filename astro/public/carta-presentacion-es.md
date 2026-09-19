# ESINSA — Estanqueidad Industrial S.A.
**Polígono Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona**  
Teléfono: +34 977 553072 | Correo: esinsa@esinsa.es | Web: [www.esinsagaskets.com](https://www.esinsagaskets.com/)

---

**Fecha:** 12 de septiembre de 2026  
**Referencia:** SGA-ESINSA-2026/01  
**Para:** Dirección General, Gerencia y Departamento de Recursos Humanos (RRHH)  
**De:** Sergio Jurado — Responsable del Proyecto SGA y Arquitectura de Software  
**Asunto:** Presentación y Entrega del Sistema de Gestión de Almacén (SGA / WMS) para ESINSA Riu Clar  

---

### Estimado equipo de Dirección y Recursos Humanos:

Es un placer presentarles formalmente el nuevo **Sistema de Gestión de Almacén (SGA / WMS)** diseñado y desarrollado a medida para las instalaciones centrales de **ESINSA (Estanqueidad Industrial S.A.)** en el Polígono Industrial Riu Clar de Tarragona.

Desde 1985, a lo largo de 40 años de trayectoria impecable, ESINSA se ha consolidado como un referente nacional e internacional en la fabricación de juntas planas de estanqueidad, distribución de juntas espirometálicas, grafito, PTFE, juntas kammprofile, anillos metálicos RTJ, tornillería industrial de alta resistencia (ASTM A193 B7/B8M/B16 y tuercas 2H), así como en servicios avanzados de corte por chorro de agua y plegado. Con una cartera de más de **1.600 clientes industriales** de primer nivel en los sectores petroquímico, químico, energético y marítimo (como Repsol, Dow, BASF, Cepsa, Ercros o MASA) y exportaciones a cerca de 15 países, la exigencia operativa de sus más de **60.000 referencias** demandaba una herramienta digital a la altura de su liderazgo.

El proyecto que hoy entregamos responde a este reto, alineándose plenamente con el compromiso de ESINSA con la **mejora continua, la calidad certificada bajo normas ISO 9000, la innovación tecnológica permanente y el bienestar del equipo humano**, respaldado por la confianza institucional de organismos como ACCIÓ.

---

### 1. Objetivos Cumplidos y Alcance del SGA

El sistema proporciona un control integral y en tiempo real de todas las operaciones logísticas y de taller en el almacén de Riu Clar:

1. **Gestión de Inventario Especializado con Códigos NUT:**
   - Catalogación técnica exhaustiva con códigos estandarizados `NUT`.
   - Clasificación ABC dinámica según rotación y criticidad de la junta o tornillo.
   - Umbrales de stock mínimo, advertencias de estado (Óptimo, Bajo, Crítico) y cálculo de aprovisionamiento preventivo.
2. **Recepción de Mercancías y Expediciones (Inbound & Outbound):**
   - Control de entradas de proveedores homologados (Novus/Flexitallic, Klinger, Garlock, Lamons, etc.).
   - Gestión de órdenes de salida para clientes estratégicos del polo químico de Tarragona.
   - Soporte nativo para flujos de **estocaje estándar** y operaciones ágiles de **Cross-Docking**.
3. **Picking Avanzado Asistido por Voz:**
   - Interfaz interactiva de preparación de pedidos diseñada para tablets y terminales industriales de mano.
   - Navegación manos libres asistida por síntesis de voz, reduciendo tiempos de recorrido y eliminando errores de recogida.
4. **Logística y Rutas de Transporte:**
   - Asignación y seguimiento de rutas de reparto por zonas industriales (Riu Clar, Camp de Tarragona, Constantí, polígonos químicos Norte y Sur).
5. **Keystatic CMS Integrado (Gestión Editorial sin Dependencia Técnica):**
   - Panel accesible en `/keystatic` para que Gerencia, Marketing o RRHH actualicen directamente la historia de la empresa, fichas de estanqueidad, servicios de corte/plegado y avisos de seguridad al almacén sin necesidad de despliegues de código.
6. **Asistente Inteligente con IA Industrial (DeepSeek / OpenRouter):**
   - Soporte inteligente integrado para consultas operativas rápidas sobre existencias, normativas aplicables (ASME B16.20, EN 1514) y recomendaciones de pares de apriete o selección de materiales.

---

### 2. Impacto Positivo en el Equipo Humano y Recursos Humanos (RRHH)

Para el Departamento de Recursos Humanos, este sistema supone un salto cualitativo en la gestión del talento, la ergonomía laboral y la formación de los más de **25 profesionales** de ESINSA:

- **Estructura Clara de Roles y Permisos (RBAC):**
  - **Administrador:** Control total de configuración y auditoría.
  - **Manager (Jefatura de Almacén):** Supervisión de stocks, expediciones, rutas y analítica.
  - **Picker (Operario de Almacén):** Interfaz simplificada y focalizada en recogida, preparación y confirmación.
  - **Formador:** Entorno seguro para demostraciones y capacitación interna.
  - **Prácticas (Novatecnica y centros colaboradores):** Perfil de visualización y aprendizaje supervisado, facilitando la inserción de nuevos técnicos sin riesgo de desajustes en el inventario real.
- **Reducción del Estrés y Ergonomía Cognitiva:**
  - Interfaces visuales con semáforos de color, tipografía de alta legibilidad, modo oscuro para baja fatiga visual y guía por voz.
- **Trazabilidad y Reconocimiento del Trabajo:**
  - Registro de auditoría transparente que permite valorar la productividad y la exactitud en la preparación sin fiscalizaciones invasivas.

---

### 3. Solidez Técnica y Arquitectura Hexagonal

El software se ha construido bajo los más altos estándares de ingeniería de software:

- **Arquitectura Hexagonal (Puertos y Adaptadores):** Total desacoplamiento entre las reglas del negocio de estanqueidad y los proveedores de infraestructura tecnológica.
- **Implementación Rigurosa de los 6 Patrones de Diseño GoF:**
  - *Singleton:* Gestión optimizada de conexiones a la base de datos PostgreSQL en InsForge.
  - *Facade:* Punto de acceso único y simplificado (`SgaWarehouseFacade`) para todas las pantallas del dashboard.
  - *Factory:* Creación validada de códigos NUT y entidades de estanqueidad.
  - *Observer:* Notificación reactiva automática ante caídas de stock a niveles críticos.
  - *Strategy:* Algoritmos intercambiables de picking (FIFO estricto o minimización de desplazamientos por pasillo).
  - *Decorator:* Registro transparente de tiempos de ejecución y auditoría para cumplimiento normativo.
- **Prisma ORM y Base de Datos InsForge:** Máxima robustez relacional, migraciones automáticas y seguridad de datos.
- **Astro 7 + React 19:** Rendimiento ultrarrápido, tiempos de carga mínimos y consumo eficiente de recursos del servidor.

---

### 4. Próximos Pasos Recomendados

Para culminar la implantación con éxito, sugerimos el siguiente cronograma de puesta en marcha:

1. **Jornadas de Formación Práctica (1–2 sesiones):** Talleres breves de 45 minutos con los operarios de almacén y taller para familiarizarse con el picking por voz y la gestión de ubicaciones.
2. **Validación de Datos Maestros:** Conexión final con el ERP corporativo para cargar el histórico completo de referencias y clientes.
3. **Puesta en Producción (Go-Live):** Activación oficial del sistema con acompañamiento técnico presencial en Riu Clar durante las primeras semanas.

Quedamos a su entera disposición para coordinar la sesión demostrativa con Dirección y el equipo de almacén, resolver cualquier duda técnica y planificar el arranque operativo.

Agradeciendo de antemano su confianza y visión de futuro para ESINSA, les saluda atentamente,

<br>

**Sergio Jurado**  
Responsable del Proyecto SGA · Arquitectura de Software  
*ESINSA SGA WMS Project*  
Polígono Industrial Riu Clar, Tarragona  
