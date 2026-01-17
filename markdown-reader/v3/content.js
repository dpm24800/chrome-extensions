// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const raw = getMarkdownText();
  if (!raw.trim()) return; // Exit if truly empty
  renderMarkdown(raw);
});

// Function to safely extract markdown text
function getMarkdownText() {
  // GitHub / HTML wrapped Markdown
  if (document.querySelector("article")) {
    return document.querySelector("article").innerText;
  }
  // Raw markdown in <pre> (common for file:// or raw URLs)
  if (document.querySelector("pre")) {
    return document.querySelector("pre").innerText;
  }
  // Fallback to body
  return document.body.innerText || "";
}

// Main render function
function renderMarkdown(raw) {
  // Parse markdown to HTML using Marked.js
  const html = marked.parse(raw, {
    highlight: (code, lang) =>
      Prism.languages[lang] ? Prism.highlight(code, Prism.languages[lang], lang) : code
  });

  // Replace body with our layout
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

  // ---------- TOC ----------
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

  // ---------- File Explorer ----------
  const files = document.getElementById("files");
  document.querySelectorAll("a[href$='.md']").forEach(link => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.textContent || link.href.split("/").pop();
    files.appendChild(a);
  });

  // ---------- Tabs ----------
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      document.getElementById(btn.dataset.tab).classList.remove("hidden");
    };
  });

  // ---------- KaTeX Math Rendering ----------
  // Inline $...$
  const inlineMathRegex = /\$(.+?)\$/g;
  document.getElementById("content").innerHTML = document.getElementById("content").innerHTML.replace(
    inlineMathRegex,
    (match, expr) => {
      try {
        return katex.renderToString(expr, { throwOnError: false });
      } catch {
        return match;
      }
    }
  );

  // Display $$...$$
  const displayMathRegex = /\$\$(.+?)\$\$/gs;
  document.getElementById("content").innerHTML = document.getElementById("content").innerHTML.replace(
    displayMathRegex,
    (match, expr) => {
      try {
        return katex.renderToString(expr, { displayMode: true, throwOnError: false });
      } catch {
        return match;
      }
    }
  );
}
