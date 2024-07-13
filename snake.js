const canvas = document.getElementById('board');

const context =  canvas.getContext('2d');

canvas.width = canvas.clientWidth;

canvas.height = canvas.clientHeight;

let direction = 'right';

let frequency = 60;

const grid = 20;

let count = 0;

let score = 0;

const scoreCount = document.querySelector('.js-score');

scoreCount.innerHTML = score;

const snake = {
  x: 100,
  y: 100,

  dx: grid,
  dy: 0,

  cells: [],
  maxCells: 4,
};

let apple = {
  x: 240,
  y: 240
}

function loop() {
  requestAnimationFrame(loop);


  if (++count < frequency) return;

  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver();
    return;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'rgb(8, 227, 252)';
  context.fillRect(apple.x, apple.y, grid, grid);

  context.fillStyle = 'white';

  snake.cells.forEach((cell, index) => {
    context.fillRect(cell.x, cell.y, grid, grid);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreCount.innerHTML = score;
      
      if (frequency > 0) frequency -= 2;

      apple.x = getRandomInt(0, canvas.width / 20) * grid;
      apple.y = getRandomInt(0, canvas.height / 20) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  })
}

function gameOver() {
  document.querySelector('.js-modal-wrapper').classList.remove('hidden');
  document.querySelector('.js-modal').classList.remove('hidden');
}

const newGameButton = document.querySelector('.js-new-game-button');

newGameButton.addEventListener('click', () => {
  document.querySelector('.js-modal-wrapper').classList.toggle('hidden');
  document.querySelector('.js-modal').classList.toggle('hidden');
  newGame();
});

function newGame() {
  snake.x = 100;
  snake.y = 100;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;

  apple.x = getRandomInt(0, canvas.width / 20) * grid;
  apple.y = getRandomInt(0,  canvas.height / 20) * grid;
  frequency = 60;
  score = 0;
  scoreCount.innerHTML = score;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// recognising swipes

const body = document.querySelector('.js-body');
let initialX =  null;
let initialY = null;

document.addEventListener('touchstart', (event) => {
  initialX = event.touches[0].clientX;
  initialY = event.touches[0].clientY;
}, false);

document.addEventListener('touchmove', (event) => {
  if (initialX === null || initialY === null) return;

  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;

  const diffX = initialX - currentX;
  const diffY = initialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    

    if (diffX > 0) {
      direction = 'left';
    } else {
      direction = 'right';
    }
  } else {
    if (diffY > 0) {
      direction = 'up';
    } else {
      direction = 'down';
    }
  }
  
  initialX = null;
  initialY = null;

  event.preventDefault();
}, false);

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') direction = 'left';
  if (event.code === 'ArrowRight' || event.code === 'KeyD') direction = 'right';
  if (event.code === 'ArrowUp' || event.code === 'KeyW') direction = 'up';
  if (event.code === 'ArrowDown' || event.code === 'KeyS') direction = 'down';
  changeDirection(direction);
})

requestAnimationFrame(loop);

function changeDirection(direction) {
  if (direction === 'left' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  if (direction === 'right' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  if (direction === 'up' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  if (direction === 'down' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
}