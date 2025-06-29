// scripts/storyPage.js

import { loadPartials } from '../partials/loader.js';
import { setupToolbar } from '../scripts/theme.js';
import { setupFAB } from '../scripts/fab.js';
import { makeDebugConsoleDraggable, log } from '../scripts/debug.js';
import { setupDebugToggle } from '../scripts/debugHelpers.js';
import { setupBackButton, setPageTitle } from '../scripts/themeHelpers.js';
import { db } from '../scripts/dbInstance.js';

let storyName = "";

async function initializeStoryPage() {
  await loadPartials();
await db.init();
  makeDebugConsoleDraggable();
  setupToolbar();
  setupDebugToggle();
  setupBackButton("../index.html");

  const params = new URLSearchParams(window.location.search);
  storyName = params.get("name");
  setPageTitle(storyName || "Story");

  setupFAB({ label: "Tools", usePanel: true });

  const fabMenuPanel = document.getElementById("fabMenuPanel");
  const toolCardArea = document.getElementById("toolCardArea");

  fabMenuPanel?.addEventListener("click", async (e) => {
    const button = e.target.closest("button[data-tool]");
    if (!button) return;

    const tool = button.getAttribute("data-tool");
    log(`🛠 FAB tool clicked: ${tool}`);
    button.disabled = true;

    addToolCard(tool);
    log("Add tool card complete");
    addToolToStory(tool);
  });

  // Load and render previously added tools
  const savedTools = await loadToolsForStory();
log("🧪 Loaded tools array:", savedTools);
savedTools.forEach(tool => addToolCard(tool));
}

function addToolCard(tool) {
  const toolCardArea = document.getElementById("toolCardArea");

  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";

  const card = document.createElement("div");
  card.className = "card shadow-sm";
  card.style.cursor = "pointer"; // makes the card look clickable

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);

  body.appendChild(title);
  card.appendChild(body);
  col.appendChild(card);
  toolCardArea?.appendChild(col);

  // ✅ Add click behavior to redirect to storyElement page
  card.addEventListener("click", () => {
    const encodedName = encodeURIComponent(storyName);
    const encodedType = encodeURIComponent(tool);
    window.location.href = `toolList.html?name=${encodedName}&type=${encodedType}`;
  });
}

async function addToolToStory(tool) {
  if (!storyName)return;
  const story = await db.getStory(storyName);
  if (!story) {
    log(`⚠️ Story not found in DB: ${storyName}`);
    return;
  }

  const tools = Array.isArray(story.tools) ? story.tools : [];
  if (!tools.includes(tool)) tools.push(tool);
  story.tools = tools;
  await db.updateStory(story);

  log(`✅ Tool "${tool}" added to story "${story.name}"`);
  log(`📦 Updated tool list: ${JSON.stringify(story.tools)}`);
}

async function loadToolsForStory() {
  if (!storyName) return [];
  const story = await db.getStory(storyName);
  if (!story) {
    log(`⚠️ No story found when loading: ${storyName}`);
    return [];
  }

  const tools = Array.isArray(story.tools) ? story.tools : [];
  log(`📤 Loaded tools for "${story.name}": ${JSON.stringify(tools)}`);
  return tools;
}


initializeStoryPage();

