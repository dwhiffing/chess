import { useState } from 'react'
import { INITIAL_GRID } from '../constants'

export const useChess = () => {
  const [turnIndex, setTurnIndex] = useState(0)
  const [grid, setGrid] = useState(INITIAL_GRID)
  const nextTurn = () => setTurnIndex((index) => (index === 0 ? 1 : 0))
  const moveTile = (tileA, tileB) => {
    nextTurn()
    setGrid(
      tileA.value
        ? grid.map((tile) => ({
            ...tile,
            value:
              tile.index === tileB.index
                ? tileA.value
                : tile.index === tileA.index
                ? ''
                : tile.value,
          }))
        : grid,
    )
  }

  const canTileMove = (tileA, tileB) => {
    return getPossibleMoves(grid, tileA)
      .filter((i) => {
        if (!grid[i]) return false
        if (grid[i].value === '') return true
        return getIsBlack(tileA) ? !getIsBlack(grid[i]) : getIsBlack(grid[i])
      })
      .includes(tileB.index)
  }

  return { grid, moveTile, nextTurn, turnIndex, canTileMove }
}

const getPossibleMoves = (grid, tile) => {
  if (tile.value.toLowerCase() === 'p') {
    return getPawnMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'k') {
    return getAdjacentMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'r') {
    return getOrthagonalMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'b') {
    return getDiagonalMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'q') {
    return [...getOrthagonalMoves(grid, tile), ...getDiagonalMoves(grid, tile)]
  }
  if (tile.value.toLowerCase() === 'n') {
    return getKnightMoves(grid, tile)
  }
}

const getIsBlack = ({ value = '' }) => value === value.toUpperCase()

const getAdjacentMoves = (sourceTile) => {
  const i = sourceTile.index
  return [i + 7, i + 8, i + 9, i - 7, i - 8, i - 9, i - 1, i + 1]
}

const getOrthagonalMoves = (grid, tile) => [
  ...getDirectionalMoves(grid, tile, -8),
  ...getDirectionalMoves(grid, tile, 8),
  ...getDirectionalMoves(grid, tile, -1),
  ...getDirectionalMoves(grid, tile, 1),
]

const getDiagonalMoves = (grid, tile) => [
  ...getDirectionalMoves(grid, tile, -7),
  ...getDirectionalMoves(grid, tile, -9),
  ...getDirectionalMoves(grid, tile, 7),
  ...getDirectionalMoves(grid, tile, 9),
]

const getKnightMoves = (grid, tile) => {
  let x = tile.index % 8
  return [
    x <= 6 && tile.index - 15,
    x <= 5 && tile.index - 6,
    x <= 6 && tile.index + 17,
    x <= 5 && tile.index + 10,
    x >= 1 && tile.index - 17,
    x >= 2 && tile.index - 10,
    x >= 1 && tile.index + 15,
    x >= 2 && tile.index + 6,
  ]
}

const getPawnMoves = (grid, tile) => {
  let moves = []
  const isBlack = getIsBlack(tile)
  let multi = isBlack ? 1 : -1
  let startCoords = isBlack ? [8, 15] : [48, 55]

  const forwardOne = grid.find(
    ({ index, value }) => index === tile.index + 8 * multi && !value,
  )
  if (forwardOne) {
    moves.push(forwardOne.index)
    if (tile.index >= startCoords[0] && tile.index <= startCoords[1]) {
      const forwardTwo = grid.find(
        ({ index, value }) => index === tile.index + 16 * multi && !value,
      )
      if (forwardTwo) moves.push(forwardTwo.index)
    }
  }

  const tileLeft = grid.find(
    ({ index, value }) =>
      index === tile.index + 9 * multi &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )
  const tileRight = grid.find(
    ({ index, value }) =>
      index === tile.index + 7 * multi &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )
  if (tileLeft) moves.push(tile.index + 9 * multi)
  if (tileRight) moves.push(tile.index + 7 * multi)

  return moves
}

const getDirectionalMoves = (grid, tile, directionIndex) => {
  let moves = []
  let index = tile.index + directionIndex
  const isBlack = getIsBlack(tile)
  let x = index % 8
  while (index >= 0 && index <= 63 && Math.abs(x - (index % 8)) <= 1) {
    const _tile = grid.find((t) => t.index === index)
    if (_tile && _tile.value) {
      if (
        isBlack
          ? _tile.value === _tile.value.toLowerCase()
          : _tile.value === _tile.value.toUpperCase()
      )
        moves.push(_tile.index)
      return moves
    }
    x = index % 8
    moves.push(index)
    index += directionIndex
  }
  return moves
}
