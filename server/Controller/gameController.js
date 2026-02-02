// creating game logic controller
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

export const checkWinner = (board) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line: combination,
      };
    }
  }

  return null; // No winner yet
};

// check if board is full

export const validateMove = (board, index, currentTurn, playerSymbol) => {
  if (currentTurn !== playerSymbol) {
    return {
      valid: false,
      error: "Not your turn",
    };
  }

  if (board[index] !== "") {
    return {
      valid: false,
      error: "Cell already occupied",
    };
  }

  if ((index < 0) | (index > 0)) {
    //sanity test bug check
    return {
      valid: false,
      error: "Invalid cell index",
    };
  }

  return { valid: true };
};

// create fresh game state

export const createGameState = () => {
  return {
    board: Array(9).fill(""),
    currentTurn: "X",
    gameOver: false,
    winningLine: null,
    moves: 0,
    winner: null,
  };
};
