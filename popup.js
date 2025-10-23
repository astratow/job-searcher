console.log('Popup.js uruchomiony');

document.getElementById("exportBtn").addEventListener("click", async () => {
    try {
        const data = await chrome.storage.local.get("googleResults");
        const results = data.googleResults || [];

        if(!results.length) return alert("Brak wyników do eksportu");

		const keywords = ["developer", "engineer", "software", "full stack", "backend", "frontend", "programmer"];
		const filtered = results.filter(r =>
		    keywords.some(kw => r.title.toLowerCase().includes(kw) || r.snippet.toLowerCase().includes(kw))
		);
        if(!filtered.length) return alert("Brak wyników po filtrze słów kluczowych");

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
    } catch(err) {
        console.error(err);
        alert("Błąd podczas eksportu CSV");
    }
});
