# Guía Ejecutiva: Centro de Mensajería en Tiempo Real (Real-Time)
**ESINSA — Estanqueidad Industrial S.A. · Polígono Industrial Riu Clar (Tarragona)**  
*Manual para Dirección, Mandos Intermedios y Personal No Técnico*

---

## 1. ¿Qué es este sistema y para qué sirve?

El **Centro de Mensajería en Tiempo Real** es una herramienta integrada dentro del panel SGA de ESINSA que funciona como una **centralita digital moderna**. 

Permite que el equipo de almacén y oficina técnica hable directamente con **clientes industriales (Repsol, Dow, BASF...)**, transportistas y proveedores por **WhatsApp** y **Telegram** desde la misma pantalla del ordenador, **sin necesidad de usar teléfonos móviles personales ni instalar programas adicionales**.

### Ventajas operativas clave:
- **Instantaneidad (Real-Time):** Cuando un transportista o cliente escribe, el mensaje aparece al segundo en la pantalla del SGA sin tener que refrescar la página.
- **Historial unificado:** Todas las conversaciones quedan registradas y asociadas al almacén, evitando que los pedidos o dudas técnicas se queden en los teléfonos de un empleado particular.
- **Notificaciones operativas:** Avisos automáticos de pedidos listos para expedición, llegadas de material o incidencias en carretera.

---

## 2. Cómo funciona el flujo en el día a día

```
[ Cliente / Transportista ]
          │ (Escribe por WhatsApp o Telegram en su móvil)
          ▼
[ Servidor de Mensajería ESINSA (/api) ]
          │ (Envío instantáneo seguro - Real Time SSE)
          ▼
[ Pantalla del Operario en el SGA ]
   "Llegando a Riu Clar con 150 juntas espiraladas"
          │
          │ (El operario responde desde el teclado del PC)
          ▼
[ Móvil del Transportista recibe la respuesta oficial de ESINSA ]
```

---

## 3. ¿Por qué en desarrollo se usa un puerto separado y en producción va todo junto en `/api`?

Esta es una de las dudas más habituales para personas no técnicas. Aquí está la explicación sencilla:

### A. En Fase de Pruebas y Desarrollo (en la oficina técnica)
- En el ordenador del programador se ejecutan dos programas a la vez:
  1. **La web pública y el panel visual:** Se ve en `http://localhost:4321`.
  2. **El motor de mensajería (WhatsApp/Telegram):** Corre en `http://localhost:8787`.
- **Razón:** Permite a los desarrolladores probar el robot de mensajería sin tocar ni alterar la página web.

### B. En Producción (el día del lanzamiento oficial para los clientes)
- En internet, **NO se usan puertos extraños como `:8787`**. Todo se unifica bajo el **mismo y único dominio corporativo de ESINSA**:
  - Web pública: `https://www.esinsagaskets.com`
  - Panel SGA de Almacén: `https://www.esinsagaskets.com/dashboard`
  - Motor de Mensajería: `https://www.esinsagaskets.com/api`

### ¿Qué beneficios tiene para ESINSA tener `/api` en el mismo dominio?
1. **Seguridad Total (CERO errores de cortafuegos):** Las grandes industrias químicas de Tarragona (Repsol, BASF, Dow) tienen redes protegidas que bloquean puertos raros como el 8787. Al usar `https://.../api`, viaja por el puerto web seguro estándar (443), garantizando que siempre funciona.
2. **Cero Errores de Permisos (CORS):** El navegador web reconoce que la mensajería y la web son la misma empresa y no bloquea las conexiones.
3. **Un solo Certificado de Seguridad (Candado verde HTTPS):** Toda la comunicación viaja cifrada de extremo a extremo bajo el mismo certificado SSL de ESINSA.

---

## 4. Pasos para Activar los Canales (Guía sin Código)

Para que el sistema empiece a recibir y enviar mensajes reales, solo se deben completar estos dos trámites administrativos:

---

### Canal 1: Telegram (Listo en 2 minutos)

Telegram es ideal para alertas internas entre los operarios del almacén de Riu Clar y avisos automáticos de stock crítico.

1. Abra la aplicación de Telegram en su móvil o PC.
2. En la barra de búsqueda de arriba, escriba: `@BotFather` (es la cuenta oficial verificada de Telegram con estrella azul).
3. Pulse en **Iniciar** o escriba el mensaje: `/newbot`.
4. El sistema le pedirá:
   - **Nombre público:** Escriba `ESINSA Almacén Riu Clar`.
   - **Nombre de usuario:** Debe terminar en `bot`, por ejemplo: `EsinsaRiuClarBot`.
5. `@BotFather` le responderá con un texto largo de felicitación que contiene una clave parecida a esta:
   `7182938491:AAHk..._ejemplo_clave...`
6. **Copie esa clave y péguela** en el archivo de configuración `.env` en la casilla:
   `TELEGRAM_BOT_TOKEN=`
7. ¡Listo! A partir de ese momento, cualquier mensaje que se envíe a ese bot aparecerá inmediatamente en el panel SGA.

---

### Canal 2: WhatsApp Oficial (Meta Business Cloud API)

WhatsApp es el canal preferido para el contacto directo con compras y transportistas.

1. **Requisito previo:** Una cuenta en [Meta Business Suite](https://business.facebook.com/) de ESINSA y un número de teléfono móvil o fijo corporativo que no tenga activado un WhatsApp personal simultáneamente.
2. Entrar en el portal de desarrolladores de Meta: [developers.facebook.com](https://developers.facebook.com/).
3. Crear una aplicación de tipo **Empresa / Business** y seleccionar el producto **WhatsApp**.
4. En el panel de control de WhatsApp obtendrá 3 datos:
   - **Identificador de número de teléfono (Phone Number ID):** Un número largo de unos 15 dígitos.
   - **Token de acceso permanente (Access Token):** La clave que autoriza a enviar mensajes.
   - **Webhook URL:** En la casilla de URL de webhook de Facebook, escriba su dominio de producción:
     `https://www.esinsagaskets.com/api/whatsapp/webhook`
   - **Token de verificación:** Una palabra clave secreta que usted elija (ej. `EsinsaRiuClar2026`).
5. Pegue estos 3 datos en las casillas correspondientes de su panel o archivo `.env`:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=su_id_aqui
   WHATSAPP_ACCESS_TOKEN=su_token_aqui
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=EsinsaRiuClar2026
   ```

---

## 5. Preguntas Frecuentes (FAQ)

### ¿Qué pasa si el ordenador de almacén se apaga?
Los mensajes que envíen los clientes quedan guardados de forma segura en los servidores de WhatsApp/Telegram y en la base de datos de ESINSA. En cuanto el operario vuelva a abrir el panel del SGA, todos los mensajes pendientes aparecerán organizados cronológicamente.

### ¿Se pueden enviar fotos de juntas o albaranes?
Sí, el sistema almacena los mensajes de texto y admite la recepción de enlaces a fichas técnicas, albaranes en PDF y fotografías de juntas desgastadas para su identificación técnica por parte de la oficina técnica.

### ¿Tiene algún coste adicional el sistema de mensajería?
- **Telegram:** Es 100% gratuito sin límite de mensajes.
- **WhatsApp Cloud API:** Meta ofrece un paquete de **1.000 conversaciones gratuitas al mes** para cada empresa. Para el volumen habitual de un almacén logístico industrial, el coste suele ser cero o de pocos céntimos al mes.

---

*Documento preparado para Dirección General y Operaciones de ESINSA — Estanqueidad Industrial S.A.*
