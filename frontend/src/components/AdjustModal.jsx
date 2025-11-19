// src/components/AdjustModal.jsx
import React, { useState } from "react";

export function AdjustModal({ item, onClose, onSave }) {
  const [mode, setMode] = useState("set");
  const [value, setValue] = useState(item.qty);
  const [reason, setReason] = useState("Stock correction");
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    const num = Number(value);
    if (Number.isNaN(num)) return;

    let newQty = item.qty;
    if (mode === "set") {
      newQty = num;
    } else {
      newQty = item.qty + num;
    }

    onSave({ newQty, reason, notes });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Adjust Stock · {item.name}</h3>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>
          Current: {item.qty} units @ {item.store}
        </div>

        <div>
          <label>Change type</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="set">Set exact quantity</option>
            <option value="delta">Add / subtract amount</option>
          </select>
        </div>

        <div>
          <label>{mode === "set" ? "New quantity" : "Amount (+ / -)"}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div>
          <label>Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Stock correction</option>
            <option>Shipment received</option>
            <option>Damaged</option>
            <option>Lost</option>
          </select>
        </div>

        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Visible in logs for audit."
          />
        </div>

        <div className="modal-actions">
          <button className="btn outline small" onClick={onClose}>
            Cancel
          </button>
          <button className="btn small" onClick={handleSubmit}>
            Save &amp; log
          </button>
        </div>
      </div>
    </div>
  );
}
