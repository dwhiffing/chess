import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Room } from './screens/Room'
import { Lobby } from './screens/Lobby'
import { Client } from 'colyseus.js'
import './index.css'

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://daniel-online-chess.herokuapp.com'
    : 'ws://localhost:3553',
)

// TODO: clearer indication of current turn
// TODO: stalemate detection
// TODO: checkmate detection
// TODO: win detection
// TODO: server based gameplay

// TODO: castling
// TODO: en passant
// TODO: AI

function App() {
  const [room, setRoom] = useState()
  return room ? (
    <Room room={room} setRoom={setRoom} />
  ) : (
    <Lobby setRoom={setRoom} />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
