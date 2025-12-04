// src/pages/HomePage.jsx
import React from "react";
import { summarizeItems } from "../helpers.js";

function getQuantity(raw) {
  if (typeof raw.quantity === "number") return raw.quantity;
  if (typeof raw.quantityOnHand === "number") return raw.quantityOnHand;
  return 0;
}

export default function HomePage({ items = [], lastUpdated }) {
  const { total, lowStock, outOfStock, lowStockItems } = summarizeItems(items);

  const sortedByQty = [...items].sort(
    (a, b) => getQuantity(b) - getQuantity(a)
  );
  const topItems = sortedByQty.slice(0, 3);
  const maxQty = topItems.length ? getQuantity(topItems[0]) || 1 : 1;

  return (
    <div className="page page-home">
      <header className="page-header">
        <h1>Inventory Dashboard</h1>
        <p>Current stock, categories, and performance metrics.</p>
      </header>

      <section className="grid grid-3 summary-grid">
        <div className="card metric-card">
          <h2>Total SKUs</h2>
          <p className="metric-value">{total}</p>
          <p className="metric-caption">Unique inventory items</p>
        </div>

        <div className="card metric-card">
          <h2>Low stock items</h2>
          <p className="metric-value">{lowStock}</p>
          <p className="metric-caption">
            Items at or below their configured threshold
          </p>
        </div>

        <div className="card metric-card">
          <h2>Out of stock</h2>
          <p className="metric-value">{outOfStock}</p>
          <p className="metric-caption">Items with zero quantity</p>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card section">
          <header className="section-header">
            <h2>Stock quantity</h2>
            <p>Items which are going below threshold.</p>
          </header>

          {lowStockItems.length === 0 ? (
            <p style={{ padding: "1rem 0" }}>No low-stock items right now.</p>
          ) : (
            <table className="table table-lowstock">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Item</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Reorder point</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: "left" }}>{item.name}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reorderPoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card section">
          <header className="section-header">
            <h2>Top items (by quantity)</h2>
            <p>Highest quantities on hand in the inventory.</p>
          </header>

          {topItems.length === 0 ? (
            <p style={{ padding: "1rem 0" }}>No items in inventory yet.</p>
          ) : (
            <div className="top-items">
              {topItems.map((item) => {
                const qty = getQuantity(item);
                const pct = Math.round((qty / maxQty) * 100);

                return (
                  <div className="top-item-row" key={item.id}>
                    <div className="top-item-header">
                      <span className="top-item-name">{item.name}</span>
                      <span className="top-item-qty">{qty}</span>
                    </div>
                    <div className="top-item-bar-track">
                      <div
                        className="top-item-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="top-item-meta">
                      <span className="top-item-sku">{item.sku}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
