const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// --- LAG-METER UND STEUERUNGSVARIABLEN ---
const FPS_THRESHOLD = 30; // Ziel-FPS: Unter diesem Wert wird die Animation gestoppt
const MEASUREMENT_INTERVAL = 30; // Anzahl der Frames für die durchschnittliche Messung
let frameCount = 0;
let lastFrameTime = performance.now();
let fpsHistory = [];
let isAnimationRunning = true; // Steuerung der Animation

// --- BESTEHENDER CODE ---
let particles = [];
const MAX_SPEED = 0.15;

function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const particleColor = getCSSVariable('--canvas-color');

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.speedY = (Math.random() * MAX_SPEED * 2) - MAX_SPEED;
        this.color = particleColor;
    }

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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
}

function createParticles() {
    particles = [];
    // Reduziere die Partikelanzahl bei schlechter Performance
    const particleDensityFactor = isAnimationRunning ? 9000 : 15000;
    const numberOfParticles = (canvas.width * canvas.height) / particleDensityFactor;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// --- HAUPTANIMATIONS-FUNKTION MIT LAG-PRÜFUNG ---
function backgroundAnimation(currentTime) {
    // Nur weitermachen, wenn die Animation laufen soll
    if (!isAnimationRunning) {
        // Falls die Animation gestoppt ist, nur einen leeren Frame anfordern
        // um theoretisch wieder starten zu können, falls sich die Performance bessert.
        requestAnimationFrame(backgroundAnimation);
        return;
    }

    // --- FPS-MESSUNG START ---
    const delta = currentTime - lastFrameTime;
    const currentFPS = 1000 / delta;
    lastFrameTime = currentTime;

    fpsHistory.push(currentFPS);
    frameCount++;

    if (frameCount >= MEASUREMENT_INTERVAL) {
        const averageFPS = fpsHistory.reduce((a, b) => a + b) / fpsHistory.length;

        // Wenn die durchschnittliche FPS zu niedrig ist, stoppe die Animation
        if (averageFPS < FPS_THRESHOLD) {
            console.warn(`[Chaos7 Bot] Performance zu niedrig (${averageFPS.toFixed(2)} FPS < ${FPS_THRESHOLD} FPS). Hintergrund-Animation gestoppt.`);
            isAnimationRunning = false;
            // Canvas leeren, um Ressourcen freizugeben
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Optional: Class entfernen, um den statischen Zustand zu signalisieren
            canvas.classList.remove('canvas-loaded');

            // Partikel neu erstellen, um Ressourcen zu sparen (z.B. kleinere Anzahl)
            createParticles();
            // Wichtig: requestAnimationFrame wird unten wieder aufgerufen, stoppt aber hier durch das "isAnimationRunning" Flag im nächsten Frame

        } else {
            // FPS-Historie zurücksetzen
            fpsHistory = [];
            frameCount = 0;
        }
    }
    // --- FPS-MESSUNG ENDE ---

    // --- ANIMATIONS-LOGIK (WIE VORHER) ---
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

function applyFadeIn() {
    // Kurze Verzögerung von 50ms, um sicherzustellen, dass das Canvas im DOM initialisiert ist.
    setTimeout(() => {
        if (isAnimationRunning) { // Nur Fade-In, wenn Animation auch wirklich läuft
            canvas.classList.add('canvas-loaded');
        }
    }, 50);
}

window.addEventListener('resize', resizeCanvas);

// Initialisierung
resizeCanvas(); // Canvas-Größe und Partikel einmalig setzen
backgroundAnimation(performance.now()); // Animation starten und Startzeit übergeben
applyFadeIn();