// src/App.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "./config.js";
import { mapBackendItem } from "./helpers.js";
import { SyncChip } from "./components/SyncChip.jsx";
import { AdjustModal } from "./components/AdjustModal.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { CataloguePage } from "./pages/CataloguePage.jsx";
import { LogsPage } from "./pages/LogsPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";

// Demo logs (still local)
const initialLogs = [
  {
    id: 1,
    time: "10:21:03",
    item: "Freddy Plush (L)",
    change: -5,
    from: 20,
    to: 15,
    source: "POS API",
    user: "-",
    status: "success",
  },
  {
    id: 2,
    time: "10:20:54",
    item: "Burger Patty (Box 50)",
    change: -10,
    from: 50,
    to: 40,
    source: "Menu API",
    user: "-",
    status: "success",
  },
  {
    id: 3,
    time: "10:20:21",
    item: "Servo Motor A",
    change: +5,
    from: 8,
    to: 13,
    source: "Manual",
    user: "Mo",
    status: "success",
  },
  {
    id: 4,
    time: "10:19:10",
    item: "Plush Keychain",
    change: -3,
    from: 3,
    to: 0,
    source: "POS API",
    user: "-",
    status: "oos",
  },
];

function App() {
  const [active, setActive] = useState("Home");
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState(initialLogs);
  const [sync, setSync] = useState({ status: "live", lastSeconds: 3 });
  const [adjustItem, setAdjustItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load items from backend once on mount
  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/items`);
        if (!res.ok) {
          throw new Error(`Backend returned ${res.status}`);
        }
        const data = await res.json();

        const mapped = data.map(mapBackendItem);
        setItems(mapped);
        setSync({ status: "live", lastSeconds: 0 });
      } catch (err) {
        console.error("Failed to load items from backend:", err);
        setError(
          "Could not load inventory data from backend. Database API may not be configured yet."
        );
        setSync({ status: "error", lastSeconds: 0 });
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  function handleAdjustSave({ newQty, reason, notes }) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === adjustItem.id ? { ...i, qty: newQty, updatedSecondsAgo: 0 } : i
      )
    );

    const now = new Date();
    const time = now.toTimeString().slice(0, 8);

    const log = {
      id: logs.length + 1,
      time,
      item: adjustItem.name,
      change: newQty - adjustItem.qty,
      from: adjustItem.qty,
      to: newQty,
      source: "Manual",
      user: "Mo",
      status: "success",
      notes,
      reason,
    };

    setLogs((prev) => [log, ...prev]);
    setAdjustItem(null);
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span>🟣</span>
          <span className="text">Project-V Inventory</span>
          <span className="badge">demo</span>
        </div>

        <div>
          <div className="nav-section-label">Main</div>
          <div className="nav-list">
            <div
              className={"nav-item " + (active === "Home" ? "active" : "")}
              onClick={() => setActive("Home")}
            >
              <span className="icon">🏠</span>
              <span className="label">Home</span>
            </div>
            <div
              className={"nav-item " + (active === "Catalogue" ? "active" : "")}
              onClick={() => setActive("Catalogue")}
            >
              <span className="icon">📦</span>
              <span className="label">Catalogue</span>
            </div>
            <div
              className={"nav-item " + (active === "Logs" ? "active" : "")}
              onClick={() => setActive("Logs")}
            >
              <span className="icon">📜</span>
              <span className="label">Logs</span>
            </div>
            <div
              className={"nav-item " + (active === "Settings" ? "active" : "")}
              onClick={() => setActive("Settings")}
            >
              <span className="icon">⚙️</span>
              <span className="label">Settings</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          v0.2 • Data from backend API (when configured) • All manual changes
          logged
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <input
            className="search-input"
            placeholder="Quick search (coming soon )…"
          />
          <SyncChip status={sync.status} lastSeconds={sync.lastSeconds} />
          <div className="chip" title="Environment">
            env: TEST
          </div>
          <div className="avatar" title="You">
            Mo
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ marginTop: "16px" }}>
            <div className="page-title">Loading inventory…</div>
            <div className="page-subtitle">
              Fetching items from backend service at {API_BASE}/items
            </div>
          </div>
        )}

        {!loading && error && (
          <div style={{ marginTop: "16px" }}>
            <div className="page-title">Inventory unavailable</div>
            <div className="page-subtitle" style={{ color: "#ff7676" }}>
              {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {active === "Home" && (
              <HomePage items={items} logs={logs} sync={sync} />
            )}
            {active === "Catalogue" && (
              <CataloguePage items={items} onOpenAdjust={setAdjustItem} />
            )}
            {active === "Logs" && <LogsPage logs={logs} />}
            {active === "Settings" && <SettingsPage />}

            {adjustItem && (
              <AdjustModal
                item={adjustItem}
                onClose={() => setAdjustItem(null)}
                onSave={handleAdjustSave}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
