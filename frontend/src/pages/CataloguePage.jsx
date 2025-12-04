
import React from 'react';
import { summarizeItems } from '../helpers.js';

export default function CataloguePage({ items = [], lastUpdated }) {
  const { total } = summarizeItems(items);

  const rows = items.map((raw) => {
    const quantity =
      typeof raw.quantity === 'number'
        ? raw.quantity
        : typeof raw.quantityOnHand === 'number'
        ? raw.quantityOnHand
        : 0;

    const reorderPoint =
      typeof raw.reorderPoint === 'number' ? raw.reorderPoint : 0;

    let status = 'OK';
    if (quantity === 0) status = 'Out';
    else if (quantity > 0 && quantity <= reorderPoint) status = 'Low';

    return {
      id: raw.id,
      name: raw.name,
      sku: raw.sku,
      quantity,
      reorderPoint,
      status,
    };
  });

  return (
    <div className="page page-catalogue">
      <header className="page-header">
        <h1>Catalogue</h1>
        <p>Browse {total} inventory items from the core database.</p>
      </header>

      <div className="card">
        <table className="table table-catalogue">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Item</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Reorder point</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'left' }}>{row.name}</td>
                <td>{row.sku}</td>
                <td>{row.quantity}</td>
                <td>{row.reorderPoint}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
