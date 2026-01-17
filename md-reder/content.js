// Wait until marked is loaded
if (typeof marked === "undefined") {
  console.error("marked.js not loaded!");
}

// Inject sidebar
const sidebarHTML = `
<div id="md-sidebar" class="collapsed">
  <button id="sidebar-toggle">☰</button>
  <div id="sidebar-tabs">
    <button class="tab-btn active" data-tab="toc-tab">TOC</button>
    <button class="tab-btn" data-tab="files-tab">Files</button>
  </div>
  <div id="toc-tab" class="tab-content active">
    <ul id="toc-list"></ul>
  </div>
  <div id="files-tab" class="tab-content">
    <ul id="files-list"></ul>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', sidebarHTML);

// Toggle sidebar
const sidebar = document.getElementById('md-sidebar');
document.getElementById('sidebar-toggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Create main container if not exists
let mdContainer = document.getElementById('md-container');
if (!mdContainer) {
  mdContainer = document.createElement('div');
  mdContainer.id = 'md-container';
  mdContainer.style.padding = '20px';
  mdContainer.style.maxWidth = '800px';
  mdContainer.style.margin = '0 auto';
  document.body.insertBefore(mdContainer, document.body.firstChild);
}

// Markdown files
const mdFiles = [
  { name: 'Introduction.md', url: chrome.runtime.getURL('md-files/Introduction.md') },
  { name: 'Setup.md', url: chrome.runtime.getURL('md-files/Setup.md') },
  { name: 'Usage.md', url: chrome.runtime.getURL('md-files/Usage.md') }
];

const filesList = document.getElementById('files-list');
mdFiles.forEach(file => {
  const li = document.createElement('li');
  li.textContent = file.name;
  li.addEventListener('click', () => loadMarkdown(file.url));
  filesList.appendChild(li);
});

// Fetch and render markdown
function loadMarkdown(url) {
  fetch(url)
    .then(res => res.text())
    .then(md => {
      mdContainer.innerHTML = marked.parse(md);
      addHeaderIDs();
      generateTOC(md);
    }).catch(err => console.error(err));
}

// Add IDs to headers for TOC scrolling
function addHeaderIDs() {
  mdContainer.querySelectorAll('h1, h2, h3, h4').forEach(h => {
    h.id = h.textContent.replace(/\s+/g, '-');
  });
}

// Generate TOC
function generateTOC(mdContent) {
  const tocList = document.getElementById('toc-list');
  tocList.innerHTML = '';
  const lines = mdContent.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(#{1,4})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const li = document.createElement('li');
      li.textContent = text;
      li.style.marginLeft = (level - 1) * 10 + 'px';
      li.addEventListener('click', () => {
        const target = document.getElementById(text.replace(/\s+/g, '-'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
      tocList.appendChild(li);
    }
  });
}
