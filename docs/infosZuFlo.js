
function applySequentialAnimations() {
    // 1. Definiere die Basisverzögerungen und den Inkrement
    const baseDelay = 0.1; // Startverzögerung in Sekunden für das erste Content-Element
    const increment = 0.25; // Inkrementelle Verzögerung pro Element
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

/**
 * Berechnet das aktuelle Alter basierend auf einem Geburtsdatum im Format TT.MM.JJJJ.
 * @param {string} dateString - Das Geburtsdatum im Format "TT.MM.JJJJ".
 * @returns {number|string} Das berechnete Alter als Zahl oder eine Fehlermeldung als String.
 */
function berechneAlter(dateString) {
    // Überprüfung und Aufspaltung des Datums (TT.MM.JJJJ)
    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (!match) {
        return "Ungültiges Datumsformat";
    }

    // ACHTUNG: JavaScript Monat ist 0-basiert (Monat - 1)
    const [_, tag, monat, jahr] = match;
    const geburtsdatum = new Date(jahr, monat - 1, tag);
    const heute = new Date();
    const heuteUTC = Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate());
    const geburtsdatumUTC = Date.UTC(geburtsdatum.getFullYear(), geburtsdatum.getMonth(), geburtsdatum.getDate());

    // Berechnung der Differenz in Millisekunden
    const diffMs = heuteUTC - geburtsdatumUTC;

    // Ungefähre Umrechnung in Jahre (365.25 Tage pro Jahr)
    const jahre = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    // Der Floor-Wert ist das Alter
    return Math.floor(jahre);
}

// ----------------------------------------------------
// CODE FÜR DEN DYNAMISCHEN STREAMPLAN und co
// ----------------------------------------------------

// Eckdaten
const eckDaten = [
    { title: "Geburtstag", data: "19.01.2005" },
    { title: "Alter", data: null },
    { title: "Herkunftsland", data: "Österreich" },
    { title: "Hobby", data: "Twitch Streaming, Programmieren, YT" },
    { title: "Lieblingsgetränk (heiliges Getränk)", data: "Frucade" },
    { title: "Lieblings-Programmiersprache", data: "C#" },
    { title: "Start des Streamer daseins", data: "03.07.2023" },
    { title: "Daher Streamer seit", data: null },
    { title: "Aller erstes gestreamtes Game", data: "Mario Bros Wii" },
    { title: "Lieblings-Game-Genre", data: "Open World, 3D Plattformer, Jump'n'Run" },
    { title: "Lieblings-Farbe", data: "Rot (erkennt man definitiv nicht :P)" },
    { title: "Bevorzugte Streaming Software", data: "OBS" },
];

// Daten für das Setup/Hardware
const hardwareSetup = [
    { title: "Hauptprozessor (CPU)", data: "AMD Ryzen 9 7900X" },
    { title: "Grafikkarte (GPU)", data: "NVIDIA GeForce RTX 4070TI" },
    { title: "Capture Card", data: "Elgato 4k pro" },
    { title: "Arbeitsspeicher (RAM)", data: "128 GB DDR5 5200MHz" },
    { title: "Hauptmonitor", data: "Asus TUF Gaming (165Hz übertaktet)" },
    { title: "2. Monitor", data: "Samsung Odyssey (165Hz)" },
    { title: "3. Monitor", data: "Alter Fernseher (mein Ernst xD)" },
    { title: "Mikrofon", data: "Elgate Wave 3" },
    { title: "Kamera", data: "Elgato Webcam" },
    { title: "Headset", data: "ROG Delta II" },
    { title: "Tastatur", data: "Corsair K100" },
    { title: "Maus", data: "ROG Pugio II" },
];

// Daten für den Streamplan
const streamSchedule = [
    { day: "Montag (Spontan)", game: "*" },
    { day: "Dienstag (Spontan)", game: "*" },
    { day: "Mittwoch (Spontan)", game: "*" },
    { day: "Donnerstag (Spontan)", game: "*" },
    { day: "Freitag (Start zwischen 20 und 22Uhr)", game: "Pokemon Karmesin DLC/Pokemon Legenden Z-A" },
    { day: "Samstag (Start zwischen 20 und 22Uhr)", game: "Mario und Luigi: Brothership" },
    { day: "Sonntag (Start zwischen 20 und 22Uhr)", game: "TOTK oder Smash Bros Ultimate" }
];

// Daten für die spontanen Spiele
const spontaneousGames = [
    "Pokemon Schild shiny hunt",
    "Minecraft",
    "Mario Kart World",
    "Mario Party Jomboreee",
    "Eines der Games aus den Fixen Streamtagen"
];

// ----------------------------------------------------
// DATENVERARBEITUNG
// ----------------------------------------------------

/**
 * Helper-Funktion zum Suchen und Aktualisieren der Eckdaten.
 * @param {string} title - Der Titel des zu aktualisierenden Eintrags.
 * @param {string} sourceTitle - Der Titel des Eintrags, der das Quelldatum enthält.
 * @param {string} suffix - Optionaler Suffix für den berechneten Wert (z.B. " Jahren").
 */
function updateEckdaten(title, sourceTitle, suffix = "") {
    const sourceEntry = eckDaten.find(item => item.title === sourceTitle);
    const targetEntry = eckDaten.find(item => item.title === title);

    if (sourceEntry && targetEntry && sourceEntry.data) {
        const calculatedValue = berechneAlter(sourceEntry.data);
        targetEntry.data = calculatedValue + suffix;
    }
}

// Alter berechnen und das Array aktualisieren
updateEckdaten("Alter", "Geburtstag");

// Streamer seit berechnen und das Array aktualisieren
updateEckdaten("Streamer seit", "Start des Streamer daseins", " Jahren");


// ----------------------------------------------------
// RENDERING-FUNKTIONEN
// ----------------------------------------------------

// Funktion, die die Eckdaten rendert
function renderEckdaten() {
    const container = document.getElementById('eckdaten-container');
    if (!container) return;
    container.innerHTML = '';
    eckDaten.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'schedule-entry';
        entryDiv.innerHTML = `
                <span class="schedule-day">${entry.title}</span>
                <span class="schedule-game">${entry.data}</span>
            `;
        container.appendChild(entryDiv);
    });
}

// Funktion, die das Setup/Hardware rendert (NEU)
function renderSetup() {
    const container = document.getElementById('setup-container');
    if (!container) return;

    container.innerHTML = '';

    hardwareSetup.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'schedule-entry'; // Wiederverwendung des Layout-Styles
        entryDiv.innerHTML = `
                <span class="schedule-day">${entry.title}</span>
                <span class="schedule-game">${entry.data}</span>
            `;
        container.appendChild(entryDiv);
    });
}

// Funktion, die den Streamplan rendert
function renderSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;
    container.innerHTML = '';
    streamSchedule.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'schedule-entry';
        entryDiv.innerHTML = `
                <span class="schedule-day">${entry.day}</span>
                <span class="schedule-game">${entry.game}</span>
            `;
        container.appendChild(entryDiv);
    });
}

// Funktion, die die spontanen Spiele rendert
function renderSpontaneousGames() {
    const container = document.getElementById('spontaneous-games-container');
    if (!container) return;
    container.innerHTML = '';
    spontaneousGames.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game;
        container.appendChild(li);
    });
}

// ----------------------------------------------------
// INITIALISIERUNG
// ----------------------------------------------------

// Startet die Animation und das Rendering, wenn die Seite geladen ist
window.onload = function () {
    // Prüfen, ob die Funktionen existieren (für backgroundScript.js)
    if (typeof resizeCanvas === 'function') {
        resizeCanvas();
    }
    if (typeof backgroundAnimation === 'function') {
        backgroundAnimation();
    }

    renderEckdaten();
    renderSetup();
    renderSchedule();
    renderSpontaneousGames();
    applySequentialAnimations()
};