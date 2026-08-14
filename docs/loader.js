(function () {
    // 1. Verschleierte Basis-Konfiguration für den anderen Bot
    const _parts = [
        "https",
        "://" + "chaos7",
        ".ddns" + ".net:3000",
        "/c7" + "/websites/"
    ];
    const baseUrl = _parts.join('');

    // 2. Automatische Erkennung des aktuellen Dateinamens
    const currentFileName = window.location.pathname.split('/').pop() || "index.html";

    const targetUrl = baseUrl + currentFileName;

    async function launch() {
        try {
            const response = await fetch(targetUrl);

            if (!response.ok) {
                throw new Error(`Server antwortet mit Status ${response.status}`);
            }

            const htmlContent = await response.text();

            // DOM vorbereiten
            const parser = new DOMParser();
            const remoteDoc = parser.parseFromString(htmlContent, 'text/html');

            // 3. Asset- und Link-Pfad-Korrektur
            const fixPaths = (selector, attr) => {
                remoteDoc.querySelectorAll(selector).forEach(el => {
                    const val = el.getAttribute(attr);
                    if (!val) return;

                    // Absolute Priorität: Wenn es ein a-Tag ist und auf infosZuFlo.html verweist -> Sofort erzwingen!
                    if (selector === 'a' && val.includes("infosZuFlo.html")) {
                        el.setAttribute('href', "https://codingflo.github.io/Chaos7_Bot/infosZuFlo.html");
                        return; // Direkt zum nächsten Element springen
                    }

                    // Für alle anderen URLs, die mit http/https/data beginnen (außer obige Ausnahme), abbrechen
                    if (/^(https?:|data:|#|\/\/)/.test(val)) return;

                    // Relative Pfade für Assets oder andere Links korrigieren
                    if (selector === 'a') {
                        const fileName = val.split('/').pop();
                        el.setAttribute(attr, baseUrl + fileName);
                    } else {
                        el.setAttribute(attr, new URL(val, baseUrl).href);
                    }
                });
            };

            fixPaths('link', 'href');
            fixPaths('script', 'src');
            fixPaths('img', 'src');
            fixPaths('source', 'src');
            fixPaths('a', 'href');

            // 4. Seite komplett ersetzen
            document.open();
            document.write(remoteDoc.documentElement.outerHTML);
            document.close();

        } catch (err) {
            console.error("Loader Error:", err);
            document.body.innerHTML = `
                <div style="text-align:center; font-family:sans-serif; color:#555; padding-top:20vh;">
                    <h2 style="color:#09f;">Inhalt konnte nicht geladen werden</h2>
                    <p>${currentFileName} auf dem Remote-Server nicht erreichbar.</p>
                </div>`;
        }
    }

    launch();
})();