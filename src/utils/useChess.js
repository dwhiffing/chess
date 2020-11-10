import { useState } from 'react'
import { INITIAL_GRID } from '../constants'

export const useChess = () => {
  const [turnIndex, setTurnIndex] = useState(0)
  const [grid, setGrid] = useState(INITIAL_GRID)

  const getIsBlack = (tile) => tile.value === tile.value.toUpperCase()
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
                ? null
                : tile.value,
          }))
        : grid,
    )
  }

  const getMoves = (tile, n) => {
    let moves = []
    let index = tile.index + n
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
      index += n
    }
    return moves
  }

  // TODO: needs to only allow capturing enemy
  const getAdjacentMoves = ({ index: i, value }) => {
    const isBlack = getIsBlack({ index: i, value })
    return [i + 7, i + 8, i + 9, i - 7, i - 8, i - 9, i - 1, i + 1].filter(
      (m) =>
        m &&
        grid.find(
          ({ index, value }) =>
            m === index &&
            (!value ||
              (value && isBlack
                ? value.toLowerCase() === value
                : value.toUpperCase() === value)),
        ),
    )
  }

  const getOrthagonalMoves = (tile) => [
    ...getMoves(tile, -8),
    ...getMoves(tile, 8),
    ...getMoves(tile, -1),
    ...getMoves(tile, 1),
  ]

  const getDiagonalMoves = (tile) => [
    ...getMoves(tile, -7),
    ...getMoves(tile, -9),
    ...getMoves(tile, 7),
    ...getMoves(tile, 9),
  ]

  const getPawnMoves = (tile) => {
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

  const getPossibleMoves = (tile) => {
    if (tile.value.toLowerCase() === 'p') {
      return getPawnMoves(tile)
    }
    if (tile.value.toLowerCase() === 'k') {
      return getAdjacentMoves(tile)
    }
    if (tile.value.toLowerCase() === 'r') {
      return getOrthagonalMoves(tile)
    }
    if (tile.value.toLowerCase() === 'b') {
      return getDiagonalMoves(tile)
    }
    if (tile.value.toLowerCase() === 'q') {
      return [...getOrthagonalMoves(tile), ...getDiagonalMoves(tile)]
    }
    if (tile.value.toLowerCase() === 'n') {
      const isBlack = getIsBlack(tile)
      let x = tile.index % 8
      const moves = [
        // top right
        x <= 6 && tile.index - 15,
        x <= 5 && tile.index - 6,
        // bottom right
        x <= 6 && tile.index + 17,
        x <= 5 && tile.index + 10,
        // top left
        x >= 1 && tile.index - 17,
        x >= 2 && tile.index - 10,
        // bottom left
        x >= 1 && tile.index + 15,
        x >= 2 && tile.index + 6,
      ].filter(
        (m) =>
          m &&
          grid.find(
            ({ index, value }) =>
              m === index &&
              (!value ||
                (value && isBlack
                  ? value.toLowerCase() === value
                  : value.toUpperCase() === value)),
          ),
      )

      return moves
    }
  }

  const canTileMove = (tileA, tileB) => {
    return getPossibleMoves(tileA).includes(tileB.index)
  }

  return { grid, moveTile, nextTurn, turnIndex, canTileMove }
}
