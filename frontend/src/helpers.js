// src/helpers.js

// Convert backend item into the shape the UI expects
export function mapBackendItem(it, index) {
  const qtyRaw = it.quantity ?? it.qty ?? 0;
  const thresholdRaw = it.reorderPoint ?? it.threshold ?? 0;

  const qty = Number(qtyRaw);
  const threshold = Number(thresholdRaw);

  return {
    id: it.id ?? it.itemId ?? index + 1,
    name: it.name ?? it.itemName ?? "Unknown item",
    sku: it.sku ?? "",
    category: it.category ?? "Unknown",
    store: it.store ?? "Unknown",
    qty: Number.isNaN(qty) ? 0 : qty,
    threshold: Number.isNaN(threshold) ? 0 : threshold,
    updatedSecondsAgo: 0,
  };
}

// Compute status used for tags / counts
export function getStatusForItem(item) {
  if (item.qty === 0) return "oos";
  if (item.qty <= item.threshold) return "low";
  return "ok";
}
