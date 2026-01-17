document.getElementById("copyBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const title = tab.title;
  const url = tab.url;

  const markdown = `[${title}](${url})`;

  await navigator.clipboard.writeText(markdown);

  document.getElementById("status").textContent = "Copied!";
});