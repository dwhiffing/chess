import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Room } from './screens/Room'
import { Lobby } from './screens/Lobby'
import { LocalRoom } from './screens/LocalRoom'
import { Client } from 'colyseus.js'
import './index.css'

window.colyseus = new Client(
  process.env.NODE_ENV === 'production'
    ? 'wss://daniel-online-chess.herokuapp.com'
    : 'ws://localhost:3553',
)

// TODO: castling
// TODO: en passant
// TODO: AI

function App() {
  const [room, setRoom] = useState()
  const [localRoom, setLocalRoom] = useState()
  const state = { room, setRoom, localRoom, setLocalRoom }
  return localRoom ? (
    <LocalRoom {...state} />
  ) : room ? (
    <Room {...state} />
  ) : (
    <Lobby {...state} />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
