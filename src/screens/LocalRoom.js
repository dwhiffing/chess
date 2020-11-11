import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import {
  getPossibleMoves,
  getMove,
  getActiveCheck,
  getActiveCheckmate,
  getIsInStaleMate,
  getInitialGrid,
  getAIMove,
} from '../../lib/chess'
import { ChessRoom } from '../components/ChessRoom'
import { Action } from '../components/Action'

export function LocalRoom({ aiRoom, setLocalRoom, setAIRoom }) {
  const [grid, setGrid] = useState(getInitialGrid())
  const [turnIndex, setTurnIndex] = useState(0)
  const [selectedTile, selectTile] = useState()
  const [lastMoveIndex, setLastMoveIndex] = useState([])

  const canTileMove = (tileA, tileB) =>
    getPossibleMoves(grid, tileA).includes(tileB.index)

  const chess = {
    grid,
    turnIndex,
    lastMoveIndex,
    activeCheck: getActiveCheck(grid, turnIndex),
    activeCheckmate: getActiveCheckmate(grid, turnIndex),
    inStaleMate: getIsInStaleMate(grid, turnIndex),
  }

  const handleClickTile = ({ tile }) => {
    if (chess.activeCheckmate) return

    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      let _grid = chess.grid
      let _turnIndex = turnIndex
      if (canTileMove(selectedTile, tile)) {
        if (!selectedTile.value) return

        setLastMoveIndex([selectedTile.index, tile.index])
        _grid = getMove(grid, selectedTile, tile)
        _turnIndex = _turnIndex === 0 ? 1 : 0

        if (aiRoom) {
          setTimeout(() => {
            setGrid(getAIMove(_grid))
            setTurnIndex(_turnIndex === 0 ? 1 : 0)
          }, 500)
        }

        setGrid(_grid)
        setTurnIndex(_turnIndex)
      }

      selectTile(null)

      return
    }

    if (tile.value && chess.turnIndex === tileType) selectTile(tile)
  }

  return (
    <Flex className="container" variant="column">
      <Action
        onClick={() => {
          setAIRoom(false)
          setLocalRoom(false)
        }}
      >
        Leave
      </Action>
      <ChessRoom
        {...chess}
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </Flex>
  )
}
