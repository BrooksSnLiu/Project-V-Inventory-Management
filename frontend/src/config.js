// Single source of truth
export const INVENTORY_API_BASE =
  import.meta.env.VITE_INVENTORY_API_BASE || 'http://localhost:10000/api/v1';

// Backwards compatibility: old code that imports API_BASE still works
export const API_BASE = INVENTORY_API_BASE;