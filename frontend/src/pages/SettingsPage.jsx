// src/pages/SettingsPage.jsx
import React from "react";

export function SettingsPage() {
  return (
    <div className="layout-rows">
      <div>
        <div className="page-title">Settings</div>
        <div className="page-subtitle">
          Thresholds, integrations, and display rules (demo / read-only).
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-label">Thresholds</div>
          <div
            style={{
              fontSize: "10px",
              marginTop: "4px",
              display: "grid",
              gap: "4px",
            }}
          >
            <div>Default low-stock: 5 units</div>
            <div>Animatronics default: 10 units</div>
            <div>Toys default: 8 units</div>
            <div>Food default: 20 units</div>
          </div>
        </div>
        <div className="card">
          <div className="card-label">Integrations</div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>
            POS API: ✅ /api/pos/inventory
            <br />
            Menu API: ✅ /api/menu/inventory
            <br />
            Core DB: ✅ /db/inventory
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-label">Display &amp; freshness</div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>
            ✓ Show "Last updated" on all rows
            <br />
            ✓ Mark data stale if older than 30s
            <br />
            ✓ Warn if using cached values on API failure
          </div>
        </div>
        <div className="card">
          <div className="card-label">Roles (concept)</div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>
            Viewer → read-only
            <br />
            Inventory Manager → can Adjust Stock (manual changes logged)
          </div>
        </div>
      </div>
    </div>
  );
}
