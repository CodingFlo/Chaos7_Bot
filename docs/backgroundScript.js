// JavaScript für den animierten Hintergrund und die dynamischen Inhalte
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = {
    x: undefined,
    y: undefined
};

// Partikel-Klasse für die Animation
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1; // Größe der Partikel
        this.speedX = Math.random() * 1 - 0.5; // Geschwindigkeit in X-Richtung
        this.speedY = Math.random() * 1 - 0.5; // Geschwindigkeit in Y-Richtung
    }

    // Methode zum Bewegen der Partikel
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Partikel am Rand umkehren
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    // Methode zum Zeichnen der Partikel
    draw() {
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Passt die Canvas-Größe an die Fenstergröße an
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles(); // Partikel bei jeder Größenänderung neu erstellen
}

// Erstellt die Partikel
function createParticles() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

// Haupt-Animations-Loop
function backgroundAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Linien zwischen nahen Partikeln zeichnen
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 51, 51, ${1 - distance / 120})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }

    // Partikel aktualisieren und zeichnen
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(backgroundAnimation);
}

window.addEventListener('resize', resizeCanvas);