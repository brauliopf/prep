const N = 5
const board = new Array()
for (i=0; i<N; i++){
  board.push(new Array(5).fill('.'))
}
const occupied = new Set()

function displayEmptyBoard(N, board){
  for (row of board){
    console.log(` ${'-'.repeat(3)}`.repeat(5))
    console.log(`| ${row.join(' | ')} |`)
  }
  console.log(` ${'-'.repeat(3)}`.repeat(5))
}

class Node {
  constructor(row, col, next=null) {
    this.row = row
    this.col = col
    this.next = next
  }
}

class worm {
  constructor(row, col, color) {
    this.head = new Node(row, col)
    this.color = color
    this.length = 1
  }

  move(row, col) {
    const temp = this.head
    this.head = new Node(row, col, temp)
    if (this.length === 4) {
      const last = this.head.next.next.next
      board[last.next.row][last.next.col] = '.'
      occupied.delete(`${last.next.row}_${last.next.col}`)
      last.next = null
    }
    else {
      board[temp.row][temp.col] = board[temp.row][temp.col].toLowerCase()
      this.length += 1
    }
  }
}

const worms = [new worm(3,1,'B'), new worm(0,2,'R')]

function displayWorms(worms) {
  for (w of worms) {
    let wp = w.head
    let head = true

    do{
      board[wp.row][wp.col] = head ? w.color : w.color.toLowerCase()
      occupied.add(`${w.head.row}_${w.head.col}`)
      head = false
      if(wp.next){
        wp = wp.next
      }
    } while(wp.next)
  } 
}

function checkOutOfBounds(w, dir){
  const newRow = w.head.row+dir[0]
  const newCol = w.head.col+dir[1]
  if (newRow < 0 || newRow >= N || newCol < 0 || newCol >= N) {
    console.log('input out of bounds')
    return true
  }
  return false
}

function checkEmpty(w, dir){
  const newRow = w.head.row+dir[0]
  const newCol = w.head.col+dir[1]
  
  if (occupied.has(`${newRow}_${newCol}`)) {
    console.log('occupied square')
    return false
  }
  return true
}

function MoveWorm(direction, color){
  const directions = new Map([
    ['up', [-1,0]],
    ['down', [1,0]],
    ['left', [0,-1]],
    ['right', [0,1]]
  ])
  const dir = directions.get(direction)
  const w = color === 'R' ? worms[1] : worms[0]
  
  if (!checkOutOfBounds(w, dir) && checkEmpty(w, dir)) {
    w.move(w.head.row+dir[0], w.head.col+dir[1])
  } else {
    return false;
  }
  return true;
}

function checkPotentialMoves(row, col){
  const directions = new Map([
    ['up', [-1,0]],
    ['down', [1,0]],
    ['left', [0,-1]],
    ['right', [0,1]]
  ])
  const alternatives = Array.from(directions.values()).map(dir => {
    newRow = row+dir[0]
    newCol = col+dir[1]
    if (newRow < 0 || newCol < 0 || newRow > N-1 || newCol > N-1 || occupied.has(`${newRow}_${newCol}`)){
      return null
    }
    return 'ok'
  })

  if (alternatives.filter(alt => alt !== null).length === 0) {
    return false
  }
  return true
}

const readline = require('node:readline')
const process = require('node:process')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout})

function getInput (color) {
  return new Promise ((resolve) => (
    rl.question(`${color} move: `, answer => resolve(answer))
  ))
}

(async () => {
  let goRed = true
  let gameOver = false
  while(!gameOver && (occupied.size < N**2)){
    displayWorms(worms)
    displayEmptyBoard(N, board)
  
    if (goRed) {
      const input = await getInput('Red')
      if (!["up", 'down', 'left', 'right'].includes(input)){
        continue;
      }
      const movedWorm = MoveWorm(input, 'R')
      if(movedWorm){
        goRed = false
      }

    } else {
      const input = await getInput('Blue')
      if (!["up", 'down', 'left', 'right'].includes(input)){
        continue;
      }
      if(MoveWorm(input, 'B')){
        goRed = true
      }
    }

    const hasMovesBlue = checkPotentialMoves(worms[0].head.row, worms[0].head.col)
    if (!hasMovesBlue){
      console.log('Red player wins')
      gameOver=true
    }
    const hasMovesRed = checkPotentialMoves(worms[1].head.row, worms[1].head.col)
    if(!hasMovesRed){
      console.log('Blue player wins')
      gameOver=true
    }

  }
})()