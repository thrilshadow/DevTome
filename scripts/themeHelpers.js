// scripts/themeHelpers.js
export function setupBackButton(target = "../index.html") {
  const backBtn = document.getElementById("backBtn");

  if (!backBtn) return;

  // Only hide the back button on index.html
  const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
  if (isIndex) {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "inline-block";
    backBtn.addEventListener("click", () => {
      window.location.href = target;
    });
  }
}

export function setPageTitle(title) {
  const titleEl = document.getElementById("storyTitle");
  if (titleEl && title) {
    titleEl.textContent = title;
    document.title = title;
  }
}