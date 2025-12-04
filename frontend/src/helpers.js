// Each item at minimum has: { id, name, sku, quantity, reorderPoint }

export function summarizeItems(items = []) {
  const total = items.length;

  let outOfStock = 0;
  const lowStockItems = [];

  for (const raw of items) {
    const quantity =
      typeof raw.quantity === 'number'
        ? raw.quantity
        : typeof raw.quantityOnHand === 'number'
        ? raw.quantityOnHand
        : 0;

    const reorderPoint =
      typeof raw.reorderPoint === 'number' ? raw.reorderPoint : 0;

    if (quantity === 0) {
      outOfStock += 1;
    }

    
    if (quantity <= reorderPoint) {
      lowStockItems.push({
        id: raw.id,
        name: raw.name,
        sku: raw.sku,
        quantity,
        reorderPoint,
      });
    }
  }


  const lowStock = lowStockItems.length;

  return {
    total,
    lowStock,
    outOfStock,
    lowStockItems,
  };
}
