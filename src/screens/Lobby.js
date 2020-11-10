import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Typography, TextField } from '@material-ui/core'
import { Flex } from '../components/Flex'
import faker from 'faker'
import truncate from 'lodash/truncate'
import { Action } from '../components/Action'

export function Lobby({ setRoom, setLocalRoom, setAIRoom }) {
  const intervalRef = useRef()
  const autoConnectAttempted = useRef(false)
  const [availableRooms, setAvailableRooms] = useState([])
  const [name, setName] = useState(
    localStorage.getItem('name') || faker.name.firstName(),
  )

  const enterRoom = useCallback(
    (room, name) => {
      localStorage.setItem('name', name)
      localStorage.setItem(room.id, room.sessionId)
      setRoom(room)
    },
    [setRoom],
  )

  const createRoom = useCallback(
    async (name) => {
      const roomName = prompt('Room name?')
      if (!roomName) return

      const colyseus = window.colyseus
      const room = await colyseus.create('online-chess', { roomName, name })
      enterRoom(room, name)
    },
    [enterRoom],
  )

  const joinRoom = useCallback(
    async (roomId, name) => {
      try {
        const room = await joinRoomWithReconnect(roomId, name)
        if (!room) throw new Error('Failed to join room')
        enterRoom(room, name)
      } catch (e) {
        alert(e)
        localStorage.removeItem(roomId)
      }
    },
    [enterRoom],
  )

  const getAvailableRooms = useCallback(
    async () => setAvailableRooms(await window.colyseus.getAvailableRooms()),
    [],
  )

  useEffect(() => {
    getAvailableRooms()
    intervalRef.current = setInterval(getAvailableRooms, 3000)
    return () => clearInterval(intervalRef.current)
  }, [getAvailableRooms])

  useEffect(() => {
    if (!availableRooms) return
    const lastRoom = availableRooms.find((room) =>
      localStorage.getItem(room.roomId),
    )

    if (lastRoom && !autoConnectAttempted.current) {
      autoConnectAttempted.current = true
      joinRoom(lastRoom.roomId, name)
    }
  }, [availableRooms, joinRoom, name])

  return (
    <Flex variant="column center" style={{ height: '100vh' }}>
      <TextField
        placeholder="Enter name"
        value={name}
        style={{ marginBottom: 20 }}
        onChange={(e) =>
          setName(truncate(e.target.value, { length: 10, omission: '' }))
        }
      />

      <Typography variant="h5">Available Tables:</Typography>

      <Flex flex={0} variant="column center" style={{ minHeight: 200 }}>
        {availableRooms.length === 0 && (
          <Typography>No rooms available</Typography>
        )}

        {availableRooms.map((room) => (
          <RoomListItem
            key={room.roomId}
            room={room}
            onClick={() => joinRoom(room.roomId, name)}
          />
        ))}
      </Flex>

      <Action onClick={() => createRoom(name)}>Create room</Action>
      <Action onClick={() => setLocalRoom(true)}>Play local game</Action>
      <Action onClick={() => setAIRoom(true)}>Play local game vs AI</Action>
    </Flex>
  )
}

const RoomListItem = ({ room, onClick }) => (
  <Box>
    <Typography
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={onClick}
    >
      {room.metadata.roomName || room.roomId}
    </Typography>
  </Box>
)

const joinRoomWithReconnect = async (roomId, name) => {
  let room,
    sessionId = localStorage.getItem(roomId)

  if (sessionId) {
    try {
      room = await window.colyseus.reconnect(roomId, sessionId)
    } catch (e) {}
  } else {
    room = room || (await window.colyseus.joinById(roomId, { name }))
  }

  return room
}
