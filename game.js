const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
const scoreElement = document.getElementById('score');

let circles = [];
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// Událost pohybu myši
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Událost kliknutí
canvas.addEventListener('click', (event) => {
    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const dist = Math.hypot(circle.x - event.clientX, circle.y - event.clientY);
        if (dist < circle.radius) {
            circles.splice(i, 1); // Odstraní kruh
            score++;
            scoreElement.textContent = `Skóre: ${score}`;
        }
    }
});

// Třída pro kruhy
class Circle {
    constructor(x, y, radius, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Pohyb kruhu
        this.x += this.speedX;
        this.y += this.speedY;

        // Vyhýbání se myši (pomalejší)
        const dist = Math.hypot(this.x - mouse.x, this.y - mouse.y);
        if (dist < 150) { // Vzdálenost detekce
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            this.x += Math.cos(angle) * 1.5; // Pomalý únik
            this.y += Math.sin(angle) * 1.5;
        }

        // Náraz na okraje
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.speedX *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.speedY *= -1;

        this.draw();
    }
}

// Přidání kruhů
function addCircle() {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const speedX = (Math.random() - 0.5) * 2; // Pomalý pohyb
    const speedY = (Math.random() - 0.5) * 2;
    circles.push(new Circle(x, y, radius, speedX, speedY));
}

// Animace
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => circle.update());

    requestAnimationFrame(animate);
}

// Přidávání kruhů pravidelně
setInterval(() => {
    addCircle();
}, 2000);

// Spuštění hry
addCircle();
animate();
//test