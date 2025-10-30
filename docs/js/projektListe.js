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
    const items = Array.from(list.children);
    const sortDirection = button.dataset.sortDirection === 'desc' ? 'asc' : 'desc';

    // SVG Icon an Sortierrichtung anpassen
    const icon = button.querySelector('.sort-icon');
    if (sortDirection === 'asc') {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
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
    const tocNav = document.querySelector('.toc');
    if (tocNav) {
        tocNav.addEventListener('click', smoothScroll);
    }

    resizeCanvas();
    backgroundAnimation();

    // Initiales Setzen des Index für alle Listen, um die Animation beim ersten Laden zu aktivieren
    document.querySelectorAll('ul.stagger').forEach(list => {
        updateStaggerIndex(list);
    });
});