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
  if (hasMine(row, col)) {
    return true;
  }

  // get number of mines around
  // loop through aux vectors and checkMine
  function countMinesAround(row, col) {
    let countMines = 0;
    pointers = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (aux of pointers) {
      const nSquare = [];
      // new row
      nSquare.push(row + aux[0]);
      // new col
      nSquare.push(col + aux[1]);
      // skip row col
      if (
        ((nSquare[0] === row) & (nSquare[1] === col)) |
        (nSquare[0] < 0) |
        (nSquare[1] < 0) |
        (nSquare[0] > N - 1) |
        (nSquare[1] > N - 1)
      ) {
        continue;
      }

      if (hasMine(nSquare[0], nSquare[1])) {
        countMines += 1;
      }
    }
    return countMines;
  }

  board[row][col] = countMinesAround(row, col);

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
