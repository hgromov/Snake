//  init game field
let field = document.createElement('div');
document.body.appendChild(field);
field.classList.add('field');

//  init cells
for (let i = 0; i < 10000; i++) {
  let cell = document.createElement('div');
  field.appendChild(cell);
  cell.classList.add('cell');
}

// init position atributes
let cell = document.querySelectorAll('.cell');
let len = cell.length;
let x = 1,
    y = 100;

for (let i = 0; i < len; i++) {
	if (x > 100) {x=1; y--;}
	cell[i].setAttribute('posX', x);
	cell[i].setAttribute('posY', y);
	x++;
}

// get random coordinates
function randCoords(minx) {
  let posX = Math.round(Math.random() * (100 - minx) + minx);
  let posY = Math.round(Math.random() * (100 - 1) + 1);
  return [posX, posY];
}

let coords = randCoords(3);

// init snake in random place on field
const snake = function() {
	return [
	  document.querySelector(`[posX='${coords[0]}'][posY='${coords[1]}']`), 
  	  document.querySelector(`[posX='${(coords[0]-1)}'][posY='${coords[1]}']`),
      document.querySelector(`[posX='${(coords[0]-2)}'][posY='${coords[1]}']`)
	]
}

let snakeBody = snake();

function drowSnake() {
  snakeBody[0].classList.add('snakeHead');
  for(let i = 1; i<snakeBody.length; i++) {
    snakeBody[i].classList.add('snakeBody');
  }
}
drowSnake();

// init food for snake
let point;

function createPoint() {
  function drowPoint() {
    let pointCoords = randCoords(1);
    point = document.querySelector(`[posX='${pointCoords[0]}'][posY='${pointCoords[1]}']`);
  }
  drowPoint();

  // apple shouldn't spawn inside snake
  while(point.classList.contains('snakeBody')) {
    drowPoint();
    clearInterval(interval);
    setInterval(move, count);
  }

  point.classList.add('point');
}

createPoint();

let direction = 'right';
let tic = false;

let displayScore = document.createElement('div');
displayScore.classList.add('score');
document.body.appendChild(displayScore);
let score = 0;
displayScore.innerHTML = `score: ${score}`;

// movement logic
function move() {
  let snakeCoords = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];
  snakeBody[0].classList.remove('snakeHead');
  snakeBody[snakeBody.length-1].classList.remove('snakeBody');
  snakeBody.pop();

  if (direction == 'right') {
      if (snakeCoords[0] < 100) {
        snakeBody.unshift(document.querySelector(`[posX='${(+snakeCoords[0]+1)}'][posY='${snakeCoords[1]}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX='1'][posY='${snakeCoords[1]}']`));
      }
  } else if (direction == 'left') {
      if (snakeCoords[0] > 1) {
        snakeBody.unshift(document.querySelector(`[posX='${(+snakeCoords[0]-1)}'][posY='${snakeCoords[1]}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX='100'][posY='${snakeCoords[1]}']`));
      }
  }  else if (direction == 'up') {
      if (snakeCoords[1] < 100) {
        snakeBody.unshift(document.querySelector(`[posX='${snakeCoords[0]}'][posY='${(+snakeCoords[1]+1)}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX='${snakeCoords[0]}'][posY='1']`));
      }
  }  else if (direction == 'down') {
      if (snakeCoords[1] > 1) {
        snakeBody.unshift(document.querySelector(`[posX='${snakeCoords[0]}'][posY='${(snakeCoords[1]-1)}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX='${snakeCoords[0]}'][posY='100']`));
      }
  }

  // if snake ate an apple: making her bigger and refresh score counter
  if (snakeBody[0].getAttribute('posX') == point.getAttribute('posX') && snakeBody[0].getAttribute('posY') == point.getAttribute('posY')) {
    point.classList.remove('point');
    let x = snakeBody[snakeBody.length - 1].getAttribute('posX');
    let y = snakeBody[snakeBody.length - 1].getAttribute('posY');
    snakeBody.push(document.querySelector(`[posX = '${x}'][posY = '${y}']`));
    createPoint();
    score++;
    displayScore.innerHTML = `score: ${score}`;
  }

  // if snake dies: alerting score counter and restarting the game
  if (snakeBody[0].classList.contains('snakeBody')) {
  	setTimeout(alert(`GAME OVER\nYour score: ${score}`),10)
    clearInterval(interval);
    score = 0;
    for(let i = 0; i < len; i++) {
      cell[i].classList.remove('snakeBody');
      cell[i].classList.remove('snakeHead');
    }
    snakeBody = new Snake;
    drowSnake();
    count = 100;
    setInterval(move, count);
  }

  drowSnake();
  tic = true;
}

let count = 100;
let interval = setInterval(move, count);

window.addEventListener('keydown', function (e) {
  if (tic == true) {
    if (e.keyCode == 37 && direction != 'right') {
      direction = 'left';
      tic = false;
    } else if (e.keyCode == 38 && direction != 'down') {
      direction = 'up';
      tic = false;
    } else if (e.keyCode == 39 && direction != 'left') {
      direction = 'right';
      tic = false;
    } else if (e.keyCode == 40 && direction != 'up') {
      direction = 'down';
      tic = false;
    }
  }
})