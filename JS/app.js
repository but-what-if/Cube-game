'use strict'

// class GameCube {
//
//   constructor(time) {
//     this.time = time;
//     this.gameBoard = document.getElementById('game-board');
//     this.start = document.getElementById('start-btn');
//     this.newGame = document.getElementById('new-game-btn');
//     this.pointsScreen = document.getElementById('points-screen');
//     this.timeScreen = document.getElementById('time-left-screen');
//     this.resultTable = document.getElementById('result-table');
//   }
//
//   countDown() {
//     let minutes = Math.floor(this.time / 60) < 10 ? '0' + Math.floor(this.time / 60): Math.floor(this.time / 60);
//     let seconds = this.time % 60 < 10 ? '0' + this.time % 60: this.time % 60;
//     this.timeScreen.innerHTML = `${minutes}:${seconds}`
//     this.time --
//   }
//
//   startGame() {
//     console.log(this.timeScreen);
//     setInterval(this.countDown, 1000)
//   }
//
//
// }
//
// let cube = new GameCube(60)


let time = 59;
let gameBoard = document.getElementById('game-board');
let start = document.getElementById('start-btn');
let newGame = document.getElementById('new-game-btn');
let pointsScreen = document.getElementById('points-screen');
let timeScreen = document.getElementById('time-left-screen');
let resultTable = document.getElementById('result-table');
let modal = document.getElementById("modal");

let inputName = document.getElementById("input-name");


let timeCount;
let cubes = {
  'red': 10,
  'yellow': 12,
  'green': 14,
  'blue': 20
}
let cubeIDs = []
for (let cube in cubes) {
  cubeIDs.push(cube);
}
let star = {'star': 50}

function countDown() {
    let minutes = Math.floor(time / 60) < 10 ? '0' + Math.floor(time / 60): Math.floor(time / 60);
    let seconds = time % 60 < 10 ? '0' + time % 60: time % 60;
    timeScreen.innerHTML = `${minutes}:${seconds}`;
    if (time <= 0) {
      clearInterval(timeCount);
      timeOver();
    };
    time --;
}

function startGame() {
  if (gameBoard.innerHTML != '') {
    let elem = gameBoard.firstElementChild;
    gameBoard.removeChild(elem);
    timeCount = setInterval(countDown, 1000);
    drawCubes();
  } else {
    timeCount = setInterval(countDown, 1000);
    drawCubes();
  }

}


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function drawStar() {
  let pic = document.createElement('img');
  let child = gameBoard.appendChild(pic);
  child.src = `images/star.jpg`;
  child.style.position = 'absolute';
  child.style.top = `${getRandomArbitrary(10, 90)}%`;
  child.style.left = `${getRandomArbitrary(10, 90)}%`;
  child.style.cursor = 'pointer';
}



function drawCubes() {
    shuffle(cubeIDs);
    let randomItems = getRandomArbitrary(0, cubeIDs.length-2);
    for(let i = 0; i < randomItems; i ++) {
        let pic = document.createElement('img');
        let child = gameBoard.appendChild(pic);
        child.id = cubeIDs[i];
        child.src = `images/${cubeIDs[i]}_cube.jpg`;
        child.style.position = 'absolute';
        child.style.top = `${getRandomArbitrary(10, 90)}%`;
        child.style.left = `${getRandomArbitrary(10, 90)}%`;
        child.style.cursor = 'pointer';
        child.style.border = '2px solid black';
        child.addEventListener('click', function() {
            switch (cubeIDs[i]) {
              case 'red':
                pointsScreen.innerHTML = parseInt(pointsScreen.innerHTML) + cubes.red
                gameBoard.removeChild(child);
                drawCubes();
                break;
              case 'yellow':
                pointsScreen.innerHTML = parseInt(pointsScreen.innerHTML) + cubes.yellow
                gameBoard.removeChild(child);
                drawCubes();
                break;
              case 'green':
                pointsScreen.innerHTML = parseInt(pointsScreen.innerHTML) + cubes.green
                gameBoard.removeChild(child);
                drawCubes();
                break;
              case 'blue':
                pointsScreen.innerHTML = parseInt(pointsScreen.innerHTML) + cubes.blue
                gameBoard.removeChild(child);
                drawCubes();
                break;
              default:
                pointsScreen.innerHTML = '0'
            };
        });
    }

}


function timeOver() {
  gameBoard.innerHTML = '';

  setTimeout(function() {
    let finishGame = document.createElement('h1');
    gameBoard.appendChild(finishGame).classList = 'start-game-title';
    gameBoard.appendChild(finishGame).innerHTML = 'Good game!';
    let finishGameBtn = document.createElement('button');
    let finishGameBtnChild = gameBoard.appendChild(finishGameBtn);
    finishGameBtnChild.classList = 'btn btn-success finish-game-button';
    finishGameBtnChild.type = 'button';
    finishGameBtnChild.innerHTML = 'Save your results';
    finishGameBtnChild.addEventListener('click', () => showModal())
  }, 1000);
}


function addResult(result) {
    let resultWrapper = document.createElement('p');
    let yourResult = document.createElement('span');
    let deleteResultBtn = document.createElement('span');
    resultWrapper.appendChild(deleteResultBtn);
    resultWrapper.appendChild(yourResult);
    resultTable.appendChild(resultWrapper);
    deleteResultBtn.innerHTML = '&times;';
    deleteResultBtn.style.cursor = 'pointer';
    deleteResultBtn.style.color = 'red';
    deleteResultBtn.addEventListener('click', function(e) {
      removeResultsFromLS(e);
      resultTable.removeChild(e.target.parentElement);
    });
    yourResult.innerHTML = result;
    addResultsToLS(yourResult.innerHTML);
}

function removeAllResults() {
  localStorage.clear();
  resultTable.innerHTML = '';
}

function showModal() {
    modal.style.display = "block";
};

function closeModal() {
    modal.style.display = "none";
};


function startNewGame() {
  gameBoard.innerHTML = '';
  gameBoard.style.background = 'white';
  pointsScreen.innerHTML = '0';
  timeScreen.innerHTML = '01:00';
  time = 59;
}



// Local Storage


function getResultsFromLS() {
    let results;
    if(localStorage.getItem('results') === null) {
        results = [];
    } else {
        results = JSON.parse(localStorage.getItem('results'));
    }
    return results;
}

function addResultsToLS(result) {
    let results = getResultsFromLS();
    results.push(result);
    localStorage.setItem('results', JSON.stringify(results));
}

function showResultsFromLS() {
    let results = getResultsFromLS();
    results.forEach((result) => {
        addResult(result);
    })
}

function removeResultsFromLS(e) {
    let results;
    if(localStorage.getItem('results') === null) {
        results = [];
    } else {
        results = JSON.parse(localStorage.getItem('results'));
	      let indexOfCurrentResult = results.indexOf(e.target.parentElement.children[0].textContent);
        results.splice(indexOfCurrentResult, 1);
	      localStorage.setItem('results', JSON.stringify(results));
    }
}

document.addEventListener('DOMContentLoaded', showResultsFromLS);
