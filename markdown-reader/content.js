// Renderer + TOC + File
if (
  document.contentType === "text/plain" ||
  location.pathname.endsWith(".md")
) {
  const raw = document.body.innerText;

  const html = marked.parse(raw, {
    highlight: (code, lang) =>
      Prism.languages[lang]
        ? Prism.highlight(code, Prism.languages[lang], lang)
        : code
  });

  document.body.innerHTML = `
    <div id="app">
      <aside id="sidebar">
        <div class="tabs">
          <button data-tab="toc" class="active">TOC</button>
          <button data-tab="files">Files</button>
        </div>
        <div id="toc" class="tab-content"></div>
        <div id="files" class="tab-content hidden"></div>
      </aside>

      <main id="content">${html}</main>
    </div>
  `;

  // --------- TOC ----------
  const toc = document.getElementById("toc");
  document.querySelectorAll("h1,h2,h3,h4").forEach(h => {
    const id = h.innerText.replace(/\s+/g, "-").toLowerCase();
    h.id = id;

    const a = document.createElement("a");
    a.textContent = h.innerText;
    a.href = `#${id}`;
    a.className = h.tagName.toLowerCase();
    toc.appendChild(a);
  });

  // --------- File Explorer ----------
  const files = document.getElementById("files");
  document.querySelectorAll("a[href$='.md']").forEach(link => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.textContent;
    files.appendChild(a);
  });

  // --------- Tabs ----------
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      document.getElementById(btn.dataset.tab).classList.remove("hidden");
    };
  });

  // --------- KaTeX ----------
  document.querySelectorAll("span.math").forEach(el => {
    katex.render(el.textContent, el, { throwOnError: false });
  });
}
