// src/App.jsx
import React, { useEffect, useState, useMemo } from "react";
import { API_BASE } from "./config.js";
import AdjustModal from "./components/AdjustModal.jsx";
import HomePage from "./pages/HomePage.jsx";
import CataloguePage from "./pages/CataloguePage.jsx";

function App() {
  const [active, setActive] = useState("Home");

  // Raw items coming straight from backend /api/v1/items
  const [items, setItems] = useState([]);

  // Local logs (only for manual adjustments, not sent to backend)
  const [logs, setLogs] = useState([]);

  // You’re not showing sync anywhere now, but I’m leaving it
  // in case you want to use it later.
  const [sync, setSync] = useState({ status: "live", lastSeconds: 0 });

  const [adjustItem, setAdjustItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 search text from the top bar
  const [searchTerm, setSearchTerm] = useState("");

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

        if (!Array.isArray(data)) {
          throw new Error("Backend returned non-array");
        }

        setItems(data);
        setSync({ status: "live", lastSeconds: 0 });
      } catch (err) {
        console.error("Failed to load items from backend:", err);
        setError(
          "Could not load inventory data from backend. Inventory service or Database API may not be configured."
        );
        setSync({ status: "error", lastSeconds: 0 });
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  // 🔍 Filter items by search term (name or SKU)
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const sku = (item.sku || "").toLowerCase();
      return name.includes(q) || sku.includes(q);
    });
  }, [items, searchTerm]);

  // Adjust modal save handler (purely local UI state)
  function handleAdjustSave({ newQty, reason, notes }) {
    if (!adjustItem) return;

    // Update local quantity
    setItems((prev) =>
      prev.map((i) =>
        i.id === adjustItem.id
          ? { ...i, qty: newQty, updatedSecondsAgo: 0 }
          : i
      )
    );

    // Add a log entry (local only)
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
      user: "Inventory UI",
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
          <span className="text">Project-V Inventory</span>
        </div>

        <div>
          <div className="nav-list">
            <div
              className={"nav-item " + (active === "Home" ? "active" : "")}
              onClick={() => setActive("Home")}
            >
              <span className="label">Home</span>
            </div>
            <div
              className={
                "nav-item " + (active === "Catalogue" ? "active" : "")
              }
              onClick={() => setActive("Catalogue")}
            >
              <span className="label">Catalogue</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">©️ Inventory Management</div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <input
            className="search-input"
            placeholder="Search inventory"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content states */}
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
              <HomePage items={filteredItems} logs={logs} sync={sync} />
            )}
            {active === "Catalogue" && (
              <CataloguePage items={filteredItems} onOpenAdjust={setAdjustItem} />
            )}

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
