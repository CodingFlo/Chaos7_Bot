// **********************************************
// 1. CLIP-DATEN DEFINIEREN
// Füge hier beliebig viele Clips hinzu. Format: { id: "CLIP_SLUG", title: "Kurzbeschreibung" }
// **********************************************
const CLIP_DATA = [
    {
        id: "FilthyBoredCobraGrammarKing-XrMrD_FFIAVEPqSB",
        title: "Planung ist alles!"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/SpineySplendidSproutStinkyCheese-N4yq4gxtGU8nAXtl",
        title: "Failerino"
    },
    {
        id: "KnottyBloodyDotterelRaccAttack-je1ypczCI8oId5oG",
        title: "Timing all dente"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/TawdryExuberantOysterPJSalt-qdsVzjadyF1rPxJz",
        title: "Wer hoch fliegt. Fällt schneller"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/SlickSaltyMochaRiPepperonis-mjJoOR331LtdIs-t",
        title: "Zungenbrecher ohne Zungenbrecher"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/ProductiveTardyMageYouWHY-vdkfM9caPgkCdzHX",
        title: "Meister der Sprachen"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/PrettyPricklyCheddarBlargNaut-e7egzq435r5xwT4U",
        title: "(Das lasse ich unkommentiert)"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/FragileKitschyGarbageThisIsSparta-0G1neFvymSdAnm6O",
        title: "Meister des MLGs"
    },
    {
        id: "https://www.twitch.tv/flo_ced_cob/clip/CrazyPoliteOilCorgiDerp-EwoAFKV5oC3KZ5-F",
        title: "Vorhersagen und dennoch am Failen...."
    },
];

// 2. WICHTIGE KONSTANTEN
const CLIPS_CONTAINER_ID = "clips-list-container";

// Die Basis-Domains, die IMMER erlaubt sein sollen: localhost und deine GitHub Pages Domain.
// WICHTIG: Ersetze "DEIN-USERNAME.github.io" durch deine tatsächliche GitHub Pages URL.
const STATIC_ALLOWED_PARENTS = [
    "localhost",
    "127.0.0.1",
    "codingflo.github.io"
];

// 3. FUNKTION ZUM DYNAMISCHEN ERSTELLEN DER INFO-CARDS UND IFRAMES
function renderTwitchClips() {
    const container = document.getElementById(CLIPS_CONTAINER_ID);
    if (!container) return;

    const parentParams = STATIC_ALLOWED_PARENTS
        .map(p => `&parent=${p}`)
        .join('');

    CLIP_DATA.forEach((clip, index) => {

        // ... (Erstellung von clipCard, titleElement, wrapper) ...
        const clipCard = document.createElement('div');
        clipCard.className = 'info-card clip-card';

        const titleElement = document.createElement('h2');
        titleElement.textContent = clip.title;
        clipCard.appendChild(titleElement);

        const wrapper = document.createElement('div');
        wrapper.className = 'clip-embed-wrapper';

        // --- Loader Overlay ---
        const loaderOverlay = document.createElement('div');
        loaderOverlay.className = 'loader-overlay';
        loaderOverlay.innerHTML = '<div class="loader-spinner"></div> Clip wird geladen...';
        wrapper.appendChild(loaderOverlay);

        // --- Iframe Element ---
        const iframe = document.createElement('iframe');
        const clipId = clip.id.includes('/')
            ? clip.id.substring(clip.id.lastIndexOf('/') + 1)
            : clip.id;

        iframe.src = `https://clips.twitch.tv/embed?clip=${clipId}${parentParams}`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('scrolling', 'no');
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        wrapper.appendChild(iframe);

        clipCard.appendChild(wrapper);
        container.appendChild(clipCard);
    });
}

// 4. FUNKTION ZUR ANWENDUNG DER SEQUENTIELLEN ANIMATION
// Da die Clip-Seite keine Divider hat, können wir die Funktion vereinfachen.
function applySequentialAnimationsClips() {
    const baseDelay = 0.5; // Startverzögerung (nachdem die Info-Card über den Clips geladen wurde)
    const increment = 0.25; // Inkrementelle Verzögerung pro Clip

    // Wähle ALLE Elemente im content-container aus, die animiert werden sollen.
    // Dazu gehören die manuelle Info-Card und die dynamisch generierten Clip-Cards.
    const animatableElements = document.querySelectorAll('.content-container > .info-card');

    animatableElements.forEach((element, index) => {
        // Die Verzögerung basiert auf dem Index, beginnend mit der Basisverzögerung
        const delay = baseDelay + (index * increment);
        element.style.animationDelay = `${delay}s`;
    });
}


// 5. INITIALISIERUNG
// Das Skript muss warten, bis alle Clips gerendert sind, BEVOR es die Animationen setzt.
document.addEventListener('DOMContentLoaded', () => {
    // Zuerst die Iframes erstellen
    renderTwitchClips();

    // Dann die Animationen anwenden
    applySequentialAnimationsClips();
});