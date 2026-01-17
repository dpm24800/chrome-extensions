
document.getElementById("copyBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes("youtube.com/watch")) {
    document.getElementById("status").innerText = "Not a YouTube video page";
    return;
  }

  let title = tab.title;

  // Remove notification count like "(9) "
  title = title.replace(/^\(\d+\)\s*/, "");

  // Remove " - YouTube"
  title = title.replace(/\s*-\s*YouTube$/, "");

  const markdown = `[${title}](${tab.url})`;

  await navigator.clipboard.writeText(markdown);
  document.getElementById("status").innerText = "Copied!";
});
