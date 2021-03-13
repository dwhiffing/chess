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
import useSound from 'use-sound'
import winSound from '../assets/assets_audio_win.mp3'

export function MinichessRoom({ aiRoom }) {
  const movetimeoutRef = useRef()
  const [turnIndex, setTurnIndex] = useState(0)
  const [gameType, setGameType] = useState('petty')
  const [selectedTile, selectTile] = useState()
  const [passantIndex, setPassantIndex] = useState(null)
  const [castleStatus, setCastleStatus] = useState('kqKQ')
  const [lastMoveIndex, setLastMoveIndex] = useState([])
  const [grid, setGrid] = useState(getInitialGrid(gameType))

  const resetGame = (type) => {
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
    resetGame(gameType)
  }, [gameType])

  const [playWinSound] = useSound(winSound, {
    preload: true,
    html5: true,
  })

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
      const shouldReset = window.confirm('Stalemate! Do you want to reset?')
      if (shouldReset) resetGame()
    }
  }, [chess.inStaleMate])

  useEffect(() => {
    if (chess.activeCheckmate && chess.turnIndex === 0) {
      const shouldReset = window.confirm('You lose! Do you want to reset?')
      if (shouldReset) resetGame()
    }
    if (chess.activeCheckmate && chess.turnIndex !== 0) {
      playWinSound()
    }
  }, [chess.activeCheckmate, chess.turnIndex, playWinSound])

  return (
    <div className="container mini">
      <div
        style={{
          height: '35vw',
          maxHeight: 135,
          minHeight: 100,
        }}
      >
        <Flex style={{ margin: '10px auto', maxWidth: 500 }}>
          <select
            value={gameType}
            onChange={(e) => {
              const shouldReset = window.confirm(
                'Are you sure you want to reset?',
              )
              if (shouldReset) setGameType(e.target.value)
            }}
          >
            {GAMES.map((g) => (
              <option value={g} key={g}>
                {LABELS[g]}
              </option>
            ))}
          </select>
          <IconButton
            disableRipple
            disableFocusRipple
            onClick={() => {
              const shouldReset = window.confirm(
                'Are you sure you want to reset?',
              )
              if (shouldReset) resetGame()
            }}
          >
            <ReplayIcon />
          </IconButton>
        </Flex>
        {chess.activeCheckmate && chess.turnIndex !== 0 && <WinState />}
      </div>
      <ChessRoom
        {...chess}
        alternate
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />
    </div>
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
  <Flex variant="center" className="win-state">
    <span>You win!</span>
    <span>🎊</span>
    <a href="http://1234.56.digital/" target="_blank" rel="noreferrer">
      Click here
    </a>
    <span>🎊</span>
  </Flex>
)
