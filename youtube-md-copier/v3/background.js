async function copyYouTubeMarkdown(tab) {
  if (!tab.url.includes("youtube.com/watch")) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
}

// Auto-copy on extension icon click
chrome.action.onClicked.addListener((tab) => {
  copyYouTubeMarkdown(tab);
});

// Keyboard shortcut: Ctrl + B
chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-markdown") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) copyYouTubeMarkdown(tab);
    });
  }
});
