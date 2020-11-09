import React, { useEffect } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'

export function Room({ room, setRoom }) {
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
    <Flex variant="column" style={{ paddingTop: 70, paddingBottom: 200 }}>
      <Action
        onClick={() => {
          console.log('test')
          room.leave()
        }}
      >
        Leave
      </Action>
      Hello
    </Flex>
  )
}
