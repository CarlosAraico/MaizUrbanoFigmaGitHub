export async function getStock(prisma, itemId) {
  const result = await prisma.inventoryMovement.aggregate({
    _sum: { quantity: true },
    where: { itemId }
  });

  const sum = result._sum.quantity ?? 0;
  return Number(sum);
}
