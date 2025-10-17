const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

// Optionales Maximal-Speed-Limit
const MAX_SPEED = 0.5; // <--- leicht anpassbar für schnelle Displays

// CSS-Variablen aus :root
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
    createParticles(); // Partikelanzahl an neue Canvas-Größe anpassen
}

function createParticles() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function backgroundAnimation() {
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

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

window.addEventListener('resize', resizeCanvas);

// Initialisierung
resizeCanvas();          // Canvas-Größe und Partikel einmalig setzen
backgroundAnimation();   // Animation starten
