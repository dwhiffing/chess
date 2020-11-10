import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import {
  getPossibleMoves,
  getMove,
  getIsInCheck,
  getIsInCheckMate,
  getIsInStaleMate,
  getInitialGrid,
} from '../../lib/chess'
import { ChessRoom } from '../components/ChessRoom'
import { Action } from '../components/Action'

export function LocalRoom({ setLocalRoom }) {
  const [grid, setGrid] = useState(getInitialGrid())
  const [turnIndex, setTurnIndex] = useState(0)
  const [selectedTile, selectTile] = useState()

  const moveTile = (a, b) => {
    if (!a.value) return

    setGrid(getMove(grid, a, b))
    setTurnIndex((index) => (index === 0 ? 1 : 0))
  }

  const canTileMove = (tileA, tileB) =>
    getPossibleMoves(grid, tileA).includes(tileB.index)

  const chess = {
    grid,
    turnIndex,
    moveTile,
    inCheck: getIsInCheck(grid, turnIndex),
    inCheckMate: getIsInCheckMate(grid, turnIndex),
    inStaleMate: getIsInStaleMate(grid, turnIndex),
  }

  const handleClickTile = ({ tile }) => {
    if (chess.inCheckMate) return

    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      if (canTileMove(selectedTile, tile)) moveTile(selectedTile, tile)

      selectTile(null)
      return
    }

    if (tile.value && chess.turnIndex === tileType) selectTile(tile)
  }

  return (
    <Flex variant="column">
      <Action onClick={() => setLocalRoom(false)}>Leave</Action>
      <ChessRoom
        {...chess}
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </Flex>
  )
}
