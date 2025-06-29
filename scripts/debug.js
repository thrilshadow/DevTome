// debug.js
const DEBUG_KEY = "debugEnabled";
let debug = localStorage.getItem(DEBUG_KEY) === "true";

export function setDebug(value) {
  debug = value;
  localStorage.setItem(DEBUG_KEY, value);

  const debugConsole = document.getElementById("debugConsole");
  if (debugConsole) {
    debugConsole.style.display = value ? "block" : "none";
  }

  log(`🐞 Debug mode is ${value ? "ON" : "OFF"}`);
}

export function getDebug() {
  return debug;
}

export function log(...args) {
  if (!debug) return;

  const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(" ");
  console.log(...args);

  const debugConsole = document.getElementById("debugConsole");
  const debugMessages = document.getElementById("debugMessages");

  if (debugConsole && debugMessages) {
    const line = document.createElement("div");
    line.textContent = `📝 ${new Date().toLocaleTimeString()} — ${message}`;
    debugMessages.appendChild(line);
    debugConsole.style.display = "block";
    debugConsole.scrollTop = debugConsole.scrollHeight;
  }
}

export function makeDebugConsoleDraggable() {
  const consoleEl = document.getElementById("debugConsole");
  const headerEl = document.getElementById("debugHeader");

  let offsetX = 0, offsetY = 0, isDragging = false;

  function moveConsole(x, y) {
    consoleEl.style.left = `${x - offsetX}px`;
    consoleEl.style.top = `${y - offsetY}px`;
    consoleEl.style.right = "auto";
    consoleEl.style.bottom = "auto";
  }

  function snapToEdge() {
    const rect = consoleEl.getBoundingClientRect();
    const w = window.innerWidth;
    consoleEl.style.left = rect.left < w / 2 ? "10px" : `${w - rect.width - 10}px`;
  }

  headerEl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - consoleEl.offsetLeft;
    offsetY = e.clientY - consoleEl.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) snapToEdge();
    isDragging = false;
    document.body.style.userSelect = "";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    moveConsole(e.clientX, e.clientY);
  });

  headerEl.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    isDragging = true;
    offsetX = t.clientX - consoleEl.offsetLeft;
    offsetY = t.clientY - consoleEl.offsetTop;
  });

  document.addEventListener("touchend", () => {
    if (isDragging) snapToEdge();
    isDragging = false;
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    moveConsole(t.clientX, t.clientY);
  });
}