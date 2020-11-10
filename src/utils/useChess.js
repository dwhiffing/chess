import { useState } from 'react'
import { INITIAL_GRID } from '../constants'
import {
  getPossibleMoves,
  getMove,
  getIsInCheck,
  getIsInCheckMate,
  getIsInStaleMate,
} from './chess'

export const useChess = () => {
  const [grid, setGrid] = useState(INITIAL_GRID)
  const [turnIndex, setTurnIndex] = useState(0)

  const moveTile = (a, b) => {
    if (!a.value) return

    setGrid(getMove(grid, a, b))
    setTurnIndex((index) => (index === 0 ? 1 : 0))
  }

  const canTileMove = (tileA, tileB) =>
    getPossibleMoves(grid, tileA).includes(tileB.index)

  return {
    grid,
    turnIndex,
    moveTile,
    canTileMove,
    inCheck: getIsInCheck(grid, turnIndex),
    inCheckMate: getIsInCheckMate(grid, turnIndex),
    inStaleMate: getIsInStaleMate(grid, turnIndex),
  }
}
