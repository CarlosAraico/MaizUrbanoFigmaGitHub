export async function getAverageCost(prisma, itemId) {
  const movements = await prisma.inventoryMovement.findMany({
    where: {
      itemId,
      movementType: "IN",
      unitCost: { not: null }
    },
    select: { quantity: true, unitCost: true }
  });

  if (!movements.length) return null;

  let totalQty = 0;
  let totalCost = 0;
  for (const mv of movements) {
    const qty = Number(mv.quantity);
    const cost = Number(mv.unitCost);
    if (!Number.isFinite(qty) || !Number.isFinite(cost)) continue;
    totalQty += qty;
    totalCost += qty * cost;
  }

  if (totalQty === 0) return null;
  return Number((totalCost / totalQty).toFixed(4));
}
