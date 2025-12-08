/**
 * Datenstruktur aller Projekte.
 * Die boolschen Werte geben an, in welche Kategorie das Projekt gehört.
 * @type {Array<Object>}
 */
const PROJECT_DATA = [
    // Fix-Kommende Projekte (fixKom)
    { name: "Mario & Luigi Brothership", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario Bros 2 (New verison/3DS)", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario Bros DS", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario Bros U Deluxe", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario Land", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario Land 2", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario World 2", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Plants Vs Zombies Remake", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Pokemon Karmesin", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Pokemon Legenden Z-A", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Smash Bros Ultimate", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "The Legend of Zelda: Tears of the Kingdom", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Wario Land 3", fixKom: true, geplant: false, erledigt: false, streamOnly: false, alsVideo: false },

    // Geplante Projekte (geplant)
    { name: "Mario und Rabbits Kingdom battle", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Mario und Rabbits Sparks of Hope", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Paper Mario 2", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Paper Mario Origami King", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Pokemon Legenden Arceus", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Pokemon Lets Go Pikachu", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Rayman 3", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Rayman Origin", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Wario Land 1", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Wario Land 2", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Yoshis Crafted World", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },
    { name: "Zelda Skyward sword", fixKom: false, geplant: true, erledigt: false, streamOnly: false, alsVideo: false },

    // Erledigte Projekte (erledigt)
    { name: "Bowser's Fury", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Luigi's Mansion 2", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Luigi's Mansion 3", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario 3D Land", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario 3D World", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario All-Stars", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario Bros. Wonder", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario Galaxy", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario Galaxy 2", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Mario Kart World", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario Odyssey", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario Sunshine", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Mario & Luigi: Partners in Time", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario World", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Minecraft Community Server Staffel 1", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Minecraft Community Server Staffel 2", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Mincraftario Season 1", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Pikmin 1", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Pikmin 2", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Pikmin 3", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Pikmin 4", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Pokémon Schild", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Terraria", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "The Legend of Zelda: Echoes of Wisdom", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Wonder Boy: The Dragon's Trap", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "The Legend of Zelda: Breath of the Wild", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Link's Awakening", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Luigi's Mansion 1", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "Super Mario 64", fixKom: false, geplant: false, erledigt: true, streamOnly: false, alsVideo: false },
    { name: "Super Mario 64 DS", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
    { name: "New Super Mario Bros. Wii", fixKom: false, geplant: false, erledigt: true, streamOnly: true, alsVideo: false },
];


/**
 * @function renderProjectLists
 * Iteriert durch die Projektdaten und erstellt die <ul>-Liste und <li>-Elemente
 * dynamisch für jede Sektion.
 */
function renderProjectLists() {
    // Mapping von Sektions-ID auf den entsprechenden Bool-Key im PROJECT_DATA-Objekt
    const sectionMap = {
        '#fix-kommende-projekte': 'fixKom',
        '#geplante-projekte': 'geplant',
        '#erledigte-projekte': 'erledigt',
        '#stream-only-projekte': 'streamOnly',
        '#als-video-erledigt': 'alsVideo'
    };

    // Iteriere über die Map, um jede Sektion zu rendern
    for (const [sectionId, dataKey] of Object.entries(sectionMap)) {
        const sectionElement = document.querySelector(sectionId);

        if (sectionElement) {
            // Filtere Projekte für die aktuelle Kategorie
            const projects = PROJECT_DATA.filter(project => project[dataKey]);

            // Erstelle das UL-Element
            const ulElement = document.createElement('ul');
            ulElement.classList.add('stagger');

            // --- ANPASSUNG START ---
            if (projects.length === 0) {
                // Wenn die Liste leer ist, füge das '-' Element hinzu
                const liElement = document.createElement('li');
                liElement.textContent = '-';
                ulElement.appendChild(liElement);
            } else {
                // Fülle das UL-Element mit LI-Elementen
                projects.forEach(project => {
                    const liElement = document.createElement('li');
                    liElement.textContent = project.name;
                    ulElement.appendChild(liElement);
                });
            }

            // Füge die Liste in die Sektion ein (nach dem Header)
            const existingList = sectionElement.querySelector('ul.stagger');
            if (existingList) {
                existingList.remove();
            }

            sectionElement.appendChild(ulElement);

            // Setze den --index für die Stagger-Animation
            updateStaggerIndex(ulElement);
        }
    }
}

/**
 * @function smoothScroll
 * Fängt Klicks auf die Navigationslinks ab und führt sanftes Scrollen via JS aus.
 * @param {Event} event - Das Klick-Event.
 */
function smoothScroll(event) {
    const linkElement = event.target.closest('a');

    if (linkElement && linkElement.hasAttribute('data-target')) {

        event.preventDefault();

        const targetId = linkElement.getAttribute('data-target');
        const targetElement = document.querySelector(targetId);

        let nav_offset_height = 65; // Beispiel: 65px (Navigationshöhe)

        const littleGap = 10
        const tocNav = document.querySelector('.toc');
        if (tocNav) nav_offset_height = tocNav.clientHeight + littleGap;
        else nav_offset_height = 65

        if (targetElement) {
            // 1. Berechne die Zielposition relativ zur Dokumentenoberkante.
            // targetElement.getBoundingClientRect().top gibt die Position relativ zum Viewport.
            // window.scrollY (oder pageYOffset) gibt an, wie weit die Seite gescrollt ist.
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

            // 2. Subtrahiere den Offset für das Navigationsmenü.
            const adjustedPosition = targetPosition - nav_offset_height;

            // 3. Verwende window.scrollTo für das sanfte Scrollen.
            window.scrollTo({
                top: adjustedPosition,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Sortiert eine Liste basierend auf den Listenelementen.
 * Der Sortierbutton toggelt zwischen aufsteigender und absteigender Reihenfolge.
 * @param {HTMLElement} button - Der geklickte Sortier-Button.
 */
function sortList(button) {
    const list = button.closest('section').querySelector('ul');
    // Stelle sicher, dass die Liste existiert, bevor sortiert wird
    if (!list) return;

    const items = Array.from(list.children);
    const sortDirection = button.dataset.sortDirection === 'desc' ? 'asc' : 'desc';

    // SVG Icon an Sortierrichtung anpassen
    const icon = button.querySelector('.sort-icon');
    if (icon) {
        if (sortDirection === 'asc') {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }


    // Elemente sortieren
    items.sort((a, b) => {
        const textA = a.textContent.trim().toUpperCase();
        const textB = b.textContent.trim().toUpperCase();
        if (textA < textB) return sortDirection === 'asc' ? -1 : 1;
        if (textA > textB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Vorhandene Listenelemente entfernen
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // Sortierte Elemente wieder hinzufügen
    items.forEach(item => {
        list.appendChild(item);
    });

    // Den --index für die Stagger-Animation neu setzen
    updateStaggerIndex(list);

    // Sortierrichtung aktualisieren
    button.dataset.sortDirection = sortDirection;
}

/**
 * Aktualisiert die CSS-Variable --index für jedes Listenelement,
 * um sicherzustellen, dass die Stagger-Animation auch nach dem Sortieren korrekt funktioniert.
 * @param {HTMLElement} list - Das UL-Element, dessen Kinder aktualisiert werden sollen.
 */
function updateStaggerIndex(list) {
    Array.from(list.children).forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Zuerst die Listen basierend auf den Daten rendern
    renderProjectLists();

    const tocNav = document.querySelector('.toc');
    if (tocNav) {
        tocNav.addEventListener('click', smoothScroll);
    }

    // Die Funktionen resizeCanvas und backgroundAnimation (angenommen in backgroundScript.js)
    // müssen hier verfügbar sein. Da die Definitionen fehlen, sind sie auskommentiert oder müssen 
    // in einer externen Datei (wie in deinem HTML verlinkt) verfügbar sein.
    // resizeCanvas();
    // backgroundAnimation();

    // Initiales Setzen des Index für alle Listen wird nun in renderProjectLists aufgerufen, 
    // aber wir behalten den Aufruf hier für den Fall, dass noch andere Listen existieren
    document.querySelectorAll('ul.stagger').forEach(list => {
        updateStaggerIndex(list);
    });
});