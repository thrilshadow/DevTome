// Resolve partial URLs relative to this loader module
const baseURL = new URL('.', import.meta.url);

const inject = async (id, file, append = false) => {
  const url = new URL(file, baseURL);
  const res = await fetch(url);
  const html = await res.text();
  const mount = document.getElementById(id);

  if (append) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    while (wrapper.firstChild) {
      mount.appendChild(wrapper.firstChild);
    }
  } else {
    mount.innerHTML = html;
  }
};

export async function loadPartials() {
  // Use filenames relative to this loader module
  await inject("headerMount", "header.html");
  await inject("debugMount", "debug.html");
  await inject("fabMount", "fab.html");
  await inject("fabMount", "fabMenu.html", true); // ✅ append it
}
