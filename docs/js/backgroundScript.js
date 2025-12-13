const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// --- STEUERUNGSVARIABLEN ---
const FPS_THRESHOLD = 30;
const INITIAL_CHECK_FRAMES = 10;
const MAX_SPEED = 0.15;
const particleDensityFactor = 5000;

// Konstanten für die Animationslogik
const PARTICLE_ANIMATION_DURATION = 1500; // 1.5 Sekunden für Fade-In/Out
const BUFFER_ZONE_SIZE = 100; // Breite der Pufferzone in Pixeln am alten Rand
const NEW_AREA_BIAS = 0.9; // 90% Wahrscheinlichkeit, dass neue Partikel im erweiterten Bereich entstehen

let particles = [];
let isAnimationRunning = false;
let currentWidth = 0;
let currentHeight = 0;

function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const particleColor = getCSSVariable('--canvas-color');
const particleRgb = hexToRgb(particleColor); // RGB-Werte einmal speichern

// --- PARTICLE KLASSE ---
class Particle {
    constructor(x, y, isNew = false) {
        this.x = x !== undefined ? x : Math.random() * canvas.width;
        this.y = y !== undefined ? y : Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.speedY = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.color = particleColor;

        // Neu für die Animation
        this.isNew = isNew; // Startet mit 0% Deckkraft, wenn true
        this.isDead = false; // Wird bei Größenänderung gesetzt, wenn außerhalb
        this.animationStart = performance.now();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Begrenzung innerhalb der aktuellen Canvas-Größe
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        let alpha = 1;
        const timeElapsed = performance.now() - this.animationStart;

        if (this.isNew) {
            // Fade-In: Transparenz von 0 auf 1
            alpha = Math.min(1, timeElapsed / PARTICLE_ANIMATION_DURATION);
            if (alpha >= 1) {
                this.isNew = false; // Animation beendet
            }
        } else if (this.isDead) {
            // Fade-Out: Transparenz von 1 auf 0
            alpha = Math.max(0, 1 - timeElapsed / PARTICLE_ANIMATION_DURATION);
        }

        // Partikel nur zeichnen, wenn nicht komplett unsichtbar
        if (alpha > 0) {
            ctx.fillStyle = `rgba(${particleRgb.r}, ${particleRgb.g}, ${particleRgb.b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
// ------------------------------------

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function updateCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    currentWidth = canvas.width;
    currentHeight = canvas.height;
}

// Wird nur einmal initial aufgerufen, um Partikel zu füllen
function createInitialParticles() {
    updateCanvasDimensions(); // Setzt die Anfangsgröße
    const numberOfParticles = (currentWidth * currentHeight) / particleDensityFactor;
    for (let i = 0; i < numberOfParticles; i++) {
        // Starte neue Partikel ohne Fade-In, damit der initiale Zustand sofort da ist
        particles.push(new Particle());
    }
}

// Funktion zur Handhabung der Größenänderung mit Fokus auf die Bindung zu alten Partikeln
function handleResize() {
    const oldWidth = currentWidth;
    const oldHeight = currentHeight;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (oldWidth === newWidth && oldHeight === newHeight) {
        return;
    }

    // 1. Markiere Partikel, die den sichtbaren Bereich verlassen haben (Fade-Out)
    particles.forEach(p => {
        if (!p.isDead && (p.x > newWidth || p.y > newHeight || p.x < 0 || p.y < 0)) {
            p.isDead = true;
            p.animationStart = performance.now();
        }
    });

    // 2. Passe die Canvas-Größe an
    updateCanvasDimensions();

    // 3. Berechne die Anzahl der Partikel, die hinzugefügt werden müssen
    const newArea = newWidth * newHeight;
    const targetNumberOfParticles = Math.floor(newArea / particleDensityFactor);
    const particlesToCreate = Math.max(0, targetNumberOfParticles - particles.length);

    // 4. Füge die fehlenden Partikel hinzu (Fade-In) mit Fokus auf die Pufferzone
    for (let i = 0; i < particlesToCreate; i++) {
        let newX, newY;

        const hasNewRightArea = newWidth > oldWidth;
        const hasNewBottomArea = newHeight > oldHeight;

        const createInNewArea = Math.random() < NEW_AREA_BIAS;

        if (createInNewArea && (hasNewRightArea || hasNewBottomArea)) {

            // Logik zur Bestimmung des Erzeugungsortes im neuen Raum
            if (hasNewRightArea && (!hasNewBottomArea || Math.random() < 0.5)) {
                // NEUER RECHTER BEREICH:
                // X: Erzeuge Partikel bevorzugt nahe der alten Kante (oldWidth)
                const minX = oldWidth;
                const maxX = Math.min(newWidth, oldWidth + BUFFER_ZONE_SIZE);

                // Wir erzeugen 80% der Partikel in der Pufferzone (bessere Bindung)
                if (Math.random() < 0.8) {
                    newX = minX + Math.random() * (maxX - minX);
                } else {
                    // Die restlichen 20% verteilen sich über den gesamten neuen rechten Streifen
                    newX = oldWidth + Math.random() * (newWidth - oldWidth);
                }

                // Y: Zufällig über die alte Höhe
                newY = Math.random() * oldHeight;

            } else if (hasNewBottomArea) {
                // NEUER UNTERER BEREICH:
                // X: Zufällig über die neue Breite
                newX = Math.random() * newWidth;

                // Y: Erzeuge Partikel bevorzugt nahe der alten Kante (oldHeight)
                const minY = oldHeight;
                const maxY = Math.min(newHeight, oldHeight + BUFFER_ZONE_SIZE);

                if (Math.random() < 0.8) {
                    newY = minY + Math.random() * (maxY - minY);
                } else {
                    // Die restlichen 20% verteilen sich über den gesamten neuen unteren Streifen
                    newY = oldHeight + Math.random() * (newHeight - oldHeight);
                }
            } else {
                // Fallback für den seltenen Fall eines unerwarteten Größenwechsels (oder Ecken)
                newX = Math.random() * newWidth;
                newY = Math.random() * newHeight;
            }
        } else {
            // Partikel irgendwo (alte oder neue Fläche) zufällig erstellen (10% der Zeit)
            newX = Math.random() * newWidth;
            newY = Math.random() * newHeight;
        }

        // Füge das neue Partikel hinzu
        particles.push(new Particle(newX, newY, true));
    }

    console.log(`[Chaos7 Bot] Resize: ${particlesToCreate} Partikel hinzugefügt. Aktuelle Gesamtanzahl: ${particles.length}`);
}


function applyFadeIn() {
    if (isAnimationRunning) {
        setTimeout(() => {
            canvas.classList.add('canvas-loaded');
        }, 50);
    }
}

// --- PERMANENTE HAUPTANIMATIONS-FUNKTION ---
function backgroundAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();

    // Linien zwischen den Partikeln zeichnen
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const pa = particles[a];
            const pb = particles[b];

            // Wichtig: Verblassende oder einblendende Partikel nicht verbinden, um Artefakte zu vermeiden
            if (pa.isDead || pa.isNew || pb.isDead || pb.isNew) continue;

            const dx = pa.x - pb.x;
            const dy = pa.y - pb.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const alpha = 1 - distance / 120;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${particleRgb.r}, ${particleRgb.g}, ${particleRgb.b}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.stroke();
            }
        }
    }

    // Partikel aktualisieren und zeichnen
    // Rückwärts-Loop ist notwendig, um Elemente während der Iteration sicher zu entfernen
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.update();
        p.draw();

        // Partikel entfernen, die "gestorben" sind und deren Fade-Out beendet ist
        if (p.isDead && (now - p.animationStart) > PARTICLE_ANIMATION_DURATION) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(backgroundAnimation);
}

// --- PERFORMANCE-PRÜFUNG VOR DEM START  ---

let checkFrameCount = 0;
let checkTimeStart = 0;

function runPerformanceCheck() {
    if (checkFrameCount === 0) {
        checkTimeStart = performance.now();
    }

    if (particles.length === 0) {
        // Temporäre Partikel für den Testlauf erstellen
        createInitialParticles();
    }

    particles.forEach(p => p.update());

    checkFrameCount++;

    if (checkFrameCount < INITIAL_CHECK_FRAMES) {
        requestAnimationFrame(runPerformanceCheck);
    } else {
        const totalTime = performance.now() - checkTimeStart;
        const averageFPS = (INITIAL_CHECK_FRAMES / totalTime) * 1000;

        if (averageFPS >= FPS_THRESHOLD) {
            isAnimationRunning = true;
            console.log(`[Chaos7 Bot] Performance-Check bestanden (${averageFPS.toFixed(2)} FPS >= ${FPS_THRESHOLD} FPS). Animation wird gestartet.`);

            // Wichtig: Listener auf die neue Logik setzen
            window.addEventListener('resize', handleResize);
            backgroundAnimation();
            applyFadeIn();
        } else {
            isAnimationRunning = false;
            console.warn(`[Chaos7 Bot] Performance-Check NICHT bestanden (${averageFPS.toFixed(2)} FPS < ${FPS_THRESHOLD} FPS). Hintergrund-Animation dauerhaft unterdrückt.`);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = [];
        }
    }
}

// --- INITIALISIERUNG STARTET HIER  ---
document.addEventListener('DOMContentLoaded', () => {
    function runIfVisible() {
        if (document.visibilityState === 'visible') {
            runPerformanceCheck();
            document.removeEventListener('visibilitychange', runIfVisible);
        }
    }

    if (document.visibilityState === 'visible') {
        runPerformanceCheck();
    } else {
        document.addEventListener('visibilitychange', runIfVisible);
    }
});