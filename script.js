const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

const gridSize = 20;
const tileCount = 20;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let gameLoop;
let isGameStarted = false; // Track if the game has started

// Set canvas size
canvas.width = gridSize * tileCount;
canvas.height = gridSize * tileCount;

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = "#b3c4db"; // New background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#1f77b4"; // New snake color
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = "#ff7f0e"; // New food color
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Update game state
function updateGame() {
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with walls or itself
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    // Add new head to snake
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        placeFood();
    } else {
        // Remove tail
        snake.pop();
    }
}

// Place food randomly
function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

// Handle game over
function gameOver() {
    clearInterval(gameLoop);
    gameOverDiv.style.display = "block";
}

// Restart game
restartButton.addEventListener("click", () => {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    gameOverDiv.style.display = "none";
    isGameStarted = false; // Reset game start state

    // Place new food
    placeFood();

    // Draw the initial state of the game
    drawGame();
});

// Handle keyboard input
window.addEventListener("keydown", e => {
    if (!isGameStarted) {
        // Start the game loop when the first arrow key is pressed
        isGameStarted = true;
        gameLoop = setInterval(() => {
            updateGame();
            drawGame();
        }, 100);
    }

    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Initial setup
placeFood();
drawGame(); // Draw the initial state of the game
