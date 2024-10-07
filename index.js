const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const difficultySelect = document.getElementById('difficulty');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let darkModeEnabled = false;
 
// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
 
// Function to reset the board and UI
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    result.classList.add('hidden');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}
 
// Function to check if a player has won
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells(combination);
            return board[a];
        }
    }
    return null;
}
 
// Highlight the winning cells
function highlightWinningCells([a, b, c]) {
    cells[a].classList.add('winning-cell');
    cells[b].classList.add('winning-cell');
    cells[c].classList.add('winning-cell');
}
 
// Check if the board is full (for a tie)
function isBoardFull() {
    return board.every(cell => cell !== '');
}
 
// Easy level AI: Random move
function easyMove() {
    const availableCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, 'O');
}
 
// Medium level AI: Block player or make random move
function mediumMove() {
    // Try to win
    for (let [a, b, c] of winningCombinations) {
        if (board[a] === 'O' && board[b] === 'O' && !board[c]) return makeMove(c, 'O');
        if (board[a] === 'O' && board[c] === 'O' && !board[b]) return makeMove(b, 'O');
        if (board[b] === 'O' && board[c] === 'O' && !board[a]) return makeMove(a, 'O');
    }
 
    // Block the player
    for (let [a, b, c] of winningCombinations) {
        if (board[a] === 'X' && board[b] === 'X' && !board[c]) return makeMove(c, 'O');
        if (board[a] === 'X' && board[c] === 'X' && !board[b]) return makeMove(b, 'O');
        if (board[b] === 'X' && board[c] === 'X' && !board[a]) return makeMove(a, 'O');
    }
 
    // Random move if no immediate win or block
    easyMove();
}
 
// Hard level AI: Minimax algorithm for optimal move
function minimax(newBoard, player) {
    const availableCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
 
    // Base cases
    const winner = checkWinner();
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };
 
    const moves = [];
 
    // Loop through available spots
    for (let i = 0; i < availableCells.length; i++) {
        const move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = player;
 
        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }
 
        newBoard[availableCells[i]] = '';
        moves.push(move);
    }
 
    // Choose the best move
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }
 
    return bestMove;
}
 
// Computer's move based on difficulty
function computerMove() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        easyMove();
    } else if (difficulty === 'medium') {
        mediumMove();
    } else if (difficulty === 'hard') {
        const bestMove = minimax([...board], 'O');
        makeMove(bestMove.index, 'O');
    }
}
 
// Function to make a move
function makeMove(index, player) {
    if (board[index] === '') {
        board[index] = player;
        cells[index].textContent = player;
 
        const winner = checkWinner();
        if (winner) {
            result.textContent = `${winner} wins!`;
            result.classList.remove('hidden');
            window.location.raload();
            setTimeout(resetGame, 2000);
        } else if (isBoardFull()) {
            result.textContent = 'It\'s a tie!';
            result.classList.remove('hidden');
            setTimeout(resetGame, 2000);
        } else if (player === 'X') {
            // Delay the computer's move by 0.5 seconds
            setTimeout(() => {
                computerMove();
            }, 100);
        }
    }
}
 
// Function to handle player clicks
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] === '' && currentPlayer === 'X') {
        makeMove(index, 'X');
    }
}
 
// Toggle dark mode
toggleDarkModeBtn.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    darkModeEnabled = !darkModeEnabled;
});
 
// Attach event listeners to cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
 
// Initialize the game on page load
resetGame();