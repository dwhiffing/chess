import React, { useEffect, useRef, useState } from 'react'
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
import { IconButton } from '@material-ui/core'
import ReplayIcon from '@material-ui/icons/Replay'

// TODO: sound effect on win
export function MinichessRoom({ aiRoom, setLocalRoom, setAIRoom }) {
  const movetimeoutRef = useRef()
  const [turnIndex, setTurnIndex] = useState(0)
  const [selectedTile, selectTile] = useState()
  const [passantIndex, setPassantIndex] = useState(null)
  const [castleStatus, setCastleStatus] = useState('kqKQ')
  const [lastMoveIndex, setLastMoveIndex] = useState([])
  const [grid, setGrid] = useState(getInitialGrid('petty'))

  const resetGame = (
    type,
    shouldConfirm,
    confirmString = 'Are you sure you want to reset?',
  ) => {
    if (shouldConfirm) {
      const result = window.confirm(confirmString)
      if (!result) return
    }
    type && setConfig(type)
    setTurnIndex(0)
    clearTimeout(movetimeoutRef.current)
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
        clearTimeout(movetimeoutRef.current)
        movetimeoutRef.current = setTimeout(
          () =>
            setGrid((grid) => {
              const move = getAIMove(grid)
              move && moveTiles(...move)
              return grid
            }),
          1000,
        )
      }

      return selectTile(null)
    }

    if (tile.value && chess.turnIndex === (aiRoom ? 0 : tileType))
      selectTile(tile)
  }

  useEffect(() => {
    if (chess.inStaleMate) {
      resetGame(undefined, true, 'Stalemate! Do you want to reset?')
    }
  }, [chess.inStaleMate])

  useEffect(() => {
    if (chess.activeCheckmate && chess.turnIndex === 0) {
      resetGame(undefined, true, 'You lose! Do you want to reset?')
    }
  }, [chess.activeCheckmate, chess.turnIndex])

  return (
    <Flex className="container mini" variant="column">
      <Flex style={{ margin: '10px 0' }}>
        <select
          style={{
            flex: 1,
            fontSize: 14,
            textTransform: 'uppercase',
            padding: '0 10px',
          }}
          onChange={(e) => {
            resetGame(e.target.value, true)
          }}
        >
          {GAMES.map((g) => (
            <option value={g} key={g}>
              {LABELS[g]}
            </option>
          ))}
        </select>
        <IconButton onClick={() => resetGame(undefined, true)}>
          <ReplayIcon />
        </IconButton>
      </Flex>
      {chess.activeCheckmate && chess.turnIndex !== 0 && <WinState />}
      <ChessRoom
        {...chess}
        inStaleMate={false}
        alternate
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </Flex>
  )
}

const GAMES = ['petty', 'speed', 'quick', 'elena', 'attack', 'minit']
const LABELS = {
  petty: 'Petty Chess',
  speed: 'Speed Chess',
  attack: 'Chess Attack',
  quick: 'Quick Chess',
  elena: 'Elena Chess',
  minit: 'MiniChess',
}

const WinState = () => (
  <Flex
    variant="center"
    style={{
      color: '#03BD0B',
      fontFamily: 'sans-serif',
      fontWeight: 500,
      fontSize: 25,
      marginTop: 20,
      marginBottom: 25,
      lineHeight: '200%',
      textTransform: 'uppercase',
    }}
  >
    <span style={{ marginRight: 16 }}>You win!</span>
    <span>🎊</span>
    <a
      href="http://1234.56.digital/"
      target="_blank"
      rel="noreferrer"
      style={{ margin: '0 8px', color: '#F14E6B' }}
    >
      Click here
    </a>
    <span>🎊</span>
  </Flex>
)
