(function () {
  // YouTube title (most reliable selector)
  const titleElement =
    document.querySelector("h1 yt-formatted-string") ||
    document.querySelector("meta[name='title']");

  if (!titleElement) return;

  const title =
    titleElement.innerText ||
    titleElement.getAttribute("content");

  const url = window.location.href;

  const markdown = `[${title}](${url})`;

  navigator.clipboard.writeText(markdown);
})();
