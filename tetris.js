const board = document.getElementById('board');
const nextGrid = document.getElementById('next');
const playButton = document.querySelector('.fa-pause');
const volumeButton = document.querySelector('.fa-volume-off');
const music = new Audio("tetris-theme.mp3");
music.loop = true;
let running = false;
let timer;
let gridData;
let nextGridData;
let currentShape;
let height = 20;
let width = 10;
let shapes = [
  {init: [[0,4],[0,5],[1,4],[1,5]], pivot: null},
  {init: [[0,3],[0,4],[0,5],[0,6]], pivot: 2},
  {init: [[0,4],[1,3],[1,4],[1,5]], pivot: 2},
  {init: [[0,4],[0,5],[1,3],[1,4]], pivot: 2},
  {init: [[0,3],[0,4],[1,4],[1,5]], pivot: 2},
  {init: [[0,3],[1,3],[1,4],[1,5]], pivot: 2},
  {init: [[0,5],[1,5],[1,4],[1,3]], pivot: 2}
];
let nextShape = shapes[Math.floor(Math.random() * shapes.length)];
function Square(bool) {
  this.occupied = bool;
}

let generateGridData = (height, width) => {
  gridData = [];
  for(let y = 0; y < height; y++){
    let row = [];
    for(let x = 0; x < width; x++){
      row.push(new Square(false));
    }
    gridData.push(row);
  }
}

let generateNextGrid = () => {
  nextGridData = [];
  for(let y = 0; y < 4; y++){
    let row = [];
    for(let x = 0; x < 6; x++){
      row.push(new Square(false));
    }
    nextGridData.push(row);
  }
}

let renderNextGrid = () => {
  let html = '';
  for(let y = 0; y < nextGridData.length; y++){
    for(let x = 0; x < nextGridData[y].length; x++){
      if(nextGridData[y][x].occupied){
        html += '<div class="square occupied"></div>'
      } else {
        html += '<div class="square"></div>';
      }
    }
    html += '<br>';
  }
  nextGrid.innerHTML = html;
}

let render = () => {
  let html = '';
  for(let y = 0; y < gridData.length; y++){
    for(let x = 0; x < gridData[y].length; x++){
      if(gridData[y][x].occupied){
        html += '<div class="square occupied"></div>';
      } else {
        html += '<div class="square"></div>';
      }
    }
    html += '<br>';
  }
  board.innerHTML = html;
}

let generateNewShape = () => {
  currentShape = nextShape;
  let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  nextShape = JSON.parse(JSON.stringify(randomShape));
  for(let y = 0; y < nextGridData.length; y++){
    for(let x = 0; x < nextGridData[y].length; x++){
      nextGridData[y][x].occupied = false;
    }
  }
  for(let i = 0; i < nextShape.init.length; i++){
    nextGridData[nextShape.init[i][0] + 1][nextShape.init[i][1] - 2].occupied = true;
  }
  renderNextGrid();
  updateGrid();
  render();
}

let updateGrid = () => {
  for(let i = 0; i < currentShape.init.length; i++) {
    if(gridData[currentShape.init[i][0]][currentShape.init[i][1]].occupied){
      gameOver();
      break;
    } else {
      gridData[currentShape.init[i][0]][currentShape.init[i][1]].occupied = true;
    }
  }
}

let gameOver = () => {
  clearInterval(timer);
  running = false;
  playButton.classList.remove('fa-play');
  playButton.classList.add('fa-pause');
  document.removeEventListener('keydown', addControls);
  console.log('GAME OVER');
}

let moveDown = () => {
  let clear = true;
  let lowest = currentShape.init.sort((a,b) => {
    return b[0] - a[0];
  });
  let gridDataCopy = JSON.parse(JSON.stringify(gridData));
  let currentShapeCopy = JSON.parse(JSON.stringify(currentShape));
  for(let i = 0; i < lowest.length; i++){
    if(lowest[i][0] < gridDataCopy.length - 1 &&
      !gridDataCopy[lowest[i][0] + 1][lowest[i][1]].occupied) {
      gridDataCopy[lowest[i][0]][lowest[i][1]].occupied = false;
      gridDataCopy[lowest[i][0] + 1][lowest[i][1]].occupied = true;
      currentShapeCopy.init[i][0]++;
    } else {
      clear = false;
      break;
    }
  }
  if(clear) {
    currentShape = JSON.parse(JSON.stringify(currentShapeCopy));
    gridData = JSON.parse(JSON.stringify(gridDataCopy));
    render();
  } else {
    checkForClear();
    generateNewShape();
  }
}

let checkForClear = () => {
  let cleared = [];
  for(let y = 0; y < gridData.length; y++) {
    for(let x = 0; x < gridData[y].length; x++) {
      if(!gridData[y][x].occupied){
        break;
      } else if(x === gridData[y].length - 1){
        cleared.push(y);
      }
    }
  }
  if(cleared.length > 0) {
    console.log(cleared);
    for(i = 0; i < cleared.length; i++){
      for(let x = 0; x < gridData[cleared[i]].length; x++){
        gridData[cleared[i]][x].occupied = false;
      }
      for(let y = cleared[i]; y > 0; y--){
        for(let x = 0; x < gridData[y].length; x++){
          if(gridData[y][x].occupied){
            gridData[y][x].occupied = false;
            gridData[y + 1][x].occupied = true;
          }
        }
      }
      render();
    }
  }
}

let moveLeft = () => {
  let clear = true;
  let leftist = currentShape.init.sort((a,b) => {
    return a[1] - b[1];
  });
  let gridDataCopy = JSON.parse(JSON.stringify(gridData));
  let currentShapeCopy = JSON.parse(JSON.stringify(currentShape));
  for(let i = 0; i < leftist.length; i++){
    if(leftist[i][1] > 0 &&
      !gridDataCopy[leftist[i][0]][leftist[i][1] - 1].occupied) {
      gridDataCopy[leftist[i][0]][leftist[i][1] - 1].occupied = true;
      gridDataCopy[leftist[i][0]][leftist[i][1]].occupied = false;
      currentShapeCopy.init[i][1]--;
    } else {
      clear = false;
      break;
    }
  }
  if(clear){
    currentShape = JSON.parse(JSON.stringify(currentShapeCopy));
    gridData = JSON.parse(JSON.stringify(gridDataCopy));
    render();
  }
}

let moveRight = () => {
  let clear = true;
  let rightest = currentShape.init.sort((a,b) => {
    return b[1] - a[1];
  });
  let gridDataCopy = JSON.parse(JSON.stringify(gridData));
  let currentShapeCopy = JSON.parse(JSON.stringify(currentShape));
  for(let i = 0; i < rightest.length; i++){
    if(rightest[i][1] < gridDataCopy[0].length - 1 &&
      !gridDataCopy[rightest[i][0]][rightest[i][1] + 1].occupied) {
      gridDataCopy[rightest[i][0]][rightest[i][1] + 1].occupied = true;
      gridDataCopy[rightest[i][0]][rightest[i][1]].occupied = false;
      currentShapeCopy.init[i][1]++;
    } else {
      clear = false;
      break;
    }
  }
  if(clear){
    currentShape = JSON.parse(JSON.stringify(currentShapeCopy));
    gridData = JSON.parse(JSON.stringify(gridDataCopy));
    render();
  }
}
//
// let rotate = () => {
//   clearInterval(timer);
//   // let currentShapeCopy = JSON.parse(JSON.stringify(currentShape));
//   let currentShapeCopy = [];
//   for(i = 0; i < currentShape.length; i++){
//     subblock = [];
//     subblock[0] = (currentShape[i][1] - 4) //- currentShape[i][1];
//     subblock[1] = currentShape[i][0];
//     currentShapeCopy.push(subblock);
//   }
//   console.log(currentShapeCopy)
//   for(let y = 0; y < currentShape.length; y++){
//     gridData[currentShape[y][0]][currentShape[y][1]].occupied = false;
//   }
//   currentShape = currentShapeCopy;
//   for(let y = 0; y < currentShapeCopy.length; y++){
//     gridData[currentShape[y][0]][currentShape[y][1]].occupied = true;
//   }
//   console.log(currentShape);
//   render();
// }

function rotate(){
  if(currentShape.pivot){
    let clear = true;
    let shapeCoords = currentShape.init;
    let gridDataCopy = JSON.parse(JSON.stringify(gridData));
    let currentShapeCopy = JSON.parse(JSON.stringify(currentShape));
    // let currentShapeCopyHeight = currentShapeCopy.init.sort((a,b) => {
    //   return a[0] - b[0];
    // });
    // let currentShapeCopyWidth = currentShapeCopy.init.sort((a,b) => {
    //   return b - a;
    // });
    // console.log(currentShapeCopyHeight);
    // console.log(currentShapeCopyWidth);
    // console.log(currentShapeCopy);
    // So we need to rotate the points relative to the pivot point
    //  at this moment in time. The equation for a 90 deg. rotation
    //  is (x,y) -> (y,-x).
    for(let i = 0; i < currentShapeCopy.init.length; i++){
      gridDataCopy[currentShapeCopy.init[i][0]][currentShapeCopy.init[i][1]].occupied = false;
    }
    for(let i = 0; i < shapeCoords.length; i++){
      let pivotIndex = currentShapeCopy.pivot;
      let pivot = currentShapeCopy.init[pivotIndex];
      let relativeX = shapeCoords[i][1] - pivot[1];
      let relativeY = shapeCoords[i][0] - pivot[0];
      let rotatedX = relativeY;
      let rotatedY = -relativeX;
      currentShapeCopy.init[i][1] = pivot[1] + rotatedX;
      currentShapeCopy.init[i][0] = pivot[0] + rotatedY;
      if(!gridDataCopy[currentShapeCopy.init[i][0]][currentShapeCopy.init[i][1]].occupied){
        gridDataCopy[currentShapeCopy.init[i][0]][currentShapeCopy.init[i][1]].occupied = true;
      } else {
        clear = false;
        break;
      }
    }
    if(clear){
      console.log(currentShapeCopy.init[currentShapeCopy.pivot]);
      currentShape = JSON.parse(JSON.stringify(currentShapeCopy));
      gridData = JSON.parse(JSON.stringify(gridDataCopy));
      render();
    }
  }
}

let gameLoop = () => {
  moveDown();
}

let addControls = (e) => {
  if(e.keyCode === 40) {
    e.preventDefault();
    clearInterval(timer);
    moveDown();
    timer = setInterval(gameLoop, 1000);
  } else if(e.keyCode === 37){
    e.preventDefault();
    moveLeft();
  } else if(e.keyCode === 39){
    e.preventDefault();
    moveRight();
  } else if(e.keyCode === 38){
    e.preventDefault();
    rotate();
  }
}

playButton.addEventListener('click', (e) => {
  if(running){
    if(e.target.classList.contains('fa-pause')){
      e.target.classList.remove('fa-pause');
      e.target.classList.add('fa-play');
      timer = setInterval(gameLoop, 750);
    } else if(e.target.classList.contains('fa-play')){
      e.target.classList.remove('fa-play');
      e.target.classList.add('fa-pause');
      clearInterval(timer);
    }
  } else {
    newGame();
    running = true;
    playButton.classList.remove('fa-pause');
    playButton.classList.add('fa-play');
  }
});

let newGame = () => {
  generateGridData(height, width);
  generateNextGrid();
  renderNextGrid();
  generateNewShape();
  render();
  document.addEventListener('keydown', addControls);
  timer = setInterval(gameLoop, 750);
}

volumeButton.addEventListener('click', (e) => {
  if(e.target.classList.contains('fa-volume-up')){
    e.target.classList.remove('fa-volume-up');
    e.target.classList.add('fa-volume-off');
    music.pause();
  } else if(e.target.classList.contains('fa-volume-off')){
    e.target.classList.remove('fa-volume-off');
    e.target.classList.add('fa-volume-up');
    music.play();
  }
})

generateGridData(height, width);
generateNextGrid();
renderNextGrid();
render();
