// src/pages/LogsPage.jsx
import React from "react";

export function LogsPage({ logs }) {
  return (
    <div className="layout-rows">
      <div>
        <div className="page-title">Logs</div>
        <div className="page-subtitle">
          Full audit trail of stock changes from POS, Menu, and manual edits.
        </div>
      </div>
      <div className="card scroll-y">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Item</th>
              <th>Δ</th>
              <th>From → To</th>
              <th>Source</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.time}</td>
                <td>{log.item}</td>
                <td>{log.change > 0 ? "+" + log.change : log.change}</td>
                <td>
                  {log.from} → {log.to}
                </td>
                <td>{log.source}</td>
                <td>{log.user}</td>
                <td>
                  {log.status === "success"
                    ? "✅"
                    : log.status === "oos"
                    ? "⚠ OOS"
                    : "⚠"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
