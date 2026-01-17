// TOC + Toggle + Theme
(function () {
  const isMarkdown =
    document.contentType === "text/plain" ||
    location.pathname.endsWith(".md");

  if (!isMarkdown) return;

  const raw = document.body.innerText;
  const html = marked.parse(raw);

  document.body.innerHTML = `
    <div class="toolbar">
      <select id="theme">
        <option value="github">GitHub</option>
        <option value="notion">Notion</option>
        <option value="obsidian">Obsidian</option>
      </select>
      <button id="toggle">🌙</button>
    </div>

    <div class="layout">
      <aside id="toc"></aside>
      <main class="md-container">${html}</main>
    </div>
  `;

  // -------- TOC ----------
  const toc = document.getElementById("toc");
  document.querySelectorAll("h1, h2, h3").forEach(h => {
    const id = h.innerText.replace(/\s+/g, "-").toLowerCase();
    h.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = h.innerText;
    link.className = h.tagName.toLowerCase();
    toc.appendChild(link);
  });

  // -------- Theme ----------
  const themeSelect = document.getElementById("theme");
  const toggleBtn = document.getElementById("toggle");

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("md-theme", theme);
  };

  setTheme(localStorage.getItem("md-theme") || "github");

  themeSelect.value = localStorage.getItem("md-theme") || "github";
  themeSelect.onchange = e => setTheme(e.target.value);

  // -------- Dark / Light ----------
  toggleBtn.onclick = () => {
    document.body.classList.toggle("light");
    toggleBtn.textContent =
      document.body.classList.contains("light") ? "🌞" : "🌙";
  };
})();
