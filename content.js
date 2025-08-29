// content.js
// const jobTitle = document.querySelector('h1')?.innerText || 'Unknown Title';
// const companyName = document.querySelector('.company')?.innerText || window.location.hostname;

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "getPageInfo") {
//     sendResponse({
//       title: jobTitle,
//       company: companyName,
//       url: window.location.href
//     });
//   }
// });

console.log("Content script uruchomiony");

// // Funkcja do pobrania wyników
// function getResults() {
//     let results = [];

//     // alternatywne selektory dla linków i tytułów
//     const linkContainers = document.querySelectorAll(
//         "div.yuRUbf, div.N54PNb a, div.kCrYT a"
//     );

//     console.log("Znaleziono potencjalnych linków:", linkContainers.length);

//     linkContainers.forEach((item, index) => {
//         const link = item.href || item.querySelector("a")?.href;
//         const title = item.querySelector("h3")?.innerText || item.innerText;
//         const snippetDiv = item.closest("div.N54PNb")?.querySelector("div.VwiC3b") 
//                            || item.parentElement.querySelector("div.VwiC3b");
//         const snippet = snippetDiv?.innerText || "";

//         console.log(`#${index} Link:`, link, "Title:", title, "Snippet:", snippet);

//         if (link && title) {
//             results.push({ title, url: link, snippet });
//         }
//     });

//     console.log("Znalezione wyniki:", results.length);
//     console.log(results);

//     // zapis do chrome.storage.local
//     chrome.storage.local.set({ googleResults: results }, () => {
//         console.log("Wyniki zapisane w chrome.storage.local");
//     });
// }

// // Poczekaj, aż strona w pełni się załaduje
// window.addEventListener("load", () => {
//     // czasami wyniki ładują się dopiero po 1–2 sekundach
//     setTimeout(getResults, 2000);
// });

function getResults() {
    let results = [];

    const linkContainers = document.querySelectorAll("div.yuRUbf, div.N54PNb a, div.kCrYT a");
    console.log("Znaleziono potencjalnych linków:", linkContainers.length);

    linkContainers.forEach((item, index) => {
        const link = item.href || item.querySelector("a")?.href;
        const title = item.querySelector("h3")?.innerText || item.innerText;
        const snippetDiv = item.closest("div.N54PNb")?.querySelector("div.VwiC3b") 
                           || item.parentElement.querySelector("div.VwiC3b");
        const snippet = snippetDiv?.innerText || "";

        if(link && title && !title.includes("Tłumaczenie strony")) {
            results.push({ title, url: link, snippet });
        }

        console.log(`#${index} Link:`, link, "Title:", title, "Snippet:", snippet);
    });

    console.log("Znalezione wyniki:", results.length);
    console.log(results);

    // wysyłamy wyniki do popup.js
    chrome.runtime.sendMessage({ action: "sendResults", results });
}

window.addEventListener("load", () => setTimeout(getResults, 2000));
