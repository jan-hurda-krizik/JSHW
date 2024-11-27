const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameOver = false; // Indikátor konce hry
const maxCircles = 19; // Limit kuliček na obrazovce
const scoreElement = document.getElementById('score');
const circleCountElement = document.getElementById('circleCount'); // Ukazatel počtu kuliček
const startScreen = document.getElementById('startScreen'); // Úvodní obrazovka
const startButton = document.getElementById('startButton'); // Tlačítko start
const endScreen = document.getElementById('endScreen'); // Obrazovka konce hry
const finalScoreElement = document.getElementById('finalScore'); // Zobrazení konečného skóre
const countdownElement = document.getElementById('countdown'); // Zobrazení odpočtu
const restartButton = document.getElementById('restartButton'); // Tlačítko restart

let circles = [];
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

let countdown = 10; // Odpočet v sekundách
let countdownInterval; // Interval pro odpočet

// Událost pohybu myši
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Událost kliknutí
canvas.addEventListener('click', (event) => {
    if (gameOver) return; // Pokud hra skončila, neprováděj žádné akce
    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const dist = Math.hypot(circle.x - event.clientX, circle.y - event.clientY);
        if (dist < circle.radius) {
            circles.splice(i, 1); // Odstraní kruh
            updateCircleCount(); // Aktualizuje počet kuliček
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

        // Vyhýbání se myši
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
    if (gameOver) return; // Pokud hra skončila, nepřidávej kruhy
    const radius = Math.random() * 30 + 15; // Poloměr zvětšen na 15–45 pixelů
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;
    circles.push(new Circle(x, y, radius, speedX, speedY));
    updateCircleCount(); // Aktualizuje počet kuliček

    // Zkontroluj, jestli není příliš mnoho kuliček
    if (circles.length > maxCircles) {
        endGame();
    }
}

// Aktualizace počtu kuliček
function updateCircleCount() {
    circleCountElement.textContent = `Kuličky: ${circles.length}`;
}

// Konec hry
function endGame() {
    gameOver = true;
    // Zobraz endScreen
    endScreen.classList.add('active');
    finalScoreElement.textContent = `Tvé skóre je ${score}.`;
    // Nastav odpočet
    countdown = 10;
    countdownElement.textContent = countdown;
    // Spusť odpočet
    countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            resetGame();
        }
    }, 1000);
}

// Reset hry
function resetGame() {
    // Skryj endScreen
    endScreen.classList.remove('active');
    // Resetuj proměnné
    score = 0;
    scoreElement.textContent = `Skóre: ${score}`;
    gameOver = false;
    circles = [];
    updateCircleCount();
    // Zobraz startScreen
    startScreen.classList.add('active');
}

// Spuštění hry
function startGame() {
    startScreen.classList.remove('active'); // Skryj úvodní obrazovku
    // Ujisti se, že proměnné jsou resetovány
    score = 0;
    scoreElement.textContent = `Skóre: ${score}`;
    gameOver = false;
    circles = [];
    updateCircleCount();
    addCircle();
    animate();
}

// Animace
function animate() {
    if (gameOver) return; // Pokud hra skončila, ukonči animaci
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => circle.update());

    requestAnimationFrame(animate);
}

// Přidávání kruhů pravidelně
const addCircleInterval = setInterval(() => {
    addCircle();
}, 2000);

// Připojení událostí pro start a restart
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    resetGame();
});
