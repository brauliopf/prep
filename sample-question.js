// form the moment we take the input, consider it 1-indexed

const board = [];
const mines = ["0_2", "1_2"];
const N = 4;

for (i = 0; i < N; i++) {
  board[i] = Array(N).fill("-");
}

for (mine of mines) {
  rc = mine.split("_");
  board[rc[0]][rc[1]] = "*";
}

console.log(board);

function hasMine(row, col) {
  const indexMine = mines.indexOf(`${row}_${col}`);
  return indexMine >= 0;
}
// console.log(checkMine(1, 2), checkMine(1, 3));

function hasMineAndReveal(row, col) {
  // If already revealed or out of bounds, exit
  if (row < 0 || col < 0 || row >= N || col >= N || board[row][col] !== "-") {
    return false;
  }

  // If it's a mine, mark it and return true
  if (hasMine(row, col)) {
    board[row][col] = "*";
    return true;
  }

  // Count adjacent mines
  let mineCount = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newCol >= 0 &&
      newRow < N &&
      newCol < N &&
      hasMine(newRow, newCol)
    ) {
      mineCount++;
    }
  }

  // Reveal current square
  board[row][col] = mineCount;

  // If zero mines, recursively reveal adjacent squares
  if (mineCount === 0) {
    for (const [dx, dy] of directions) {
      hasMineAndReveal(row + dx, col + dy);
    }
  }

  return false;
}
// console.log(revealSquare(1, 3));

// GET INPUT
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// check end of game
function hasCoveredSquares() {
  return !(board.flat().indexOf("-") === -1);
}

async function play() {
  /* return false when uncover a mine and true otherwise
   */
  return new Promise((resolve) => {
    rl.question(
      "What row and col do you want to uncover (1-indexed)? (Enter as a CSV: 1,2): ",
      (rc) => {
        // handle wrong input
        if (rc.indexOf(",") === -1) {
          console.log(
            "Invalid input. Please enter values as a CSV (e.g. 1,2 or 3,6)"
          );
          return resolve();
        }
        const values = rc.split(",");
        if (values[0] < 1 || values[1] < 1 || values[0] > N || values[1] > N) {
          console.log(`Please enter values between 1 and ${N}`);
          return resolve();
        }

        // handle correct input
        // revealSquare return false if mine and true otherwise
        if (hasMineAndReveal(values[0] - 1, values[1] - 1)) {
          console.log("revealSquare", values);
          return resolve(true);
        }
        resolve(false); // resolve true ==== go on!
      }
    );
  });
}

(async () => {
  let uncovered_a_mine = false;
  while (hasCoveredSquares() && !uncovered_a_mine) {
    uncovered_a_mine = await play(); // false if mine
    console.log(board);
    console.log(hasCoveredSquares(), uncovered_a_mine);
  }
  if (uncovered_a_mine) {
    console.log("Game Over! Nice try.");
  } else {
    console.log("Congratulations! You've uncovered all non-mine squares.");
  }

  rl.close();
})();
