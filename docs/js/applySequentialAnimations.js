/* ==========================================================
* Funktion: Dynamische Erscheinungs-Animation
* ==========================================================
* Diese Funktion weist allen relevanten Elementen (z.B. .info-card, .divider)
* im .content-container einen inkrementellen, d.h. dynamischen, 
* "animation-delay" zu.
*/
function applySequentialAnimations() {
    // 1. Definiere die Basisverzögerungen und den Inkrement
    const baseDelay = 0.15; // Startverzögerung in Sekunden für das erste Content-Element
    const increment = 0.20; // Inkrementelle Verzögerung pro Element
    let currentDelay = baseDelay;

    // 2. Wähle alle animierbaren Elemente aus
    // WICHTIG: Verwende 'content-container > *' um nur die direkten Kinder 
    // des Containers zu erwischen, damit verschachtelte Elemente ignoriert werden.
    const animatableElements = document.querySelectorAll('.content-container > .info-card, .content-container > .divider');

    // 3. Optional: Verzögerung für die Kopfzeilen-Elemente (falls noch nicht gesetzt)
    // Wenn die Kopfzeilen-Elemente schon manuelle Delays haben, kann dieser Block ignoriert werden.
    // Falls du die dynamische Verzögerung auch auf die Kopfzeile anwenden möchtest:
    const headerElements = document.querySelectorAll('.header-container .profile-pic, .header-container h1');
    headerElements.forEach(el => {
        // Setze eine sehr kurze Verzögerung für die Kopfzeile
        el.style.animationDelay = '0.2s';
    });


    // 4. Gehe alle Content-Elemente durch und setze den Delay
    let previousElementWasDivider = false;

    animatableElements.forEach(element => {
        // Überprüfe, ob das aktuelle Element eine Trennlinie ist
        const isDivider = element.classList.contains('divider');

        // Regel für Trennlinien: Sie sollen GLEICHZEITIG mit dem darauf folgenden Element erscheinen.
        // Das bedeutet, sie verwenden den DELAY des *nächsten* Elements.
        // Da wir das nächste Element noch nicht kennen, wenden wir die Regel anders an:
        // Ein DIVIDER erhält den DELAY des VORHERIGEN Elements, da der DIVIDER im DOM VOR dem Element steht, 
        // mit dem er gleichzeitig erscheinen soll (aus der Perspektive des Users).
        // Wir verwenden dafür den Delay, der für das VORHERIGE info-card-Element berechnet wurde.

        if (isDivider) {
            // Eine Trennlinie verwendet den aktuellen "currentDelay" (der gerade für die vorherige info-card berechnet wurde).
            // WICHTIG: Wir inkrementieren 'currentDelay' NICHT für einen Divider, da das nächste info-card Element 
            // den gleichen Delay-Wert erhalten soll, um gleichzeitig zu erscheinen.
            element.style.animationDelay = `${currentDelay}s`;

            // Setze ein Flag, damit das nächste Element (die Info-Card) NICHT inkrementiert
            // und den gleichen Delay erhält.
            previousElementWasDivider = true;

        } else {
            // Ist das Element eine Info-Card?

            if (previousElementWasDivider) {
                // Wenn das vorherige Element ein Divider war, verwende den GLEICHEN currentDelay
                element.style.animationDelay = `${currentDelay}s`;

                // Setze Flag zurück und erhöhe den Delay FÜR DAS NÄCHSTE ELEMENT
                currentDelay += increment;
                previousElementWasDivider = false;

            } else {
                // Normaler Fall: Keine Trennlinie davor.
                // Verwende den aktuellen Delay und erhöhe ihn für das nächste Element.
                element.style.animationDelay = `${currentDelay}s`;
                currentDelay += increment;
            }
        }
    });
}

// Führe die Funktion aus, nachdem das DOM geladen wurde.
document.addEventListener('DOMContentLoaded', () => {
    applySequentialAnimations()

    // check if it is a function using another functions
    if (typeof applyRowAnimation === typeof applySequentialAnimations) applyRowAnimation();
});

// Startet die Animation und das Rendering, wenn die Seite geladen ist
window.onload = function () {
    resizeCanvas(); // Ruft die Größenanpassung auf
    backgroundAnimation(); // Startet die Hintergrundanimation
};