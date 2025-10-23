console.log("Content script uruchomiony");

function getResults() {
    let results = [];
    const linkContainers = document.querySelectorAll("div.yuRUbf, div.N54PNb a, div.kCrYT a");
    console.log("Znaleziono potencjalnych linków:", linkContainers.length);

    linkContainers.forEach(item => {
        const link = item.href || item.querySelector("a")?.href;
        const title = item.querySelector("h3")?.innerText || item.innerText;
        const snippetDiv = item.closest("div.N54PNb")?.querySelector("div.VwiC3b") 
                           || item.parentElement.querySelector("div.VwiC3b");
        const snippet = snippetDiv?.innerText || "";

        // pomijamy tłumaczenie strony i puste tytuły/linki
        if (link && title && !title.includes("Tłumaczenie strony")) {
            results.push({ title, url: link, snippet });
        }
    });

    // usuwanie duplikatów po URL
    results = results.filter((v,i,a) => a.findIndex(t => t.url === v.url) === i);

    console.log("Znalezione wyniki po filtrze:", results.length);
    console.log(results);

    // zapis do chrome.storage.local
    chrome.storage.local.set({ googleResults: results })
        .then(() => console.log("Wyniki zapisane w chrome.storage.local"))
        .catch(err => console.error(err));
}

function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim(); // usuwa nadmiarowe spacje i nowe linie
}

results.push({
    title: cleanText(title),
    url: link,
    snippet: cleanText(snippet)
});

// poczekaj aż strona się w pełni załaduje i wyniki dynamiczne się wyrenderują
window.addEventListener("load", () => setTimeout(getResults, 2000));
