export function createCollapsibleBox(labelText = "Untitled Section") {
  const container = document.createElement("div");
  container.className = "collapsible-box card mb-3";

  const header = document.createElement("div");
  header.className = "collapsible-header d-flex align-items-center justify-content-between px-3 py-2 bg-light border-bottom";
  header.style.cursor = "pointer";

  const label = document.createElement("span");
  label.className = "fw-bold";
  label.textContent = labelText;

  const arrow = document.createElement("span");
  arrow.textContent = "▶"; // right-pointing by default

  const content = document.createElement("div");
  content.className = "collapsible-content px-3 py-2";
  content.style.display = "none";

  // Toggle behavior
  header.addEventListener("click", () => {
    const isCollapsed = content.style.display === "none";
    content.style.display = isCollapsed ? "block" : "none";
    arrow.textContent = isCollapsed ? "▼" : "▶";
  });

  header.appendChild(label);
  header.appendChild(arrow);
  container.appendChild(header);
  container.appendChild(content);

  return { container, content }; // content is exposed so other code can add to it
}