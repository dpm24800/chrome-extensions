(function () {
  // Only run on markdown-like pages
  const isMarkdown =
    document.contentType === "text/plain" ||
    location.pathname.endsWith(".md");

  if (!isMarkdown) return;

  const rawText = document.body.innerText;

  const html = marked.parse(rawText);

  document.body.innerHTML = `
    <div class="md-container">
      ${html}
    </div>
  `;
})();
