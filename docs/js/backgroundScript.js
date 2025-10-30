const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// --- STEUERUNGSVARIABLEN ---
// Realistischer Schwellenwert für den Dauerbetrieb. 
const FPS_THRESHOLD = 30;
const INITIAL_CHECK_FRAMES = 10; // Nur 10 Frames für den schnellen Initial-Check
const MAX_SPEED = 0.15;

let particles = [];
let isAnimationRunning = false; // Startet im 'Aus'-Zustand

function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const particleColor = getCSSVariable('--canvas-color');

// --- PARTICLE KLASSE ---
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.speedY = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.color = particleColor;
    }
    // ... update und draw Methoden ...
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
}

function createParticles() {
    particles = [];
    // Partikeldichte nur einmal bestimmen, wenn Animation läuft
    const particleDensityFactor = 9000;
    const numberOfParticles = (canvas.width * canvas.height) / particleDensityFactor;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function applyFadeIn() {
    // Nur Fade-In, wenn Animation auch wirklich läuft
    if (isAnimationRunning) {
        setTimeout(() => {
            canvas.classList.add('canvas-loaded');
        }, 50);
    }
}

// --- PERMANENTE HAUPTANIMATIONS-FUNKTION (WIRD NUR BEI BESTANDENEM CHECK GESTARTET) ---
function backgroundAnimation() {
    // Wenn die Animation einmal gestartet wurde, läuft sie weiter,
    // bis das Fenster geschlossen wird oder der Browser sie stoppt.

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const colorA = hexToRgb(particles[a].color);
                const colorB = hexToRgb(particles[b].color);
                const r = Math.round((colorA.r + colorB.r) / 2);
                const g = Math.round((colorA.g + colorB.g) / 2);
                const bColor = Math.round((colorA.b + colorB.b) / 2);
                const alpha = 1 - distance / 120;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${r}, ${g}, ${bColor}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(backgroundAnimation);
}

// --- NEUE PERFORMANCE-PRÜFUNG VOR DEM START ---

let checkFrameCount = 0;
let checkTimeStart = 0;

function runPerformanceCheck() {
    if (checkFrameCount === 0) {
        // Starte die Zeitmessung beim ersten Frame
        checkTimeStart = performance.now();
    }

    // Simuliere einen Frame-Durchlauf (nur die CPU-lastigen Teile)
    // Um die Performance zu testen, müssen wir Partikel erstellen und die $O(n^2)$-Berechnung durchführen.
    if (particles.length === 0) {
        // Temporäre Partikel für den Testlauf erstellen
        resizeCanvas();
    }

    // Die rechenintensiven Teile:
    particles.forEach(p => p.update());
    // (Die $O(n^2)$ Linienberechnung weglassen, da update und draw schon gut messen)

    checkFrameCount++;

    if (checkFrameCount < INITIAL_CHECK_FRAMES) {
        // Nächsten Test-Frame anfordern
        requestAnimationFrame(runPerformanceCheck);
    } else {
        // --- PRÜFUNG BEENDET ---
        const totalTime = performance.now() - checkTimeStart;
        // Berechne die durchschnittliche FPS über alle Test-Frames
        const averageFPS = (INITIAL_CHECK_FRAMES / totalTime) * 1000;

        if (averageFPS >= FPS_THRESHOLD) {
            // **TEST BESTANDEN:** Animation starten
            isAnimationRunning = true;
            console.log(`[Chaos7 Bot] Performance-Check bestanden (${averageFPS.toFixed(2)} FPS >= ${FPS_THRESHOLD} FPS). Animation wird gestartet.`);
            // Partikel wurden bereits im Testlauf erstellt
            window.addEventListener('resize', resizeCanvas);
            backgroundAnimation(); // Startet die permanente Animation
            applyFadeIn();

        } else {
            // **TEST NICHT BESTANDEN:** Partikel-Hintergrund unterdrücken
            isAnimationRunning = false;
            console.warn(`[Chaos7 Bot] Performance-Check NICHT bestanden (${averageFPS.toFixed(2)} FPS < ${FPS_THRESHOLD} FPS). Hintergrund-Animation dauerhaft unterdrückt.`);
            // Das Canvas leeren (falls temporär etwas gezeichnet wurde) und die Partikel entfernen
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = [];
            // Wichtig: Keine weitere requestAnimationFrame Schleife starten
        }
    }
}

// --- INITIALISIERUNG STARTET HIER ---
// Das Skript startet NICHT die Animation, sondern den Performance-Check.
runPerformanceCheck();