import { db } from './dbInstance.js';

export async function renderSavedStories() {
  const container = document.getElementById("contentArea");
  container.innerHTML = "";

  const stories = await db.getAllStories();
  const layout = localStorage.getItem("cardLayout") || "wide"; // get layout mode

  if (stories.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">No stories saved yet.</p>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row gy-3";

  stories.forEach((story) => {
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
      window.location.href = `pages/story.html?name=${encodedName}`;
    });
  });

  container.appendChild(row);
}
