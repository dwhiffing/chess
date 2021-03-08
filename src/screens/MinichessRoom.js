import React, { useEffect, useState } from 'react'
import { Flex } from '../components/Flex'
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
  setConfig,
} from '../../lib/chess'
import { ChessRoom } from '../components/ChessRoom'

export function MinichessRoom({ aiRoom, setLocalRoom, setAIRoom }) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [selectedTile, selectTile] = useState()
  const [passantIndex, setPassantIndex] = useState(null)
  const [castleStatus, setCastleStatus] = useState('kqKQ')
  const [lastMoveIndex, setLastMoveIndex] = useState([])
  const [grid, setGrid] = useState(getInitialGrid())

  const resetGame = (type = 'petty') => {
    setConfig(type)
    setTurnIndex(0)
    selectTile()
    setPassantIndex(null)
    setCastleStatus('kqKQ')
    setLastMoveIndex([])
    setGrid(getInitialGrid())
  }

  useEffect(() => {
    resetGame('petty')
  }, [])

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
    <Flex className="container mini" variant="column">
      <select
        onChange={(e) => {
          resetGame(e.target.value)
        }}
      >
        {GAMES.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
      <ChessRoom
        {...chess}
        alternate
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </Flex>
  )
}

const GAMES = ['petty', 'speed', 'quick', 'elena', 'attack', 'minit']
