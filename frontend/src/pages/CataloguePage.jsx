// src/pages/CataloguePage.jsx
import React, { useMemo, useState } from "react";
import { getStatusForItem } from "../helpers.js";

export function CataloguePage({ items, onOpenAdjust }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.sku || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || i.category === category;
      return matchSearch && matchCat;
    });
  }, [items, search, category]);

  return (
    <div className="layout-rows">
      <div>
        <div className="page-title">Catalogue</div>
        <div className="page-subtitle">
          Browse inventory across animatronics, toys, and food.
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
          <input
            className="search-input"
            style={{ fontSize: "10px", padding: "4px 7px" }}
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="chip"
            style={{ padding: "4px 7px", fontSize: "9px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Animatronics</option>
            <option>Toys</option>
            <option>Food</option>
          </select>
        </div>

        <div className="scroll-y" style={{ maxHeight: "64vh" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Store</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const status = getStatusForItem(item);
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td>{item.category}</td>
                    <td>{item.store}</td>
                    <td>{item.qty}</td>
                    <td>
                      <span className={`tag ${status}`}>
                        {status === "oos"
                          ? "Out"
                          : status === "low"
                          ? "Low"
                          : "OK"}
                      </span>
                    </td>
                    <td>{item.updatedSecondsAgo}s ago</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => onOpenAdjust(item)}
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8">No items match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
