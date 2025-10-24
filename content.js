console.log("Content script started");

function getResults() {
  let results = [];
  const linkContainers = document.querySelectorAll(
    "div.yuRUbf, div.N54PNb a, div.kCrYT a"
  );
  console.log("Potential links found:", linkContainers.length);

  linkContainers.forEach((item) => {
    const link = item.href || item.querySelector("a")?.href;
    const title = item.querySelector("h3")?.innerText || item.innerText;
    const snippetDiv =
      item.closest("div.N54PNb")?.querySelector("div.VwiC3b") ||
      item.parentElement.querySelector("div.VwiC3b");
    const snippet = snippetDiv?.innerText || "";

    // skip page translation and empty titles/links
    if (link && title && !title.includes("Tłumaczenie strony")) {
      results.push({ title, url: link, snippet });
    }
  });

  // remove duplicates based on URL
  results = results.filter(
    (v, i, a) => a.findIndex((t) => t.url === v.url) === i
  );

  console.log("Found results after filtering:", results.length);
  console.log(results);

  // save to chrome.storage.local
  chrome.storage.local
    .set({ googleResults: results })
    .then(() => console.log("Results saved to chrome.storage.local"))
    .catch((err) => console.error(err));
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim(); // delete redundant spaces and new lines
}

results.push({
  title: cleanText(title),
  url: link,
  snippet: cleanText(snippet),
});
// wait for the page to fully load and dynamic results to render
window.addEventListener("load", () => setTimeout(getResults, 2000));
