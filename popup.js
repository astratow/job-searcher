console.log('Popup.js says hi');

// document.getElementById("exportBtn").addEventListener("click", () => {
//     chrome.storage.local.get("googleResults", (data) => {
//         const results = data.googleResults || [];
//         if(!results.length) return alert("Brak wyników do eksportu");

//         // Filtr po słowach kluczowych
//         const keywords = ["developer", "engineer", "software"];
//         const filtered = results.filter(r =>
//             keywords.some(kw => r.title.toLowerCase().includes(kw) || r.snippet.toLowerCase().includes(kw))
//         );

//         let csv = "Title,URL,Snippet\n";
//         filtered.forEach(r => {
//             csv += `"${r.title.replace(/"/g,'""')}","${r.url}","${r.snippet.replace(/"/g,'""')}"\n`;
//         });

//         const blob = new Blob([csv], {type: 'text/csv'});
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'google_results.csv';
//         a.click();
//         URL.revokeObjectURL(url);
//     });
// });
let savedResults = [];

chrome.runtime.onMessage.addListener((msg) => {
    if(msg.action === "sendResults") {
        savedResults = msg.results;
        console.log("Popup otrzymał wyniki:", savedResults.length);
    }
});

document.getElementById("exportBtn").addEventListener("click", () => {
    if(savedResults.length === 0) return alert("Brak wyników do eksportu");

    const keywords = ["developer", "engineer", "software"];
    const filtered = savedResults.filter(r =>
        keywords.some(kw => r.title.toLowerCase().includes(kw) || r.snippet.toLowerCase().includes(kw))
    );

    let csv = "Title,URL,Snippet\n";
    filtered.forEach(r => {
        csv += `"${r.title.replace(/"/g,'""')}","${r.url}","${r.snippet.replace(/"/g,'""')}"\n`;
    });

    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'google_results.csv';
    a.click();
    URL.revokeObjectURL(url);
});
