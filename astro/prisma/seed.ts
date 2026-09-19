import { PrismaClient } from '@prisma/client';
import { seedData } from '../src/data/seed';

const prisma = new PrismaClient();

/**
 * Seeds the ESINSA SGA database with initial warehouse configuration,
 * product catalog (NUT codes), logistics orders, transport routes, and operators.
 */
async function main(): Promise<void> {
  console.log('🌱 Starting ESINSA SGA Database Seed for Polígono Riu Clar (Tarragona)...');

  // 1. Central Warehouse in Polígono Riu Clar
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-RIUCLAR' },
    update: {},
    create: {
      code: 'WH-RIUCLAR',
      name: 'ESINSA Almacén Central - Riu Clar',
      address: 'Pol. Ind. Riu Clar, Carrer del Coure, 43006 Tarragona',
      description: 'Planta de fabricación de juntas planas, estanqueidad y almacén logístico',
    },
  });

  console.log(`✓ Warehouse created: ${warehouse.name}`);

  // 2. Warehouse Zones
  const zonesData = [
    { code: 'Z-REC', name: 'Muelle Recepción', type: 'RECEPTION' as const },
    { code: 'Z-ALM', name: 'Almacén General Paletizado', type: 'STORAGE' as const },
    { code: 'Z-EXP', name: 'Playa de Expediciones', type: 'EXPEDITION' as const },
    { code: 'Z-CUT', name: 'Taller de Corte y Plegado', type: 'CUTTING_FOLDING' as const },
    { code: 'Z-QC', name: 'Control de Calidad y Ensayos', type: 'QUALITY_INSPECTION' as const },
  ];

  for (const z of zonesData) {
    await prisma.warehouseZone.upsert({
      where: { warehouseId_code: { warehouseId: warehouse.id, code: z.code } },
      update: {},
      create: {
        warehouseId: warehouse.id,
        code: z.code,
        name: z.name,
        type: z.type,
      },
    });
  }
  console.log('✓ Warehouse zones seeded');

  // 3. Locations in Storage Zone
  const storageZone = await prisma.warehouseZone.findUnique({
    where: { warehouseId_code: { warehouseId: warehouse.id, code: 'Z-ALM' } },
  });

  if (storageZone) {
    const locations = [
      { code: 'RC-A-01-01', aisle: 'A', rack: '01', shelf: '01', bin: '01' },
      { code: 'RC-A-01-02', aisle: 'A', rack: '01', shelf: '02', bin: '01' },
      { code: 'RC-A-02-01', aisle: 'A', rack: '02', shelf: '01', bin: '01' },
      { code: 'RC-B-01-01', aisle: 'B', rack: '01', shelf: '01', bin: '01' },
      { code: 'RC-C-01-01', aisle: 'C', rack: '01', shelf: '01', bin: '01' },
    ];

    for (const loc of locations) {
      await prisma.location.upsert({
        where: { code: loc.code },
        update: {},
        create: {
          zoneId: storageZone.id,
          ...loc,
        },
      });
    }
    console.log('✓ Storage locations seeded');
  }

  // 4. Inventory items (NUT Codes)
  const defaultLocation = await prisma.location.findFirst();

  for (const item of seedData.inventory ?? []) {
    const sku = String(item.sku);
    let category = 'FLAT_GASKET';
    const name = String(item.name).toLowerCase();

    if (name.includes('espiralada')) category = 'SPIRAL_WOUND';
    else if (name.includes('grafito')) category = 'GRAPHITE_GASKET';
    else if (name.includes('ptfe')) category = 'PTFE_GASKET';
    else if (name.includes('kammprofile')) category = 'KAMMPROFILE';
    else if (name.includes('rtj')) category = 'RTJ_METALLIC';
    else if (name.includes('espárrago') || name.includes('tuerca') || name.includes('varilla'))
      category = 'INDUSTRIAL_BOLTING';
    else if (name.includes('plancha')) category = 'SHEET_RAW_MATERIAL';

    let status = 'OK';
    if (item.status === 'Bajo') status = 'LOW';
    if (item.status === 'Crítico') status = 'CRITICAL';

    await prisma.inventoryItem.upsert({
      where: { sku },
      update: {
        stock: Number(item.stock),
        minStock: Number(item.min),
        status: status as any,
      },
      create: {
        sku,
        name: String(item.name),
        category: category as any,
        abcClass: (item.abcClass as any) || 'B',
        stock: Number(item.stock),
        minStock: Number(item.min),
        status: status as any,
        locationId: defaultLocation?.id,
      },
    });
  }
  console.log(`✓ ${seedData.inventory?.length ?? 0} Inventory items (NUT) seeded`);

  // 5. Inbound Orders
  for (const order of seedData.inOrders ?? []) {
    const orderRef = String(order.orderRef);
    let status = 'PENDING';
    if (order.status === 'Descargando') status = 'PROCESSING';
    if (order.status === 'Completado') status = 'COMPLETED';

    await prisma.inboundOrder.upsert({
      where: { orderRef },
      update: {},
      create: {
        orderRef,
        supplier: String(order.supplier),
        totalItems: Number(order.items),
        operationType: order.type === 'Cross-Docking' ? 'CROSS_DOCKING' : 'STOCKING',
        status: status as any,
      },
    });
  }
  console.log(`✓ ${seedData.inOrders?.length ?? 0} Inbound orders seeded`);

  // 6. Outbound Orders
  for (const order of seedData.outOrders ?? []) {
    const orderRef = String(order.orderRef);
    let status = 'PENDING';
    if (order.status === 'Empacando') status = 'PROCESSING';
    if (order.status === 'Completada') status = 'COMPLETED';

    await prisma.outboundOrder.upsert({
      where: { orderRef },
      update: {},
      create: {
        orderRef,
        client: String(order.client),
        totalItems: Number(order.items),
        operationType: order.type === 'Cross-Docking' ? 'CROSS_DOCKING' : 'STANDARD',
        status: status as any,
      },
    });
  }
  console.log(`✓ ${seedData.outOrders?.length ?? 0} Outbound orders seeded`);

  // 7. Transport Routes
  for (const route of seedData.routes ?? []) {
    const routeId = String(route.routeId);
    let status = 'AVAILABLE';
    if (route.status === 'En Ruta') status = 'EN_ROUTE';

    await prisma.transportRoute.upsert({
      where: { routeId },
      update: {},
      create: {
        routeId,
        driver: String(route.driver),
        status: status as any,
        destinationZone: 'Polígono Riu Clar / Tarragona',
      },
    });
  }
  console.log(`✓ ${seedData.routes?.length ?? 0} Transport routes seeded`);

  // 8. CRM Industrial Accounts
  for (const acc of seedData.crm ?? []) {
    const code = String(acc.code);
    let status = 'ACTIVE_CLIENT';
    if (acc.status === 'Nuevo Lead') status = 'NEW_LEAD';
    if (acc.status === 'En Negociación') status = 'IN_NEGOTIATION';

    await prisma.crmAccount.upsert({
      where: { code },
      update: {},
      create: {
        code,
        company: String(acc.company),
        leadScore: Number(acc.leadScore),
        status: status as any,
        city: 'Tarragona',
      },
    });
  }
  console.log(`✓ ${seedData.crm?.length ?? 0} CRM accounts seeded`);

  // 9. Standard Operators / Users
  for (const user of seedData.users ?? []) {
    const code = String(user.code);
    const role = (String(user.role).toUpperCase() as any) || 'PICKER';
    const email = `${code.toLowerCase()}@esinsa.local`;

    await prisma.userProfile.upsert({
      where: { code },
      update: {
        name: String(user.name),
        role,
        status: user.status === 'Activo' ? 'ACTIVE' : 'INACTIVE',
      },
      create: {
        code,
        name: String(user.name),
        email,
        role,
        status: user.status === 'Activo' ? 'ACTIVE' : 'INACTIVE',
        warehouseId: warehouse.id,
      },
    });
  }
  console.log(`✓ ${seedData.users?.length ?? 0} Operators & roles seeded`);

  console.log('✨ ESINSA SGA database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
