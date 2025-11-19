// src/components/SyncChip.jsx
import React from "react";

export function SyncChip({ status, lastSeconds }) {
  if (status === "live") {
    return (
      <div className="chip green">
        <span>●</span> Live · updated {lastSeconds}s ago
      </div>
    );
  }
  if (status === "stale") {
    return (
      <div className="chip yellow">
        <span>●</span> Stale · last {lastSeconds}s ago
      </div>
    );
  }
  return (
    <div className="chip red">
      <span>●</span> Error · using cached data
    </div>
  );
}
