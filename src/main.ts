const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

const nextBlockCanvas = document.getElementById(
  "nextBlockCanvas"
) as HTMLCanvasElement;
const nextContext = nextBlockCanvas.getContext("2d")!;

const scoreBoard = document.getElementById("scoreBoard") as HTMLElement;

const grid = 30;
const rows = 18;
const cols = 9;
const nextBlockGrid = 30;
const nextBlockSize = 5;

const colors = [
  "red",
  "blue",
  "purple",
  "teal",
  "green",
  "orange",
  "brown",
  "gold",
];

const shapes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 1],
    [1, 1, 1],
  ], // U
];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

let board: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPiece: Piece;
let nextPiece: Piece;

let dropStart = performance.now();
let dropInterval = 500;
let score = 0;

const lockDelay = 300; // 0.3秒間固定猶予
let lockStart: number | null = null; // 固定猶予開始時間

function updateScore(points: number) {
  score += points;
  scoreBoard.innerText = `Score: ${score}`;
}

function resetGame() {
  score = 0;
  updateScore(0);
  board = Array.from({ length: rows }, () => Array(cols).fill(0));
  initializePieces();
}

function gameOver() {
  alert("Game Over!");
  resetGame();
}

function drawSquare(
  x: number,
  y: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  size: number
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
  ctx.strokeStyle = "white";
  ctx.strokeRect(x * size, y * size, size, size);
}

function drawPiece(piece: Piece, ctx: CanvasRenderingContext2D, size: number) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawSquare(piece.x + x, piece.y + y, piece.color, ctx, size);
      }
    });
  });
}

function drawBoard() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col]) {
        drawSquare(col, row, colors[board[row][col] - 1], context, grid);
      }
    }
  }
}

function drawNextPiece() {
  nextContext.clearRect(0, 0, nextBlockCanvas.width, nextBlockCanvas.height);
  const offsetX = (nextBlockSize - nextPiece.shape[0].length) / 2;
  const offsetY = (nextBlockSize - nextPiece.shape.length) / 2;
  const nextPieceCentered: Piece = { ...nextPiece, x: offsetX, y: offsetY };
  drawPiece(nextPieceCentered, nextContext, nextBlockGrid);
}

function rotatePiece() {
  const rotatedShape = currentPiece.shape[0].map((_, index) =>
    currentPiece.shape.map((row) => row[index]).reverse()
  );
  const backup = currentPiece.shape;
  currentPiece.shape = rotatedShape;
  if (collision()) {
    currentPiece.shape = backup;
  }
}

function movePiece(dx: number) {
  currentPiece.x += dx;
  if (collision()) {
    currentPiece.x -= dx; // 衝突している場合は移動をキャンセル
  }
}

function clearLines() {
  let linesCleared = 0;
  for (let y = rows - 1; y >= 0; y--) {
    if (board[y].every((value) => value !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(cols).fill(0));
      y++;
      linesCleared++;
    }
  }
  if (linesCleared > 0) {
    const points = [0, 100, 300, 500, 800][linesCleared];
    updateScore(points);
  }
}

function hardDrop() {
  while (!collision()) {
    currentPiece.y += 1;
  }
  currentPiece.y -= 1;
  lockStart = performance.now(); // ハードドロップ後も0.5秒間猶予を設定
  dropPiece(); // 通常の落下処理に任せる
}

function randomPiece(): Piece {
  const index = Math.floor(Math.random() * shapes.length);
  const shape = shapes[index];
  const startX = Math.floor((cols - shape[0].length) / 2);
  return { shape, color: colors[index], x: startX, y: 0 };
}
function dropPiece() {
  currentPiece.y += 1;
  if (collision()) {
    currentPiece.y -= 1;
    if (lockStart === null) {
      lockStart = performance.now();
    } else if (performance.now() - lockStart >= lockDelay) {
      placePiece();
      clearLines();
      currentPiece = nextPiece;
      nextPiece = randomPiece();
      drawNextPiece();
      lockStart = null;
      if (collision()) {
        gameOver();
      }
    }
  } else {
    lockStart = null;
  }
}

function collision(): boolean {
  return currentPiece.shape.some((row, y) =>
    row.some(
      (value, x) =>
        value &&
        (currentPiece.x + x < 0 ||
          currentPiece.x + x >= cols ||
          currentPiece.y + y >= rows ||
          board[currentPiece.y + y][currentPiece.x + x])
    )
  );
}

function placePiece() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[currentPiece.y + y][currentPiece.x + x] =
          colors.indexOf(currentPiece.color) + 1;
      }
    });
  });
}

function update(timestamp: number) {
  const deltaTime = timestamp - dropStart;
  if (deltaTime > dropInterval) {
    dropPiece();
    dropStart = timestamp;
  }
  drawBoard();
  drawPiece(currentPiece, context, grid);
  requestAnimationFrame(update);
}

function initializePieces() {
  currentPiece = randomPiece();
  nextPiece = randomPiece();
  drawNextPiece();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movePiece(-1);
  if (e.key === "ArrowRight") movePiece(1);
  if (e.key === "ArrowDown") hardDrop();
  if (e.key === "ArrowUp") rotatePiece();
});

initializePieces();
requestAnimationFrame(update);
