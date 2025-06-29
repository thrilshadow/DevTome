import { db } from './dbInstance.js';
import { log } from './debug.js';

export async function renderSavedStories() {
  log("📥 Entering renderSavedStories()");

  const container = document.getElementById("contentArea");
  if (!container) {
    log("❌ Error: #contentArea not found in DOM.");
    return;
  }

  container.innerHTML = "";

  const stories = await db.getAllStories();
  log(`📚 Loaded ${stories.length} stories from DB`);

  const layout = localStorage.getItem("cardLayout") || "wide"; // get layout mode
  log(`📐 Using card layout: ${layout}`);

  if (stories.length === 0) {
    log("📭 No stories to display");
    container.innerHTML = `<p class="text-muted text-center">No stories saved yet.</p>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row gy-3";

  stories.forEach((story, index) => {
    log(`🔹 Rendering story[${index}]: ${story.name}`);

    const col = document.createElement("div");
    col.className = layout === "tall" ? "col-6 col-md-4" : "col-12";

    const card = document.createElement("div");
    card.className = `card shadow-sm story-card ${layout === "tall" ? "story-card-tall" : "story-card-wide"}`;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = story.name;

    const date = document.createElement("p");
    date.className = "card-text text-muted";
    date.textContent = `Created: ${new Date(story.created).toLocaleString()}`;

    cardBody.appendChild(title);
    cardBody.appendChild(date);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);

    card.addEventListener("click", () => {
      const encodedName = encodeURIComponent(story.name);
      const url = `story.html?name=${encodedName}`;
      log(`➡️ Redirecting to: ${url}`);
      window.location.href = url;
    });
  });

  container.appendChild(row);
  log("✅ Story list rendered");
}
