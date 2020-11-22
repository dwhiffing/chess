import { useEffect, useState } from 'react'

export const useRoomState = ({ room, setRoom }) => {
  const [serverState, setServerState] = useState(room.state.toJSON())

  useEffect(() => {
    if (!room) return

    room.onStateChange((state) => {
      setServerState(state.toJSON())
    })

    // room.onMessage('message', (opts) => {
    // setMessage(opts)
    // setTimeout(() => setMessage(''), 5000)
    // })
    room.onLeave((code) => {
      if (code === 1000) localStorage.removeItem(room.id)
      setServerState({})
      setRoom()
    })
  }, [room, setRoom])

  return [serverState]
}
