"use strict";

window.addEventListener('load', app);

let gameBoard = ['', '', '', '', '', '', '', '', '']; 
let turn = 0; // Keeps track if X or O user's turn
let winner = false;

// CREATE user
const user = (name) => {
  name = name;
  return {name};
 };

 let userX = user("");
 let userY = user("");

 // INITIALIZE APP
function app() {
  let inputField = document.querySelector('.input-field').focus();

  const adduserForm = document.getElementById('user-form');
  adduserForm.addEventListener('submit', addusers);

  let replayButton = document.querySelector('.replay-btn');
  replayButton.addEventListener('click', resetBoard);
}

// Add userS
function addusers(event) {
  event.preventDefault();

  if (this.user1.value === '' || this.user2.value === '') {
    alert('You Must Enter a Name for Each Field');
    return;
  }

  const userFormContainer = document.querySelector('.enter-users');
  const boardMain = document.querySelector('.board__main');
  userFormContainer.classList.add('hide-container');
  boardMain.classList.remove('hide-container');

  userX.name = this.user1.value;
  userY.name = this.user2.value;
  buildBoard();
}

// RETURN CURRENT user
function currentuser() {
  return turn % 2 === 0 ? 'X' : 'O';
}

// Resize squares in event browser is resized
window.addEventListener("resize", onResize);
function onResize() {
  let allCells = document.querySelectorAll('.board__cell');
  let cellHeight = allCells[0].offsetWidth;
  
  allCells.forEach( cell => {
    cell.style.height = `${cellHeight}px`;
  });
}

// Build Board
function buildBoard() {
  let resetContainer = document.querySelector('.reset');
  resetContainer.classList.remove('reset--hidden');

  onResize();
  addCellClickListener();
  changeBoardHeaderNames();
}

// CELL CLICK EVENT FOR user TO ATTEMPT TO MAKE MOVE
function makeMove(event) {
  console.log(turn);
  
  let currentCell = parseInt(event.currentTarget.firstElementChild.dataset.id);
  let cellToAddToken = document.querySelector(`[data-id='${currentCell}']`);
  
  if (cellToAddToken.innerHTML !== '') {
    console.log('This cell is already taken.');
    return;
  } else {
    if (currentuser() === 'X') {
      cellToAddToken.textContent = currentuser();
      gameBoard[currentCell] = 'X';
    } else {
      cellToAddToken.textContent = currentuser();
      gameBoard[currentCell] = 'O';
    }
  }
    
  // CHECK IF WE HAVE A WINNER
  isWinner();
    
  // Update turn count so next user can choose
  turn ++;

  // CHANGE BOARD HEADER INFO
  changeBoardHeaderNames();
}

function checkIfTie() {
  if (turn > 7) {
    alert('game over a tie')
  }
}

function isWinner() {
  const winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  winningSequences.forEach( winningCombos => {
    let cell1 = winningCombos[0];
    let cell2 = winningCombos[1];
    let cell3 = winningCombos[2];
    if (
      gameBoard[cell1] === currentuser() &&
      gameBoard[cell2] === currentuser() &&
      gameBoard[cell3] === currentuser()
    ) {

      
      const cells = document.querySelectorAll('.board__cell');
      let letterId1 = document.querySelector(`[data-id='${cell1}']`);
      let letterId2 = document.querySelector(`[data-id='${cell2}']`);
      let letterId3 = document.querySelector(`[data-id='${cell3}']`);
      
      cells.forEach( cell => {
        let cellId = cell.firstElementChild.dataset.id;	

        if (cellId == cell1 || cellId == cell2 || cellId == cell3 ) {
          cell.classList.add('board__cell--winner');
        }
      });

      let currentuserText = document.querySelector('.board___user-turn');
      if (currentuser() === 'X') {
        currentuserText.innerHTML = `
          <div class="congratulations">Congratulations ${userX.name}</div>
          <div class="u-r-winner">You are our winner!</div>
        `;
        winner = true;
        removeCellClickListener();
        return true;
      } else {
        currentuserText.innerHTML = `
          <div class="congratulations">Congratulations ${userY.name}</div>
          <div class="u-r-winner">You are our winner!</div>
        `;
        winner = true;
        removeCellClickListener();
        return true;
      }
    }
  });

  if (!winner) {
    checkIfTie();
  }
  
  return false;
}

function changeBoardHeaderNames() {
  if (!winner) {
    let currentuserText = document.querySelector('.board___user-turn');
    if (currentuser() === 'X') {
      currentuserText.innerHTML = `
        <span class="name--style">${userX.name}</span>, you are up!
        <div class="u-r-winner"></div>
      `
    }  else {
      currentuserText.innerHTML = `
        <span class="name--style">${userY.name}</span>, you are up.
        <div class="u-r-winner"></div>
      `
    }
  }
}

function resetBoard() {
  console.log('resetting');
  
  gameBoard = ['', '', '', '', '', '', '', '', '']; 
  
  let cellToAddToken = document.querySelectorAll('.letter');
  cellToAddToken.forEach( square => {
    square.textContent = '';
    square.parentElement.classList.remove('board__cell--winner');
  });

  turn = 0;
  winner = false;

  let currentuserText = document.querySelector('.board___user-turn');
  currentuserText.innerHTML = `
    <span class="name--style">${userX.name}</span>, you are up!
    <div class="u-r-winner"></div>
  `

  addCellClickListener();
}

function addCellClickListener() {
  const cells = document.querySelectorAll('.board__cell');
  cells.forEach( cell => {
    cell.addEventListener('click', makeMove);
  });
}

function removeCellClickListener() {
  let allCells = document.querySelectorAll('.board__cell');
  allCells.forEach( cell => {
    cell.removeEventListener('click', makeMove);
  });
}

