// scripts/main.js
import { loadPartials } from '../partials/loader.js';
import { setupToolbar } from './theme.js';
import { setupFAB } from './fab.js';
import { makeDebugConsoleDraggable } from './debug.js';
import { setupDebugToggle } from './debugHelpers.js';
import { setupBackButton } from './themeHelpers.js';
import { db } from './dbInstance.js';
import { renderSavedStories } from './storyView.js';
import { getDebug, log } from './debug.js';

async function initializeIndexPage() {
  log("✅ main.js loaded");

  await loadPartials();

  makeDebugConsoleDraggable();
  setupToolbar();
  setupDebugToggle();
  setupBackButton();

  await db.init();
  renderSavedStories();

  setupFAB({
    label: "New Story",
    onClick: async () => {
      const name = prompt("Enter a name for the new story:");
      if (!name) return;
      await db.addStory({ name, created: new Date().toISOString(),
      tools: []
        
      });
      renderSavedStories();
    }
  });
  
  const layoutToggleBtn = document.getElementById("cardLayoutToggle");
const layoutIcon = document.getElementById("cardLayoutIcon");

function updateLayoutIcon(layout) {
  if (!layoutIcon) return;

  if (layout === "tall") {
    layoutIcon.textContent = "📦"; // Tall card layout icon
  } else {
    layoutIcon.textContent = "📄"; // Wide card layout icon
  }
}

if (layoutToggleBtn) {
  layoutToggleBtn.classList.remove("d-none");

  layoutToggleBtn.addEventListener("click", () => {
    const current = localStorage.getItem("cardLayout") || "wide";
    const newLayout = current === "tall" ? "wide" : "tall";
    localStorage.setItem("cardLayout", newLayout);

    log(`🧩 Card layout toggled: ${current} ➜ ${newLayout}`);
    updateLayoutIcon(newLayout);
    renderSavedStories();
  });

  // Set icon on load
  updateLayoutIcon(localStorage.getItem("cardLayout") || "wide");
}
}
log("init index page");
initializeIndexPage();