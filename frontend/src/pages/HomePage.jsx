// src/pages/HomePage.jsx
import React from "react";
import { getStatusForItem } from "../helpers.js";

export function HomePage({ items, logs, sync }) {
  const totalSkus = items.length;
  const lowStock = items.filter((i) => getStatusForItem(i) === "low").length;
  const outOfStock = items.filter((i) => getStatusForItem(i) === "oos").length;
  const changes24 = logs.length; // mock

  const animCount = items.filter((i) => i.category === "Animatronics").length;
  const animLow = items.filter(
    (i) => i.category === "Animatronics" && getStatusForItem(i) !== "ok"
  ).length;
  const toysCount = items.filter((i) => i.category === "Toys").length;
  const toysLow = items.filter(
    (i) => i.category === "Toys" && getStatusForItem(i) !== "ok"
  ).length;
  const foodCount = items.filter((i) => i.category === "Food").length;
  const foodLow = items.filter(
    (i) => i.category === "Food" && getStatusForItem(i) !== "ok"
  ).length;

  const lowStockList = items
    .filter((i) => getStatusForItem(i) !== "ok")
    .slice(0, 5);

  const recentLogs = logs.slice(0, 5);

  return (
    <div className="layout-rows">
      <div>
        <div className="page-title">Overview</div>
        <div className="page-subtitle">
          Snapshot of live stock across animatronics, toys, and food.
        </div>
      </div>

      <div className="grid grid-4">
        <div className="card">
          <div className="card-label">Total SKUs</div>
          <div className="card-value">{totalSkus}</div>
        </div>
        <div className="card">
          <div className="card-label">Low stock items</div>
          <div className="card-value">{lowStock}</div>
        </div>
        <div className="card">
          <div className="card-label">Out of stock</div>
          <div className="card-value">{outOfStock}</div>
        </div>
        <div className="card">
          <div className="card-label">Updates (last 24h)</div>
          <div className="card-value">{changes24}</div>
          <div className="card-pill">from POS / Menu / Manual</div>
        </div>
      </div>

      <div className="rows-2">
        {/* Left column */}
        <div className="layout-rows">
          <div className="card">
            <div className="card-label">Catalogue snapshot</div>
            <div className="grid grid-3" style={{ marginTop: "4px" }}>
              <div className="card" style={{ padding: "7px" }}>
                <div className="card-label">Animatronics parts</div>
                <div className="card-value">{animCount}</div>
                <div className="card-pill">{animLow} low / oos</div>
              </div>
              <div className="card" style={{ padding: "7px" }}>
                <div className="card-label">Toys &amp; merch</div>
                <div className="card-value">{toysCount}</div>
                <div className="card-pill">{toysLow} low / oos</div>
              </div>
              <div className="card" style={{ padding: "7px" }}>
                <div className="card-label">Food &amp; ingredients</div>
                <div className="card-value">{foodCount}</div>
                <div className="card-pill">{foodLow} low / oos</div>
              </div>
            </div>
          </div>

          <div className="card scroll-y">
            <div className="card-label">Low stock items</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Cat</th>
                  <th>Store</th>
                  <th>Qty</th>
                  <th>Thr</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {lowStockList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.store}</td>
                    <td>{item.qty}</td>
                    <td>{item.threshold}</td>
                    <td>{item.updatedSecondsAgo}s ago</td>
                  </tr>
                ))}
                {lowStockList.length === 0 && (
                  <tr>
                    <td colSpan="6">No low stock items 🎉</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="layout-rows">
          <div className="card scroll-y">
            <div className="card-label">Recent activity</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Item</th>
                  <th>Δ</th>
                  <th>Source</th>
                  <th>User</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.time}</td>
                    <td>{log.item}</td>
                    <td>{log.change > 0 ? "+" + log.change : log.change}</td>
                    <td>{log.source}</td>
                    <td>{log.user}</td>
                    <td>{log.status === "success" ? "✅" : "⚠"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-label">API / DB health</div>
            <div style={{ fontSize: "10px", marginTop: "3px" }}>
              Inventory DB: ✅ Connected (mock)
              <br />
              POS API: ✅ Connected · Menu API: ✅ Connected
              <br />
              Failures (5m): 0
            </div>
            <div style={{ marginTop: "6px" }}>
              {/* SyncChip rendered in App topbar, here we just show text */}
              <span style={{ fontSize: "10px", opacity: 0.75 }}>
                Status indicator in top bar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
