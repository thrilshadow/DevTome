import { loadPartials } from '../partials/loader.js';
import { setupBackButton, setPageTitle } from '../scripts/themeHelpers.js';
import { setupToolbar } from './theme.js';
import { setupFAB } from '../scripts/fab.js';
import { makeDebugConsoleDraggable, log } from '../scripts/debug.js';
import { setupDebugToggle } from '../scripts/debugHelpers.js';
import { db } from '../scripts/dbInstance.js';
import { createCollapsibleBox } from '../scripts/collapsible.js';

const params = new URLSearchParams(window.location.search);
const storyName = params.get("name");
const type = params.get("type");
const id = params.get("id");

async function initializeStoryElementPage() {
  await loadPartials();
  await db.init();

  makeDebugConsoleDraggable();
  setupToolbar();
  setupDebugToggle();
  setupBackButton(`toolList.html?name=${encodeURIComponent(storyName)}&type=${encodeURIComponent(type)}`);
  setupFAB({ label: "Add", usePanel: true, panelId: "fabMenuElementPanel" });

const fabPanel = document.getElementById("fabMenuElementPanel");

fabPanel?.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-tool]");
  if (!button) return;

  const tool = button.getAttribute("data-tool");
  log(`🛠 FAB menu item selected: ${tool}`);
  fabPanel.classList.add("d-none");

  // Later, hook up actual insert logic:
  alert(`You selected: ${tool}`);
});

  const story = await db.getStory(storyName);
  if (!story || !Array.isArray(story[type])) {
    log(`❌ Invalid story or type: ${storyName} / ${type}`);
    return;
  }

  const item = story[type].find(e => e.id === id);
  if (!item) {
    log(`❌ Item not found with id: ${id}`);
    return;
  }

  const shortName = truncate(item.name, 18);
const title = shortName;
setPageTitle(title);
  log(`📘 Viewing element: ${item.name} in ${storyName}`);

  
}

function populateFabMenu(options = []) {
  const panel = document.getElementById("fabMenuPanel");
  if (!panel) return;

  const grid = panel.querySelector(".d-grid");
  if (!grid) return;

  grid.innerHTML = ""; // Clear old buttons

  options.forEach(({ label, icon, value }) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.dataset.tool = value;
    btn.innerHTML = `${icon} ${label}`;
    grid.appendChild(btn);
  });
}

function capitalize(str) {
  return str?.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, maxLength = 18) {
  return str.length > maxLength ? str.slice(0, maxLength - 1) + "…" : str;
}


initializeStoryElementPage();