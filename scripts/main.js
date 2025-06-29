// scripts/main.js
import { loadPartials } from '../partials/loader.js';
import { setupToolbar } from './theme.js';
import { setupFAB } from './fab.js';
import { makeDebugConsoleDraggable, log } from './debug.js';
import { setupDebugToggle } from './debugHelpers.js';
import { setupBackButton } from './themeHelpers.js';
import { db } from './dbInstance.js';
import { renderSavedStories } from './storyView.js';

log("🛫 init index page");

async function initializeIndexPage() {
  log("✅ main.js loaded");

  await loadPartials();
  log("📦 Partials loaded");

  makeDebugConsoleDraggable();
  log("🧲 Debug console activated");

  setupToolbar();
  log("🧰 Toolbar setup complete");

  setupDebugToggle();
  log("🎛 Debug toggle ready");

  setupBackButton();
  log("🔙 Back button initialized");

  await db.init();
  log("💾 Database initialized");

  renderSavedStories();
  log("📄 Called renderSavedStories()");
  
  log("🔍 FAB exists:", document.getElementById("fab"));
  setupFAB({
    label: "New Story",
    onClick: async () => {
      const name = prompt("📘 Enter a name for the new story:");
      if (!name) {
        log("❌ Story creation cancelled — no name provided");
        return;
      }
      log(`➕ Creating new story: ${name}`);
      await db.addStory({
        name,
        created: new Date().toISOString(),
        tools: []
      });
      log(`✅ Story "${name}" added`);
      renderSavedStories();
      log("🔄 Re-rendered stories after add");
    }
  });

  log("✨ FAB setup complete");

  const layoutToggleBtn = document.getElementById("cardLayoutToggle");
  const layoutIcon = document.getElementById("cardLayoutIcon");

  function updateLayoutIcon(layout) {
    if (!layoutIcon) {
      log("⚠️ Layout icon not found");
      return;
    }

    if (layout === "tall") {
      layoutIcon.textContent = "📦";
    } else {
      layoutIcon.textContent = "📄";
    }

    log(`📐 Updated layout icon to: ${layout}`);
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
    const defaultLayout = localStorage.getItem("cardLayout") || "wide";
    updateLayoutIcon(defaultLayout);
    log(`🔧 Layout toggle initialized — default: ${defaultLayout}`);
  } else {
    log("⚠️ Layout toggle button not found");
  }
}

initializeIndexPage();
