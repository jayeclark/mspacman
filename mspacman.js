
let count = 0;
let gCount = 0;
let powerCount = 0;
let eatenCount = 0;
let stop = false;
let started = false;
let restarted = false;
let restartGhosts = false;
let score = 0;

let d = {'left' : {'transform' : 'rotateY(180deg)','speed' : -speed,'row':0,'col':-1, 'reverse' : 'right'},
         'right' : {'transform' : 'rotate(0deg)','speed' : speed,'row':0,'col':1, 'reverse' : 'left'},
         'up' : {'transform' : 'rotate(90deg) rotateY(180deg)','speed' : -speed,'row':-1,'col':0, 'reverse' : 'down'},
         'down' : {'transform' : 'rotate(90deg)','speed' : speed,'row':1,'col':0, 'reverse' : 'up'}}


function startGame() {

  if (stop === false && started === false) {
    
    restarted = false;
    update();
    setTimeout(updateGhosts,1000);

    started = true;
    let readyDiv = document.getElementById('ready');
    readyDiv.style.display = 'none';
  }
  else {
    stop = !stop;
  }

  buttonSwap(`start`);

}

function restartGame() {

  started = false;
  stop = false;
  restarted = true;
  restartGhosts = false;
  
  // erase board, ghosts, and msPacMan
  const oldGame = document.getElementById('game');

  while (oldGame.firstChild) {
    oldGame.removeChild(oldGame.lastChild);
  }

  const oldScore = document.getElementById('score');
  oldScore.innerHTML = 0;
  score = 0;

  const msPacKeys = Object.keys(msPacMan);
  msPacKeys.forEach(key=> {
    delete msPacMan[key];
  })

  ghosts.splice(0,ghosts.length);

  function redraw() {
    drawBoard(board);

    for (let i = 0; i < board.length; i++) {
    let thisRow = board[i];
      if (thisRow.includes('P')) {
        pacPos.col = thisRow.indexOf('P');
        pacPos.colM = thisRow.indexOf('P') + 1;
        pacPos.row = i;
        pacPos.rowM = i + 1;
        break;
     }
    }
    msPacMan = makePac();

  }
  
  setTimeout(redraw,500);


  let restart = document.getElementById('restart');
  restart.style.display = 'none';

  let start = document.getElementById('start');
  start.style.display = ''; 

}

// Deprioritize a button after it has been clicked
const buttonSwap = () => {

  let start = document.getElementById('start');
  if (start.style.display.includes('none')) { start.style.display = ''; } 
  else { start.style.display = 'none'; }

  let stop = document.getElementById('stop');
  if (stop.style.display.includes('none')) { stop.style.display = ''; } 
  else { stop.style.display = 'none'; }
}

// Update the position of Ms PacMan
function update() {

  if (restarted === true) {return false;}
  count++;

  if (stop === false) {

    document.onkeydown = checkKey;

    function checkKey(e) {
    
        e = e || window.event;
        if (e.keyCode == '38' || e.keyCode == '87') { msPacMan.cache = 'up'; } 
        else if (e.keyCode == '40' || e.keyCode == '83') { msPacMan.cache = 'down'; } 
        else if (e.keyCode == '37' || e.keyCode == '65') { msPacMan.cache = 'left'; } 
        else if (e.keyCode == '39' || e.keyCode == '68') { msPacMan.cache = 'right'; }
    
    }
  
    checkGhostCollision();

    if (msPacMan.speed !== 0 || msPacMan.cache !== '') {
  
      checkCollisions(msPacMan);

      checkDots(msPacMan);
  
      if (msPacMan.direction === 'left' || msPacMan.direction === 'right' ) {
          msPacMan.position.x += msPacMan.speed;
          msPacMan.newimg.style.left = msPacMan.position.x;
      } else if (msPacMan.direction === 'up' || msPacMan.direction === 'down' ){
          msPacMan.position.y += msPacMan.speed;
          msPacMan.newimg.style.top = msPacMan.position.y;
      }
  
      msPacMan.rcPos.row = Math.floor(msPacMan.position.y / cellW);
      msPacMan.rcPos.rowM = Math.floor(msPacMan.position.y / cellW) + 1;
      msPacMan.rcPos.col = Math.floor(msPacMan.position.x / cellW);
      msPacMan.rcPos.colM = Math.floor(msPacMan.position.x / cellW) + 1;
    }

  }

  if (count === 3) {
      msPacMan.newimg.src = msPacMan.newimg.src.includes('mspacman1.png') ? 
                        './images/mspacman2.png' : './images/mspacman1.png'  
    }

  if (count === 3) count = 0

  setTimeout(update, 50);

}

// Update the position of free ghosts
function updateGhosts() {

  if (restarted === true && restartGhosts === false) {return false;}

  // correct starting position if applicable

  ghosts.forEach(ghost=> {

    if (ghost.free === 'free') {

      if (ghost.position.x % ghost.speed > 0) {
        ghost.position.x = ghost.position.x + ghost.position.x % ghost.speed;
        ghost.item.style.left = ghost.position.x;
      }
      if (ghost.position.y % ghost.speed > 0) {
        ghost.position.y = ghost.position.y + ghost.position.y % ghost.speed;
        ghost.item.style.top = ghost.position.y;
      }

    }

  })

  if (stop === false) {

    ghosts.forEach(ghost=> {

      if(ghost.free === 'free') {
  
        // check if the ghost can change direction 
        checkGhostMoves(ghost);

        // change direction to chase pacman

        if (ghost.direction === 'left' || ghost.direction === 'right' ) {
          ghost.position.x += ghost.speed;
          ghost.item.style.left = ghost.position.x;
        } else if (ghost.direction === 'up' || ghost.direction === 'down' ){
            ghost.position.y += ghost.speed;
            ghost.item.style.top = ghost.position.y;
        }

        ghost.rcPos.row = Math.floor(ghost.position.y / cellW);
        ghost.rcPos.rowM = Math.floor(ghost.position.y / cellW) + 1;
        ghost.rcPos.col = Math.floor(ghost.position.x / cellW);
        ghost.rcPos.colM = Math.floor(ghost.position.x / cellW) + 1;
      
      }

      else {

        let ghostLeft = ghost.rcPos.col;
        let ghostTop = ghost.rcPos.row;
        if (ghostLeft >= 11 && ghostLeft <= 17 && ghostTop >= 13 && ghostTop <= 16) { 
          console.log('inside');
        }
        else {

          checkReturnMoves(ghost);

          if (ghost.direction === 'left' || ghost.direction === 'right' ) {
            ghost.position.x += ghost.speed;
            ghost.item.style.left = ghost.position.x;
          } else if (ghost.direction === 'up' || ghost.direction === 'down' ){
              ghost.position.y += ghost.speed;
              ghost.item.style.top = ghost.position.y;
          }
  
          ghost.rcPos.row = Math.floor(ghost.position.y / cellW);
          ghost.rcPos.rowM = Math.floor(ghost.position.y / cellW) + 1;
          ghost.rcPos.col = Math.floor(ghost.position.x / cellW);
          ghost.rcPos.colM = Math.floor(ghost.position.x / cellW) + 1;

        }
      }

  
    })

  }

  setTimeout(updateGhosts, 50);

}


function checkDots(item) {

  // find all dots in the current cell
  let classCode = 'pac-dot-'+item.rcPos.col + '-' + item.rcPos.row;
  let next = nextPos(item.rcPos,item.direction);
  let classCode2 = 'pac-dot-'+next.col + '-' + next.row;
 
  if (item.direction === 'right') {classCode2 = 'pac-dot-'+next.colM + '-' + next.row;}
  if (item.direction === 'down') {classCode2 = 'pac-dot-'+next.col + '-' + next.rowM;}

  let dots = Array.prototype.slice.call(document.getElementsByClassName(classCode), 0);
  let dots2 = Array.prototype.slice.call(document.getElementsByClassName(classCode2), 0);
 
  dots.push(...dots2);
  //dots.push(...dots3);

  // check if any are in the mouth
  for (let i = 0; i < dots.length; i++) {

    let dot = dots[i];

    let dotLeft = parseInt(dot.style.left);
    let dotRight = dotLeft + parseInt(dot.style.width);
    let dotTop = parseInt(dot.style.top);
    let dotBottom = dotTop + parseInt(dot.style.width);
    let itemLeft = parseInt(item.newimg.style.left);
    let itemTop = parseInt(item.newimg.style.top);


    let leftBoundary = itemLeft + cellW - pacWidth / 2;
    let rightBoundary = leftBoundary + pacWidth;
    let topBoundary = itemTop + cellW - pacWidth / 2;
    let bottomBoundary = topBoundary + pacWidth;

    function removeDot(id) {
      let dotToRemove = document.getElementById(id);
      let game = document.getElementById('game');
      let removedDot = game.removeChild(dotToRemove);
      if (removedDot !== '') {
        if (removedDot.classList.contains('big')) {
          score += 50;
          munchMode();
        }
        else {score += 10;}
        let scoreDiv = document.getElementById('score');
        scoreDiv.innerHTML = score;
      }
    }

    if (dotLeft > leftBoundary && dotRight < rightBoundary && dotTop > topBoundary && dotBottom < bottomBoundary) {
      removeDot(dot.id); eatenCount++;
      if (eatenCount === dotCount) {

            // stop movement
            stop = true;

            // disappear ghosts
            ghosts.forEach(ghost => {
              if (ghost.free === 'free') {
                ghost.item.style.display = 'none';
              }
            })

            // appear 'winner'
            let win = document.getElementById('winner');
            win.style.display = '';

            // change button to 'restart'
            let stopButton = document.getElementById('stop');
            stopButton.style.display = 'none';

            let restart = document.getElementById('restart');
            restart.style.display = '';

      }
    }

  }

}

function checkGhostCollision() {

  // if collided with a ghost, end game

  let ghostCollision = false;
  let collidedGhosts = [];
  let leftBound = parseInt(msPacMan.newimg.style.left) + parseInt(msPacMan.newimg.style.margin);
  let rightBound = parseInt(msPacMan.newimg.style.left) + parseInt(msPacMan.newimg.style.margin) + parseInt(msPacMan.newimg.width);
  let topBound = parseInt(msPacMan.newimg.style.top) + parseInt(msPacMan.newimg.style.margin);
  let bottomBound = parseInt(msPacMan.newimg.style.top) + parseInt(msPacMan.newimg.style.margin) + parseInt(msPacMan.newimg.height);

  ghosts.forEach(ghost => {

    if (ghost.free === 'free') {

      let ghostLeft = parseInt(ghost.item.style.left) + parseInt(ghost.item.style.margin);
      let ghostRight = parseInt(ghost.item.style.left) + parseInt(ghost.item.style.margin) + parseInt(ghost.item.style.width);
      let ghostTop = parseInt(ghost.item.style.top) + parseInt(ghost.item.style.margin);
      let ghostBottom = parseInt(ghost.item.style.top) + parseInt(ghost.item.style.margin) + parseInt(ghost.item.style.height);
    
      if (ghostRight >= leftBound && ghostRight <= rightBound) {
        if (ghostTop <= bottomBound && ghostTop >= topBound) { ghostCollision = true; }
        else if (ghostBottom >= topBound && ghostBottom <= bottomBound) { 
          ghostCollision = true; }
      }

      if (ghostLeft <= rightBound && ghostLeft >= leftBound) {
        if (ghostTop <= bottomBound && ghostTop >= topBound) { ghostCollision = true; }
        else if (ghostBottom >= topBound && ghostBottom <= bottomBound) { ghostCollision = true; }
      }

      if (ghostCollision === true) {
        collidedGhosts.push(ghost.item.id); 
        console.log(collidedGhosts);
      }
    }

  })

  if (ghostCollision === true && powerCount === 0) {
    
    // stop movement
    stop = true;
    eatenCount = 0;
    dotCount = 0;

    // disappear msPacMan
    msPacMan.newimg.style.display = 'none';

    // appear 'game over'
    let over = document.getElementById('game-over');
    over.style.display = '';

    // change button to 'restart'
    let stopButton = document.getElementById('stop');
    stopButton.style.display = 'none';

    let restart = document.getElementById('restart');
    restart.style.display = '';

  }
  else if (ghostCollision === true && powerCount > 0) {

    collidedGhosts.forEach(id=>{
      let ghost = document.getElementById(id);
      console.log(ghost);
      let ghostEaten = false;
      let ghostLeft = ghost.style.left;
      let ghostTop = ghost.style.top;
      if (ghostLeft < msPacMan.newimg.style.left && msPacMan.direction === 'left') {ghostEaten = true;}
      if (ghostLeft > msPacMan.newimg.style.left + msPacMan.newimg.style.margin + msPacMan.newimg.style.width && msPacMan.direction === 'right') {ghostEaten = true;}
      if (ghostTop < msPacMan.newimg.style.top && msPacMan.direction === 'up') {ghostEaten = true;}
      if (ghostLeft > msPacMan.newimg.style.top + msPacMan.newimg.style.margin + msPacMan.newimg.style.height && msPacMan.direction === 'down') {ghostEaten = true;}

      if (ghostEaten === true) {

        ghosts.forEach(x=> {
          if (x.item.id = id) {x.free = 'returning';}
        })

        ghost.style.backgroundColor = 'transparent';
        let fringes = Array.from(ghost.getElementsByClassName('fringe'));
        fringes.forEach(fringe=> fringe.style.display = 'none')

        let eyeballs = Array.from(ghost.getElementsByClassName('eyeball'));
        eyeballs.forEach(eye => eye.style.display = '');

        let pupils = Array.from(ghost.getElementsByClassName('pupil'));
        pupils.forEach(pupil=> pupil.style.display = '');

        let frowns = Array.from(ghost.getElementsByClassName('blue-frown'));
        frowns.forEach(frown=> frown.style.display = 'none');

        let frownEyes = Array.from(ghost.getElementsByClassName('blue-pupil'));
        frownEyes.forEach(eye=> eye.style.display = 'none');

      }

    })

  }

}

// Check prosimity to edges and reverse direction and image if needed
function checkCollisions(item) {

  if (item.cache !== '') {

    // figure out the next position based on the desired direction
    let next = nextPos(item.rcPos,item.cache);

    // if there is no wall there, AND the item is at a transition point, change the direction and speed and clear the cache
    let canTurn = false;
    if (findXY(item.rcPos).x === item.position.x && findXY(item.rcPos).y === item.position.y) {
      canTurn = true;}

    let canReverse = false;
    if (item.cache === d[item.direction].reverse) {canReverse = true;}

    if (isWall(next, item.cache) === false && (canTurn === true || canReverse === true)) {

          let stats = d[item.cache];
          let transformStr = stats.transform;

          let currDir = item.direction;

          let currTransform = item.newimg.style.transform;
          if (item.cache === 'down' && currDir === 'left') {transformStr = 'rotate(270deg) rotateY(180deg)';}
          else if (item.cache === 'down' && currDir === 'right') {transformStr = 'rotate(90deg)';}
          else if (item.cache === 'up' && currDir === 'left') {transformStr = 'rotate(90deg) rotateY(180deg)';}
          else if (item.cache === 'up' && currDir === 'right') {transformStr = 'rotate(-90deg)';}
          else if (item.cache === 'up' && currDir === 'down') {
            if (currTransform.includes('rotate(270deg) rotateY(180deg)')) {transformStr = 'rotate(270deg)';}
          }
          else if (item.cache === 'down' && currDir === 'up') {
            if (currTransform.includes('rotate(90deg) rotateY(180deg)')) {transformStr = 'rotate(90deg)';}
          }
          item.newimg.style.transform = transformStr;
          item.speed = stats.speed;
          item.direction = item.cache;
          item.cache = '';

          return true;
   
    } 
  
  }

  // if there is no cache, or it wasn't cleared, check whether Ms PacMan is up against a wall
  let next = nextPos(item.rcPos, item.direction);

  if (isWall(next,item.direction) === true && findXY(item.rcPos).x === item.position.x && findXY(item.rcPos).y === item.position.y) {
    item.speed = 0;
    item.cache = '';
  }

  teleport(item);

}

// Check if the free ghost can move, and move him closer to pacman if so
function checkGhostMoves(item) {

  // only do the calculations if the ghost has hit a tile square-on
  if (item.position.x % cellW === 0 && item.position.y % cellW === 0) {

    let dirs = ['left','right','up','down'];

    // remove reversing direction as an option
    let rev = d[item.direction].reverse;

    dirs.splice(dirs.indexOf(rev),1);

    // filter out any directions that have walls
    dirs = dirs.filter(dir => {
      if (isWall(nextPos(item.rcPos,dir),dir) === false) {return true;}
      else {return false;}
    })

    if (dirs.length === 1) {
      item.direction = dirs[0]; 
      item.speed = d[dirs[0]].speed;
    }
    else {

      tempDir = ''
      // find pacPos relative to item
      let pacRow = msPacMan.rcPos.row > item.rcPos.row ? 'down' : msPacMan.rcPos.row < item.rcPos.row ? 'up' : 'same'
      let pacCol = msPacMan.rcPos.col > item.rcPos.col ? 'right' : msPacMan.rcPos.col < item.rcPos.col ? 'left' : 'same'


      // if the item is in a portal row, see if it would be better to go through the portal
      if (portals.includes(item.rcPos.row)) {
        let optA = Math.abs(msPacMan.rcPos.col - item.rcPos.col);
        let optB = Math.min(msPacMan.rcPos.col, (board[0].length - msPacMan.rcPos.col));
        optB += Math.min(item.rcPos.col,(board[0].length - item.rcPos.col));

        if (optB < optA && pacCol !== 'same') { pacCol = d[pacCol].reverse; }
      }

      // if both directions are available, pick the one with the longest run 

      if (dirs.includes(pacRow) && dirs.includes(pacCol)) {

        let checkRun = (pos,dir) => {
          let hitWall = false;
          let tempPos = pos;
          let count = 0;
          while (hitWall == false) {
            if (board[tempPos.row].charAt(tempPos.col) === 'X' || board[tempPos.row].charAt(tempPos.col) === 'X' ) {
              hitWall = true;
            }
            else {count++; tempPos.row += d[dir].row; tempPos.col += d[dir].col;}
          }
        }

        if (checkRun(item.rcPos,pacRow) > checkRun(item.rcPos,pacCol)) {
          tempDir = pacRow;
        }
        else if (checkRun(item.rcPos,pacRow) < checkRun(item.rcPos,pacCol)) {
          tempDir = pacCol;
        }
        // if both runs are equal, pick at random
        else if (Math.random() < 0.5) {tempDir = pacRow} else {tempDir = pacCol}

      }
      else if (dirs.includes(pacRow)) {tempDir = pacRow}
      else if (dirs.includes(pacCol)) {tempDir = pacCol}
      else {
        let index = Math.floor(Math.random() * dirs.length);
        tempDir = dirs[index];
      }

      item.direction = tempDir;
      item.speed = d[tempDir].speed;

    }
    teleport(item);

  }

}

// Check if the returning ghost can move, and move him closer to pacman if so
function checkReturnMoves(item) {

  let targetPosX = 14 * cellW - cellW / 2;
  let targetPosY = 11 * cellW;
  let targetPosRow = 11;
  let targetPosCol = 14;

  // only do the calculations if the ghost has hit a tile square-on
  if (item.position.x % cellW === 0 && item.position.y % cellW === 0) {

    let dirs = ['left','right','up','down'];

    // remove reversing direction as an option
    let rev = d[item.direction].reverse;

    dirs.splice(dirs.indexOf(rev),1);

    // filter out any directions that have walls
    dirs = dirs.filter(dir => {
      if (isWall(nextPos(item.rcPos,dir),dir) === false) {return true;}
      else {return false;}
    })

    if (dirs.length === 1) {
      item.direction = dirs[0]; 
      item.speed = d[dirs[0]].speed;
    }
    else {

      tempDir = ''
      // find pacPos relative to item
      let targetRow = targetPosY > item.item.style.top ? 'down' : targetPosY < item.item.style.top ? 'up' : 'same'
      let targetCol = targetPosX > item.item.style.left ? 'right' : targetPosY < item.item.style.left ? 'left' : 'same'


      // if the item is in a portal row, see if it would be better to go through the portal
      if (portals.includes(item.rcPos.row)) {
        let optA = Math.abs(targetPosCol - item.rcPos.col);
        let optB = Math.min(targetPosCol, (board[0].length - targetPosCol));
        optB += Math.min(item.rcPos.col,(board[0].length - item.rcPos.col));

        if (optB < optA && pacCol !== 'same') { targetCol = d[targetCol].reverse; }
      }

      // if both directions are available, pick the one with the longest run 

      if (dirs.includes(targetRow) && dirs.includes(targetCol)) {

        let checkRun = (pos,dir) => {
          let hitWall = false;
          let tempPos = pos;
          let count = 0;
          while (hitWall == false) {
            if (board[tempPos.row].charAt(tempPos.col) === 'X' || board[tempPos.row].charAt(tempPos.col) === 'X' ) {
              hitWall = true;
            }
            else {count++; tempPos.row += d[dir].row; tempPos.col += d[dir].col;}
          }
        }

        if (checkRun(item.rcPos,targetRow) > checkRun(item.rcPos,targetCol)) {
          tempDir = targetRow;
        }
        else if (checkRun(item.rcPos,targetRow) < checkRun(item.rcPos,targetCol)) {
          tempDir = targetCol;
        }
        // if both runs are equal, pick at random
        else if (Math.random() < 0.5) {tempDir = targetRow} else {tempDir = targetCol}

      }
      else if (dirs.includes(targetRow)) {tempDir = targetRow}
      else if (dirs.includes(targetCol)) {tempDir = targetCol}
      else {
        let index = Math.floor(Math.random() * dirs.length);
        tempDir = dirs[index];
      }

      item.direction = tempDir;
      item.speed = d[tempDir].speed;

    }
    teleport(item);

  }

  else if (item.position.x === targetPosX && item.position.y === targetPosY) {
    // if it has hit the way to get into the ghost box, move down until inside the ghost box
    item.direction = 'down';
  }
  else if (item.position.x === targetPosX && item.position.y < 13 * cellW) {
    item.direction = 'down';
  }
  else if (item.position.x === targetPosX && item.position.y >= 13* cellW) {
    let countNotFree = 0;
    ghosts.forEach(x=> {if (x.free === 'notfree') {countNotFree++}});
    if (countNotFree === 4) {
      // if there are four un-free ghosts, make the eyes display none
      let eyeballs = Array.from(item.item.getElementsByClassName('eyeball'));
      let pupils = Array.from(item.item.getElementsByClassName('pupil'));
      eyeballs.forEach(x=>x.style.display = 'none');
      pupils.forEach(x=>x.style.display = 'none');
    }
    else if (countNotFree < 4) {
      // else make everything else display
      item.item.backgroundColor = item.color;
      let fringes = Array.from(item.item.getElementsByClassName('fringe'))
      fringes.forEach(fringe => {
        if (fringe.style.backgroundColor !== '' && fringe.style.backgroundColor !== 'transparent') {
          fringe.style.backgroundColor = item.color;
          fringe.style.display = '';
        } else {
          let bgimage = fringe.style.backgroundImage;
          let newBgimage = bgimage.replace('blue',item.color);
          fringe.style.backgroundImage = newBgimage;
          fringe.style.display = '';
        }
      })
      let frowns = Array.from(item.item.getElementsByClassName('blue-frown'));
      frowns.forEach(frown => frown.style.display = 'none')
      let blueeyes = Array.from(item.item.getElementsByClassName('blue-pupil'));
      blueeyes.forEach(eye => eye.style.display = 'none')

    }

  }

}



function munchMode() {

  if (stop === false) {

    // make free ghosts blue, turn off their eyes and turn on their frowns
    if (powerCount === 0) {
      ghosts.forEach(ghost=>{

        if (ghost.free === 'free') {

          ghost.item.style.backgroundColor = 'blue';

          let fringes = Array.from(ghost.item.getElementsByClassName('fringe'));
          fringes.forEach(fringe=> {
            if (fringe.style.backgroundColor === ghost.color) {fringe.style.backgroundColor = 'blue';}
            else {
              let gradient = fringe.style.backgroundImage;
              let newGradient = gradient.replace(ghost.color,'blue');
              fringe.style.backgroundImage = newGradient;
            }
            
          })

          let eyeballs = Array.from(ghost.item.getElementsByClassName('eyeball'));
          eyeballs.forEach(eye => eye.style.display = 'none');

          let pupils = Array.from(ghost.item.getElementsByClassName('pupil'));
          pupils.forEach(pupil=> pupil.style.display = 'none');

          let frowns = Array.from(ghost.item.getElementsByClassName('blue-frown'));
          frowns.forEach(frown=> frown.style.display = '');

          let frownEyes = Array.from(ghost.item.getElementsByClassName('blue-pupil'));
          frownEyes.forEach(eye=> eye.style.display = '');

        }

      })
    }

  else if (powerCount < 80) {
      console.log('woo');
    }

    // flashing while winding down - count 80 (4 seconds)
    else if (powerCount < 120) {
      console.log("rut roh");
    }

    // done - count 120 (6 seconds)
    else if (powerCount >= 120) {

      // make everything normal again
      ghosts.forEach(ghost=>{

        if (ghost.free === 'free') {
          ghost.item.style.backgroundColor = ghost.color;

          let fringes = Array.from(ghost.item.getElementsByClassName('fringe'));
          fringes.forEach(fringe=> {
            if (fringe.style.backgroundColor === 'blue') {fringe.style.backgroundColor = ghost.color;}
            else {
              let gradient = fringe.style.backgroundImage;
              let newGradient = gradient.replace('blue',ghost.color);
              fringe.style.backgroundImage = newGradient;
            }
            
          })
          let eyeballs = Array.from(ghost.item.getElementsByClassName('eyeball'));
          eyeballs.forEach(eye => eye.style.display = '');

          let pupils = Array.from(ghost.item.getElementsByClassName('pupil'));
          pupils.forEach(pupil=> pupil.style.display = '');

          let frowns = Array.from(ghost.item.getElementsByClassName('blue-frown'));
          frowns.forEach(frown=> frown.style.display = 'none');

          let frownEyes = Array.from(ghost.item.getElementsByClassName('blue-pupil'));
          frownEyes.forEach(eye=> eye.style.display = 'none');

        }

      })

      // stop function
      powerCount = 0;
      return true;

    }

    powerCount++

  }

  setTimeout(munchMode,50);

}

function teleport(item) {

  if (item.position.x <= 0 && item.direction === 'left') {
    item.position.x = (board[0].length - 2) * cellW;
    item.rcPos.col = board[0].length - 2;
    item.rcPos.colM = board[0].length - 1;
  }

  else if (item.position.x > (board[0].length - 2) * cellW && item.direction === 'right') {
    item.position.x = 0;
    item.rcPos.col = 0;
    item.rcPos.colM = 1;
  }

}