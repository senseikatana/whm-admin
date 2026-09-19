# ESINSA — Estanqueidad Industrial S.A.
**Polígon Industrial Riu Clar, C/. Ferro Nº 10 – 43006 – Tarragona**  
Telèfon: +34 977 553072 | Correu: esinsa@esinsa.es | Web: [www.esinsagaskets.com](https://www.esinsagaskets.com/)

---

**Data:** 12 de setembre de 2026  
**Referència:** SGA-ESINSA-2026/01  
**Per a:** Direcció General, Gerència i Departament de Recursos Humans (RRHH)  
**De:** Sergio Jurado — Responsable del Projecte SGA i Arquitectura de Software  
**Assumpte:** Presentació i Lliurament del Sistema de Gestió de Magatzem (SGA / WMS) per a ESINSA Riu Clar  

---

### Benvolgut equip de Direcció i Recursos Humans:

És un plaer presentar-vos formalment el nou **Sistema de Gestió de Magatzem (SGA / WMS)** dissenyat i desenvolupat a mida per a les instal·lacions centrals d'**ESINSA (Estanqueidad Industrial S.A.)** al Polígon Industrial Riu Clar de Tarragona.

Des de 1985, al llarg de 40 anys de trajectòria impecable, ESINSA s'ha consolidat com un referent nacional i internacional en la fabricació de juntes planes d'estanquitat, distribució de juntes espirometàl·liques, grafit, PTFE, juntes kammprofile, anells metàl·lics RTJ, cargoleria industrial d'alta resistència (ASTM A193 B7/B8M/B16 i femelles 2H), així com en serveis avançats de tall per raig d'aigua i plegat de materials. Amb una cartera de més de **1.600 clients industrials** de primer nivell en els sectors petroquímic, químic, energètic i marítim (com ara Repsol, Dow, BASF, Cepsa, Ercros o MASA) i exportacions a prop de 15 països, l'exigència operativa de les seves més de **60.000 referències** requeria una eina digital a l'alçada del seu lideratge.

El projecte que avui us lliurem respon a aquest repte, alineant-se plenament amb el compromís d'ESINSA amb la **millora contínua, la qualitat certificada sota normes ISO 9000, la innovació tecnològica permanent i el benestar de l'equip humà**, comptant a més amb el suport institucional d'organismes com ACCIÓ.

---

### 1. Objectius Assolits i Abast de l'SGA

El sistema proporciona un control integral i en temps real de totes les operacions logístiques i de taller al magatzem de Riu Clar:

1. **Gestió d'Inventari Especialitzat amb Codis NUT:**
   - Catalogació tècnica exhaustiva amb codis estandarditzats `NUT`.
   - Classificació ABC dinàmica segons rotació i criticitat de la junta o cargol.
   - Llindars d'estoc mínim, avisos d'estat (Òptim, Baix, Crític) i càlcul d'aprovisionament preventiu.
2. **Recepció de Mercaderies i Expedicions (Inbound & Outbound):**
   - Control d'entrades de proveïdors homologats (Novus/Flexitallic, Klinger, Garlock, Lamons, etc.).
   - Gestió d'ordres de sortida per a clients estratègics del pol químic de Tarragona.
   - Suport natiu per a fluxos d'**estocament estàndard** i operacions àgils de **Cross-Docking**.
3. **Picking Avançat Assistit per Veu:**
   - Interfície interactiva de preparació de comandes dissenyada per a tauletes i terminals industrials de mà.
   - Navegació mans lliures assistida per síntesi de veu, reduint temps de recorregut i eliminant errors de recollida.
4. **Logística i Rutes de Transport:**
   - Assignació i seguiment de rutes de repartiment per zones industrials (Riu Clar, Camp de Tarragona, Constantí, polígons químics Nord i Sud).
5. **Keystatic CMS Integrat (Gestió Editorial sense Dependència Tècnica):**
   - Panell accessible a `/keystatic` perquè Gerència, Màrqueting o RRHH actualitzin directament la història de l'empresa, fitxes d'estanquitat, serveis de tall/plegat i avisos de seguretat al magatzem sense necessitat de desplegaments de codi.
6. **Assistent Intel·ligent amb IA Industrial (DeepSeek / OpenRouter):**
   - Suport intel·ligent integrat per a consultes operatives ràpides sobre existències, normatives aplicables (ASME B16.20, EN 1514) i recomanacions de parells de collament o selecció de materials.

---

### 2. Impacte Positiu en l'Equip Humà i Recursos Humans (RRHH)

Per al Departament de Recursos Humans, aquest sistema suposa un salt qualitatiu en la gestió del talent, l'ergonomia laboral i la formació dels més de **25 professionals** d'ESINSA:

- **Estructura Clara de Rols i Permisos (RBAC):**
  - **Administrador:** Control total de configuració i auditoria.
  - **Manager (Cap de Magatzem):** Supervisió d'estocs, expedicions, rutes i analítica.
  - **Picker (Operari de Magatzem):** Interfície simplificada i focalitzada en recollida, preparació i confirmació.
  - **Formador:** Entorn segur per a demostracions i capacitació interna.
  - **Pràctiques (Novatècnica i centres col·laboradors):** Perfil de visualització i aprenentatge supervisat, facilitant la inserció de nous tècnics sense risc de desajustos en l'inventari real.
- **Reducció de l'Estrès i Ergonomia Cognitiva:**
  - Interfícies visuals amb semàfors de color, tipografia d'alta llegibilitat, mode fosc per a baixa fatiga visual i guia per veu.
- **Traçabilitat i Reconeixement de la Feina:**
  - Registre d'auditoria transparent que permet valorar la productivitat i l'exactitud en la preparació sense fiscalitzacions invasives.

---

### 3. Solidesa Tècnica i Arquitectura Hexagonal

El programari s'ha construït sota els estàndards més exigents d'enginyeria de software:

- **Arquitectura Hexagonal (Ports i Adaptadors):** Desacoblament total entre les regles del negoci d'estanquitat i els proveïdors d'infraestructura tecnològica.
- **Implementació Rigorosa dels 6 Patrons de Disseny GoF:**
  - *Singleton:* Gestió optimitzada de connexions a la base de dades PostgreSQL a InsForge.
  - *Facade:* Punt d'accés únic i simplificat (`SgaWarehouseFacade`) per a totes les pantalles del tauler de control.
  - *Factory:* Creació validada de codis NUT i entitats d'estanquitat.
  - *Observer:* Notificació reactiva automàtica davant caigudes d'estoc a nivells crítics.
  - *Strategy:* Algoritmes intercanviables de picking (FIFO estricte o minimització de desplaçaments per passadís).
  - *Decorator:* Registre transparent de temps d'execució i auditoria per a compliment normatiu.
- **Prisma ORM i Base de Dades InsForge:** Màxima robustesa relacional, migracions automàtiques i seguretat de dades.
- **Astro 7 + React 19:** Rendiment ultraràpid, temps de càrrega mínims i consum eficient dels recursos del servidor.

---

### 4. Propers Passos Recomanats

Per culminar la implantació amb èxit, suggerim el cronograma de posada en marxa següent:

1. **Jornades de Formació Pràctica (1–2 sessions):** Tallers breus de 45 minuts amb els operaris de magatzem i taller per familiaritzar-se amb el picking per veu i la gestió d'ubicacions.
2. **Validació de Dades Mestres:** Connexió final amb l'ERP corporatiu per carregar l'històric complet de referències i clients.
3. **Posada en Producció (Go-Live):** Activació oficial del sistema amb acompanyament tècnic presencial a Riu Clar durant les primeres setmanes.

Restem a la vostra sencera disposició per coordinar la sessió demostrativa amb Direcció i l'equip de magatzem, resoldre qualsevol dubte tècnic i planificar l'arrencada operativa.

Agraint per endavant la vostra confiança i visió de futur per a ESINSA, us saluda cordialment,

<br>

**Sergio Jurado**  
Responsable del Projecte SGA · Arquitectura de Software  
*ESINSA SGA WMS Project*  
Polígon Industrial Riu Clar, Tarragona  
