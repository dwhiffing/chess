import React, { useState } from 'react'
import {
  getPossibleMoves,
  getActiveCheck,
  getActiveCheckmate,
  getIsInStaleMate,
  getInitialGrid,
  getAIMove,
  performMove,
  getPassantIndex,
  getCastleStatus,
} from '../../lib/chess'
import { ChessRoom } from '../components/ChessRoom'
import { Action } from '../components/Action'

export function LocalRoom({ aiRoom, setLocalRoom, setAIRoom }) {
  const [grid, setGrid] = useState(getInitialGrid())
  const [turnIndex, setTurnIndex] = useState(0)
  const [selectedTile, selectTile] = useState()
  const [passantIndex, setPassantIndex] = useState(null)
  const [castleStatus, setCastleStatus] = useState('kqKQ')
  const [lastMoveIndex, setLastMoveIndex] = useState([])

  const canTileMove = (tileA, tileB) =>
    getPossibleMoves(grid, tileA, {
      passantIndex,
      castleStatus,
    }).includes(tileB.index)

  const chess = {
    grid,
    turnIndex,
    lastMoveIndex,
    passantIndex,
    castleStatus,
    activeCheck: getActiveCheck(grid, turnIndex),
    activeCheckmate: getActiveCheckmate(grid, turnIndex),
    inStaleMate: getIsInStaleMate(grid, turnIndex),
  }

  const moveTiles = (a, b) => {
    setLastMoveIndex([a.index, b.index])
    setTurnIndex((i) => (i === 0 ? 1 : 0))
    setGrid((grid) => {
      setPassantIndex(getPassantIndex(a, b))
      setCastleStatus((cs) => getCastleStatus(cs, a))
      return performMove(grid, a, b)
    })
  }

  const handleClickTile = ({ tile }) => {
    if (chess.activeCheckmate) return

    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      if (canTileMove(selectedTile, tile)) {
        if (!selectedTile.value) return

        moveTiles(selectedTile, tile)

        if (aiRoom)
          setTimeout(
            () =>
              setGrid((grid) => {
                const move = getAIMove(grid)
                move && moveTiles(...move)
                return grid
              }),
            500,
          )
      }

      return selectTile(null)
    }

    if (tile.value && chess.turnIndex === (aiRoom ? 0 : tileType))
      selectTile(tile)
  }

  return (
    <div className="container full">
      <Action
        style={{ margin: '12px auto', width: '100%', maxWidth: 500 }}
        onClick={() => {
          setAIRoom(false)
          setLocalRoom(false)
        }}
      >
        Leave
      </Action>

      <ChessRoom
        {...chess}
        showMessages
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </div>
  )
}
