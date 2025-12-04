// src/pages/CataloguePage.jsx
import React from 'react';
import { summarizeItems } from '../helpers.js';

function getQuantity(raw) {
  if (typeof raw.quantity === 'number') return raw.quantity;
  if (typeof raw.quantityOnHand === 'number') return raw.quantityOnHand;
  return 0;
}

function getReorderPoint(raw) {
  if (typeof raw.reorderPoint === 'number') return raw.reorderPoint;
  return 0;
}

function getCategory(raw) {
  const sku = String(raw.sku || '').toUpperCase();
  const name = String(raw.name || '').toUpperCase();

  if (sku.startsWith('TOY-') || name.includes('TOY')) return 'Toys';
  if (sku.startsWith('ANIM-')) return 'Parts & Animatronics';
  if (sku.startsWith('VEG-') ||
      name.includes('LETTUCE') ||
      name.includes('TOMATO') ||
      name.includes('ONION') ||
      name.includes('SPINACH') ||
      name.includes('PEPPER')) {
    return 'Vegetables';
  }
  if (sku.startsWith('TOP-') || name.includes('SAUCE')) {
    return 'Sauces & Toppings';
  }
  if (
    name.includes('CHICKEN') ||
    name.includes('BURGER') ||
    name.includes('NUGGET') ||
    name.includes('MEAT')
  ) {
    return 'Meat & Protein';
  }
  if (
    name.includes('JUICE') ||
    name.includes('COKE') ||
    name.includes('COFFEE') ||
    name.includes('POP') ||
    name.includes('DRINK') ||
    name.includes('MILKSHAKE')
  ) {
    return 'Drinks';
  }
  return 'Food';
}

export default function CataloguePage({ items = [], lastUpdated }) {
  const { total } = summarizeItems(items);

  const rows = items.map((raw) => {
    const quantity = getQuantity(raw);
    const reorderPoint = getReorderPoint(raw);

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
      category: getCategory(raw),
    };
  });

  const categoryOrder = [
    'Food',
    'Meat & Protein',
    'Vegetables',
    'Sauces & Toppings',
    'Drinks',
    'Toys',
    'Parts & Animatronics',
    'Other',
  ];

  const grouped = categoryOrder
    .map((cat) => ({
      name: cat,
      items: rows.filter((r) => r.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="page page-catalogue">
      <header className="page-header">
        <h1>Catalogue</h1>
        <p>Browse {total} inventory items from the core database.</p>
      </header>

      <section className="grid grid-2">
        {grouped.map((group) => (
          <div className="card section" key={group.name}>
            <header className="section-header">
              <h2>{group.name}</h2>
              <p>{group.items.length} items</p>
            </header>

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
                {group.items.map((row) => (
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
        ))}
      </section>
    </div>
  );
}
