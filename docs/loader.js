(function () {
    const botName = "c7";
    // Basis für den Fetch-Befehl bleibt dein Server
    const _parts = ["https", "://" + "chaos7", ".ddns" + ".net:3000", `/${botName}` + "/websites/"];
    const remoteBaseUrl = _parts.join('');

    // Basis für die Link-Korrektur: Das, was gerade im Browser oben steht
    const localBaseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

    const currentFileName = window.location.pathname.split('/').pop() || "index.html";
    const targetUrl = remoteBaseUrl + currentFileName;

    async function launch() {
        try {
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const htmlContent = await response.text();

            const parser = new DOMParser();
            const remoteDoc = parser.parseFromString(htmlContent, 'text/html');

            const fixPaths = (selector, attr) => {
                remoteDoc.querySelectorAll(selector).forEach(el => {
                    const val = el.getAttribute(attr);
                    if (!val) return;

                    // 1. Navigation/Links: Wenn es ein interner Link ist, lokal auflösen
                    if (selector === 'a' && val.includes("chaos7.ddns.net")) {
                        const fileName = val.split('/').pop();
                        el.setAttribute(attr, window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + fileName);
                        return;
                    }

                    // 2. Assets (CSS, JS, Bilder): Diese MÜSSEN vom Server kommen, 
                    // da sie lokal auf deinem Test-Rechner nicht existieren.
                    if (selector !== 'a') {
                        // Wenn der Pfad relativ ist, mache ihn absolut zum Server
                        if (!/^(https?:|data:|#|\/\/)/.test(val)) {
                            // Hier erzwingen wir die absolute URL zum Remote-Server
                            el.setAttribute(attr, new URL(val, remoteBaseUrl).href);
                        }
                    }
                });
            };

            fixPaths('link', 'href');
            fixPaths('script', 'src');
            fixPaths('img', 'src');
            fixPaths('source', 'src');
            fixPaths('a', 'href');

            document.open();
            document.write(remoteDoc.documentElement.outerHTML);
            document.close();

            setTimeout(() => {
                const loader = document.querySelector('#loader, .loader, #loading-screen');
                if (loader) {
                    loader.style.display = 'none';
                    loader.style.opacity = '0';
                }
                window.dispatchEvent(new Event('load'));
            }, 500);

        } catch (err) {
            console.error("Loader Error:", err);
            document.body.innerHTML = `<div style="text-align:center; padding-top:20vh;"><h2>Fehler</h2><p>Inhalt nicht erreichbar.</p></div>`;
        }
    }

    launch();
})();