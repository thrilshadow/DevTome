import { log } from './debug.js';

let currentHandler = null;

export function setupFAB({ label = "Action", onClick, usePanel = false, panelId = "fabMenuPanel" } = {}) {
  const fab = document.getElementById("fab");
  const panel = document.getElementById(panelId);

  if (!fab) {
    log("❌ FAB button not found in DOM.");
    return;
  }

  if (usePanel && !panel) {
    log(`❌ FAB panel '${panelId}' not found in DOM.`);
    return;
  }

  log("✅ FAB and panel setup starting...");
  fab.title = label;

  if (currentHandler) {
    fab.removeEventListener("click", currentHandler);
  }

  currentHandler = (e) => {
    log(`🔘 FAB clicked: ${label}`);

    if (usePanel && panel) {
      const isVisible = !panel.classList.contains("d-none");
      panel.classList.toggle("d-none", isVisible);
      log(`📂 FAB panel '${panelId}' toggled ${isVisible ? "off" : "on"}`);
    } else if (typeof onClick === "function") {
      onClick(e);
    }
  };

  fab.addEventListener("click", currentHandler);
  log("📌 FAB click handler attached.");
}