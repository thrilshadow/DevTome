// theme.js
import { log } from './debug.js';

export function applyTheme(theme) {
  const isDark = theme === "dark";
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const modalPanel = document.querySelector(".modal-content.settings-panel");

  body.classList.toggle("bg-dark", isDark);
  body.classList.toggle("text-light", isDark);
  body.classList.toggle("bg-light", !isDark);
  body.classList.toggle("text-dark", !isDark);

  navbar?.classList.toggle("bg-primary", !isDark);
  navbar?.classList.toggle("bg-dark", isDark);

  if (modalPanel) {
    modalPanel.classList.toggle("settings-dark", isDark);
    modalPanel.classList.toggle("settings-light", !isDark);
  }

  localStorage.setItem("theme", theme);
  log(`🎨 Applied theme: ${theme}`);
}

export function setupToolbar() {
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));

  settingsBtn?.addEventListener("click", () => {
    log("⚙️ Settings opened");
    settingsModal.show();
  });

  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  themeToggle.checked = savedTheme === "dark";
  applyTheme(savedTheme);

  themeToggle?.addEventListener("change", () => {
    const isDark = themeToggle.checked;
    applyTheme(isDark ? "dark" : "light");
  });
}