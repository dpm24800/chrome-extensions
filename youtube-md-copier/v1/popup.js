document.getElementById("copyBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes("youtube.com/watch")) {
    document.getElementById("status").innerText = "Not a YouTube video page";
    return;
  }

  const title = tab.title.replace(" - YouTube", "");
  const markdown = `[${title}](${tab.url})`;

  await navigator.clipboard.writeText(markdown);
  document.getElementById("status").innerText = "Copied!";
});
