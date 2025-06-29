const inject = async (id, path, append = false) => {
  const res = await fetch(path);
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
  await inject("headerMount", "/partials/header.html");
  await inject("debugMount", "/partials/debug.html");
  await inject("fabMount", "/partials/fab.html");
  await inject("fabMenuMount", "/partials/fabMenu.html", true); // ✅ append it
}