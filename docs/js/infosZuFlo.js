
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
    { title: "Hobby", data: "Twitch Streaming, Programmieren, Youtube" },
    { title: "Lieblingsgetränk (heiliges Getränk)", data: "Frucade (nicht gesponsort... leider ;-;)" },
    { title: "Lieblings-Programmiersprache", data: "C#" },
    { title: "Start des Streamer daseins", data: "03.07.2023" },
    { title: "Daher Streamer seit", data: null },
    { title: "Aller erstes gestreamtes Game", data: "Super Mario Bros. Wii" },
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
    { day: "Freitag (Start zwischen 20 und 22Uhr)", game: "Pokemon Karmesin DLC oder Pokemon Legenden Z-A" },
    { day: "Samstag (Start zwischen 20 und 22Uhr)", game: "Smash Bros Ultimate" },
    { day: "Sonntag (Start zwischen 20 und 22Uhr)", game: "The Legend of Zelda: Tears of The Kingdom" }
];

// Daten für die spontanen Spiele
const spontaneousGames = [
    "Pokemon Schild shiny hunt",
    "Minecraft",
    "Mario Kart World",
    "Mario Party Jomboreee",
    "Eines der Games aus den Fixen Streamtagen"
];

// Daten für ausgefallene Stream-Tage
const canceledStreams = [
    { date: "2025-11-15", reason: "vielleicht|24h Stream bei Christario" },
    { date: "2025-11-16", reason: "vielleicht|24h Stream bei Christario" },
    { date: "2025-11-22", reason: "Konzert" },
    { date: "2025-11-29", reason: "Konzert" },
    { date: "2025-10-30", reason: "Zu lange her (wird ausgeblendet)" },
];

// Daten für kleine, kurzfristige Änderungen
const smallChanges = [
    { date: "2025-11-14", reason: "Pokemon ZA mit Zelda getauscht" },
    { date: "2025-11-16", reason: "Zelda mit Pokemon ZA getauscht" },
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

/**
 * Formatiert das Datum basierend auf der zeitlichen Nähe zu heute.
 * @param {string} dateString - Das Datum im Format YYYY-MM-TT.
 * @returns {string|null} Der formatierte String oder null, wenn das Datum älter als eine Woche ist.
 */
function getDisplayDate(dateString) {
    const targetDate = new Date(dateString);
    if (isNaN(targetDate)) return dateString;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const targetTime = targetDate.getTime();
    const todayTime = today.getTime();

    const diffTime = targetTime - todayTime;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const ONE_WEEK_IN_DAYS = 7;
    const dateOptions = { weekday: 'long' };
    const fullDateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

    // 1. Ausblenden (Älter als 7 Tage)
    if (diffDays < -ONE_WEEK_IN_DAYS) {
        return null;
    }

    // 2. Letzten WOCHENTAG (Vergangenheit innerhalb 7 Tagen)
    if (diffDays < 0) {
        const lastWeekDay = targetDate.toLocaleDateString('de-DE', dateOptions);
        return `Letzten ${lastWeekDay}`;
    }

    // 3. Diesen WOCHENTAG (Gegenwart/Zukunft innerhalb 7 Tagen)
    if (diffDays >= 0 && diffDays < ONE_WEEK_IN_DAYS) {
        const thisWeekDay = targetDate.toLocaleDateString('de-DE', dateOptions);
        return `Diesen ${thisWeekDay}`;
    }

    // 4. Volles Datum (Später als 7 Tage)
    return targetDate.toLocaleDateString('de-DE', fullDateOptions);
}

/**
 * BESTIMMT DEN ANZEIGESTATUS für kleine Änderungen.
 * Zeigt nur "Heute" oder "Diesen WOCHENTAG" an.
 * @param {string} dateString - Das Datum im Format YYYY-MM-TT.
 * @returns {string|null} Der Status ("Heute", "Diesen WOCHENTAG") oder null (ausblenden).
 */
function getSmallChangeDisplayStatus(dateString) {
    const targetDate = new Date(dateString);
    if (isNaN(targetDate)) return null;

    const now = new Date();
    // Setze heute auf 00:00 Uhr
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Wochentags-Index von heute (So=0, Mo=1, ..., Sa=6)
    const todayDayIndex = today.getDay();

    // Berechnung der maximal erlaubten diffDays bis zum Ende der Woche (Sonntag=0):
    let maxDiffDaysThisWeekEnd;
    if (todayDayIndex === 0) { // Wenn heute Sonntag ist, ist die max. Differenz 0 (nur heute anzeigen)
        maxDiffDaysThisWeekEnd = 0;
    } else {
        // Berechne die Anzahl der Tage von heute bis Sonntag inkl. (z.B. Fr(5) -> 2 Tage (Sa, So))
        // (6 - todayDayIndex) ist die Differenz bis Samstag. +1 schließt Sonntag ein.
        maxDiffDaysThisWeekEnd = (6 - todayDayIndex) + 1;
    }

    // 1. Vergangen (Past) oder zu weit in der Zukunft (Länger als diese Woche): Ausblenden
    // Wir blenden aus, wenn diffDays kleiner 0 ODER größer als die erlaubte Differenz ist.
    if (diffDays < 0 || diffDays > maxDiffDaysThisWeekEnd) {
        return null;
    }

    // 2. Heute (Today)
    if (diffDays === 0) {
        return "Heute";
    }

    // 3. Diese Woche in der Zukunft (von morgen bis Sonntag)
    const thisWeekDay = targetDate.toLocaleDateString('de-DE', { weekday: 'long' });
    return `Diesen ${thisWeekDay}`;
}

// Alter berechnen und das Array aktualisieren
updateEckdaten("Alter", "Geburtstag");

// Streamer seit berechnen und das Array aktualisieren
updateEckdaten("Daher Streamer seit", "Start des Streamer daseins", " Jahren");
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

// Funktion, die die abgesagten Streams rendert
function renderCanceledStreams() {
    const container = document.getElementById('canceled-streams');
    if (!container) return;

    // Wir leeren den Container nicht sofort, da wir ihn nur leeren,
    // wenn wir entweder Einträge rendern ODER den Fallback-Text setzen.
    // Das innere HTML bleibt unberührt, bis wir eine Entscheidung getroffen haben.

    const todayTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();

    // 1. Sortierung der Daten
    const sortedCanceledStreams = canceledStreams.slice().sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        const isAFuture = dateA >= todayTime;
        const isBFuture = dateB >= todayTime;

        // Wenn beide in der Vergangenheit liegen (Vergangen ganz oben): 
        // Absteigend sortieren (neuester Tag zuerst: b - a)
        if (!isAFuture && !isBFuture) {
            return dateB - dateA;
        }

        // Wenn beide in der Zukunft liegen (Demnächst anstehend): 
        // Aufsteigend sortieren (nächster Tag zuerst: a - b)
        if (isAFuture && isBFuture) {
            return dateA - dateB;
        }

        // Wenn A Vergangenheit und B Zukunft ist: A kommt vor B (-1)
        if (!isAFuture && isBFuture) {
            return -1;
        }

        // Wenn A Zukunft und B Vergangenheit ist: A kommt nach B (1)
        if (isAFuture && !isBFuture) {
            return 1;
        }

        return 0;
    });

    // 2. Filtern und Mappen der anzuzeigenden Einträge (durch die Logik von getDisplayDate)
    const streamsToDisplay = sortedCanceledStreams.map(entry => {
        // HINWEIS: Die Funktion getDisplayDate muss im globalen Scope definiert sein!
        const displayDate = getDisplayDate(entry.date);

        if (displayDate) {
            return {
                date: displayDate,
                reason: entry.reason
            };
        }
        return null;
    }).filter(item => item !== null); // Entfernt alle 'null' Einträge


    // 3. FALLBACK-LOGIK: Wenn die Liste nach der Filterung leer ist
    if (streamsToDisplay.length === 0) {
        // Fügt den Fallback-Text als Listenelement ein
        container.innerHTML = '<li class="no-changes-message">Derzeitig ist kein Streamausfall geplant</li>';
        return;
    }

    // 4. Rendering der tatsächlichen Einträge
    container.innerHTML = '';
    streamsToDisplay.forEach(entry => {
        const li = document.createElement('li');

        // Verwenden Sie das Format "Tag: [Reason]" aus dem vorherigen Schritt
        li.innerHTML = `
            <span class="schedule-day">${entry.date}:</span>
            <span class="schedule-game">${entry.reason}</span> 
        `;
        container.appendChild(li);
    });
}

function renderSmallChanges() {
    const container = document.getElementById('changed-streams');
    if (!container) return;

    // 1. Filtern und Mappen der anzuzeigenden Einträge
    const changesToDisplay = smallChanges.map(entry => {
        const displayStatus = getSmallChangeDisplayStatus(entry.date);
        if (displayStatus) {
            return {
                status: displayStatus,
                reason: entry.reason
            };
        }
        return null;
    }).filter(item => item !== null);

    // 2. FALLBACK-LOGIK: Wenn Liste leer ist
    if (changesToDisplay.length === 0) {
        container.innerHTML = '<li class="no-changes-message">Derzeitig gibt es keine Änderungen im Streamplan</li>';
        return;
    }

    // 3. Rendering der tatsächlichen Einträge
    container.innerHTML = '';
    changesToDisplay.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="schedule-day">${entry.status}</span>
            <span class="schedule-game">Tag: ${entry.reason}</span> 
        `;
        container.appendChild(li);
    });
}

// ----------------------------------------------------
// INITIALISIERUNG
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
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
    renderCanceledStreams();
    renderSpontaneousGames();
    renderSmallChanges();
    applySequentialAnimations();
});