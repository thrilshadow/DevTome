import { getDebug, setDebug } from './debug.js';

export function setupDebugToggle() {
  const toggle = document.getElementById("debugToggle");
  if (toggle) {
    toggle.checked = getDebug();
    toggle.addEventListener("change", (e) => setDebug(e.target.checked));
  }
}