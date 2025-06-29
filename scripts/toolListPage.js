import { loadPartials } from '../partials/loader.js';
import { setupBackButton, setPageTitle } from './themeHelpers.js';
import { setupToolbar } from './theme.js';
import { setupFAB } from './fab.js';
import { db } from './dbInstance.js';
import { log, makeDebugConsoleDraggable } from './debug.js';
import { setupDebugToggle } from './debugHelpers.js';

const params = new URLSearchParams(window.location.search);
const storyName = params.get("name");
const type = params.get("type");

async function initializeToolListPage() {
  await loadPartials();
  await db.init();

  makeDebugConsoleDraggable();
  setupToolbar();
  setupDebugToggle();
  setupBackButton(`story.html?name=${encodeURIComponent(storyName)}`);
  setupFAB({
  label: "Add",
  usePanel: false,
  onClick: async () => {
    const label = `Enter ${capitalize(type)} Name`;
    const defaultValue = `${capitalize(type)} ${Date.now()}`;
    const name = prompt(label, defaultValue);

    if (!name || name.trim() === "") return;

    const newTool = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      created: new Date().toISOString(),
      storyName
    };

    const story = await db.getStory(storyName);
    if (!story) return;

    story[type] = Array.isArray(story[type]) ? [...story[type], newTool] : [newTool];
    await db.updateStory(story);

    renderTools();
  }
});

  const title = `${capitalize(type)} — ${storyName}`;
  setPageTitle(title);
  log(`📂 Loaded tool list for: ${title}`);

  renderTools();

 
}

function capitalize(str) {
  return str?.charAt(0).toUpperCase() + str.slice(1);
}

async function renderTools() {
  const container = document.getElementById("toolListArea");
  container.innerHTML = "";

  const story = await db.getStory(storyName);
  if (!story || !Array.isArray(story[type])) return;

  story[type].forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card shadow-sm";
    card.style.cursor = "pointer";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = item.name;

    const date = document.createElement("p");
    date.className = "card-text text-muted small mb-0 mt-2";
    date.textContent = `Created: ${new Date(item.created).toLocaleString()}`;

    body.appendChild(title);
    body.appendChild(date);
    card.appendChild(body);
    col.appendChild(card);
    container.appendChild(col);

    card.addEventListener("click", () => {
      const encodedName = encodeURIComponent(storyName);
      const encodedType = encodeURIComponent(type);
      const encodedId = encodeURIComponent(item.id);
      window.location.href = `storyElement.html?name=${encodedName}&type=${encodedType}&id=${encodedId}`;
    });
  });
}

initializeToolListPage();