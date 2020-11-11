import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import {
  getPossibleMoves,
  getActiveCheck,
  getActiveCheckmate,
  getIsInStaleMate,
  getInitialGrid,
  getAIMove,
  performMove,
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

  const checkPassant = (a, b) => {
    // TODO: refactor
    // set passant index
    if (a.value.toLowerCase() === 'p' && Math.abs(a.index - b.index) > 8) {
      setPassantIndex(a.index + (a.value === a.value.toLowerCase() ? -8 : 8))
    } else {
      setPassantIndex(null)
    }
  }

  const checkCastle = (a) => {
    // handle castle status after move
    // TODO: need to handle which rook was moved and only disable that side for castling, and move to chess lib
    if (a.value === 'k' || a.value === 'r') {
      setCastleStatus((c) => c.replace(/kq/, ''))
    }
    if (a.value === 'K' || a.value === 'R') {
      setCastleStatus((c) => c.replace(/KQ/, ''))
    }
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

        checkPassant(selectedTile, tile)
        checkCastle(selectedTile, tile)

        setLastMoveIndex([selectedTile.index, tile.index])
        _grid = performMove(grid, selectedTile, tile)
        _turnIndex = _turnIndex === 0 ? 1 : 0

        if (aiRoom) {
          setTimeout(() => {
            const aiMove = getAIMove(_grid)
            setGrid(performMove(_grid, aiMove.from, aiMove.to))
            checkPassant(aiMove.from, aiMove.to)
            checkCastle(aiMove.from, aiMove.to)
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
