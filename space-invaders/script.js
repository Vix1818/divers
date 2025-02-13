const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ✅ Adapter le canvas à l'écran (iPhone et iPad)
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 500);
    canvas.height = Math.min(window.innerHeight * 0.6, 400);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ✅ Variables du jeu
const playerWidth = 40;
const playerHeight = 20;
let playerX = (canvas.width / 2) - (playerWidth / 2);
const playerSpeed = 5;
let bullets = [];
let enemies = [];
const enemyRows = 3;
const enemyCols = 6;
const enemyWidth = 40;
const enemyHeight = 30;
const enemyGap = 20;
const enemySpeed = 1;
let enemyDirection = 1;
let score = 0;
let gameOver = false;

// ✅ Générer les ennemis
function createEnemies() {
    enemies = [];
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: col * (enemyWidth + enemyGap) + 50,
                y: row * (enemyHeight + enemyGap) + 50,
                alive: true
            });
        }
    }
}
createEnemies();

// ✅ Gestion du joueur avec le clavier
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowRight" && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    } else if (event.key === " ") {
        bullets.push({ x: playerX + playerWidth / 2, y: canvas.height - 50, speed: 5 });
    }
});

// ✅ Sélection des boutons tactiles
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

// ✅ Variables pour les mouvements continus
let moveLeft = false;
let moveRight = false;

// ✅ Gestion des boutons tactiles
leftBtn.addEventListener("touchstart", () => moveLeft = true);
leftBtn.addEventListener("touchend", () => moveLeft = false);

rightBtn.addEventListener("touchstart", () => moveRight = true);
rightBtn.addEventListener("touchend", () => moveRight = false);

shootBtn.addEventListener("touchstart", () => {
    bullets.push({ x: playerX + playerWidth / 2, y: canvas.height - 50, speed: 5 });
});

// ✅ Mouvement fluide du joueur
function updateMovement() {
    if (moveLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (moveRight && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    requestAnimationFrame(updateMovement);
}
updateMovement();

// ✅ Dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(playerX, canvas.height - 50, playerWidth, playerHeight);
}

// ✅ Dessiner et gérer les tirs
function drawBullets() {
    ctx.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 10);
        bullets[i].y -= bullets[i].speed;
    }
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// ✅ Dessiner et déplacer les ennemis
function drawEnemies() {
    ctx.fillStyle = "green";
    let shiftDown = false;

    for (let enemy of enemies) {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
            enemy.x += enemySpeed * enemyDirection;

            if (enemy.x + enemyWidth >= canvas.width || enemy.x <= 0) {
                shiftDown = true;
            }
        }
    }

    if (shiftDown) {
        enemyDirection *= -1;
        for (let enemy of enemies) {
            enemy.y += enemyHeight;
            if (enemy.y + enemyHeight >= canvas.height - 50) {
                gameOver = true;
            }
        }
    }
}

// ✅ Gérer le jeu
function updateGame() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 3, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    requestAnimationFrame(updateGame);
}
updateGame();
