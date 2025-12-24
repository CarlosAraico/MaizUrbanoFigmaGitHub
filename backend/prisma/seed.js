import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Proveedor base
  const supplier = await prisma.supplier.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Proveedor Base",
      contactName: "Default",
      status: "active"
    }
  });

  // Item base con id = 1 para QA/inventario
  const item = await prisma.item.upsert({
    where: { sku: "CORN-BLUE" },
    update: {},
    create: {
      id: 1,
      sku: "CORN-BLUE",
      name: "Corn Blue Base",
      category: "Elotes",
      unit: "pz",
      defaultCost: new Prisma.Decimal(25),
      defaultSupplierId: supplier.id
    }
  });

  // Menu item opcional ligado a la SKU base
  await prisma.menuItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Corn Blue",
      description: "Elote azul de prueba",
      price: new Prisma.Decimal(79),
      cost: new Prisma.Decimal(25),
      category: "Test",
      isActive: true,
      imageUrl: null
    }
  });

  // Movimientos iniciales
  const existingMovements = await prisma.inventoryMovement.count({
    where: { itemId: item.id }
  });
  if (existingMovements === 0) {
    await prisma.inventoryMovement.create({
      data: {
        itemId: item.id,
        movementType: "ADJUSTMENT",
        quantity: 100,
        unitCost: new Prisma.Decimal(25),
        source: "seed",
        referenceId: "seed-init"
      }
    });
  }

  console.log("Seed ejecutado. Item id=1 y sku=CORN-BLUE listos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
