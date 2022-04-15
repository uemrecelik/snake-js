var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

const fillColor = '#E06B52';


score = 0;
var maxScore = 0;
var grid = 16;
var count = 0;
var fps = 15;
var snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// get random whole numbers in a specific range

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  // game speed will increazse when aeach apple ate 
  if (++count < fps) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // move snake by velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // snake parts wrapper in canvas --horizontal
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // snake parts wrapper in canvas --vertical
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = 'blue';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  context.fillStyle = fillColor;
  snake.cells.forEach(function(cell, index) {
 
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      fps = fps - 0.5;
      score = score + 1;
      document.getElementById("score").innerHTML = score;


      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // bubble sort alg for check colision
    for (var i = index + 1; i < snake.cells.length; i++) {
   
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        if(score > maxScore){
            maxScore = score;
        }
        score = 0;
        document.getElementById("score").innerHTML = score;
        document.getElementById("max-score").innerHTML = maxScore;
        fps = 15;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// keyboard event listeners
document.addEventListener('keydown', function(e) {
 
  // left
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up 
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right 
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});


requestAnimationFrame(loop);