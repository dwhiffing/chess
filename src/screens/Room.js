import React, { useEffect, useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import P from '../assets/bP.png'
import p from '../assets/wP.png'
import Q from '../assets/bQ.png'
import q from '../assets/wQ.png'
import K from '../assets/bK.png'
import k from '../assets/wK.png'
import B from '../assets/bB.png'
import b from '../assets/wB.png'
import R from '../assets/bR.png'
import r from '../assets/wR.png'
import N from '../assets/bN.png'
import n from '../assets/wN.png'
const icons = { P, p, Q, q, K, k, B, b, R, r, N, n }

const initialGrid =
  'RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr'

export function Room({ room, setRoom }) {
  const [grid, setGrid] = useState(
    initialGrid.split('').map((i, index) => ({ value: i, index })),
  )
  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => {
      if (!state.players.toJSON().some((p) => p.id === room.sessionId)) {
        room.leave()
        localStorage.removeItem(room.id)
        // setServerState(initialRoomState)
        setRoom()
      }
      // setServerState({ ...state })
    })

    room.onMessage('message', (opts) => {
      // setMessage(opts)
      // setTimeout(() => setMessage(''), 5000)
    })

    room.onLeave(() => {
      localStorage.removeItem(room.id)
      // setServerState(initialRoomState)
      setRoom()
    })
  }, [room, setRoom])

  return (
    <Flex variant="column">
      <Action
        onClick={() => {
          room.leave()
        }}
      >
        Leave
      </Action>
      <Grid grid={grid} renderItem={(tile) => <Tile tile={tile} />} />
    </Flex>
  )
}

const Tile = ({ tile }) => (
  <div
    className={`tile ${
      (tile.index + (Math.floor(tile.index / 8) % 2 === 0 ? 1 : 0)) % 2 === 0
        ? 'dark'
        : ''
    }`}
  >
    {tile.value !== ' ' ? <img src={icons[tile.value]} alt="piece" /> : null}
  </div>
)

const Grid = ({ grid, renderItem }) => (
  <div className="grid" style={{ display: 'flex', flexWrap: 'wrap' }}>
    {grid.map((item, index) => renderItem(item, { index }))}
  </div>
)
