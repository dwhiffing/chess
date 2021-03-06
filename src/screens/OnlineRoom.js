import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import { useRoomState } from '../utils/useRoomState'
import { ChessRoom } from '../components/ChessRoom'

export function OnlineRoom({ room, setRoom }) {
  const [roomState] = useRoomState({ room, setRoom })
  const [selectedTile, selectTile] = useState()
  const clientPlayer = (roomState.players || []).find(
    (p) => p.id === room.sessionId,
  )

  const whitePlayer = (roomState.players || []).find((p) => p.team === 0)
  const blackPlayer = (roomState.players || []).find((p) => p.team === 1)

  const handleClickTile = ({ tile }) => {
    if (roomState.activeCheckmate || clientPlayer.team !== roomState.turnIndex)
      return

    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      room.send('Move', { from: selectedTile, to: tile })

      selectTile(null)
      return
    }

    if (tile.value && roomState.turnIndex === tileType) selectTile(tile)
  }

  return (
    <Flex className="container full" variant="column">
      <Action onClick={() => room.leave()}>Leave</Action>

      {blackPlayer &&
        `${blackPlayer.name} ${blackPlayer.connected ? '' : '(disconnected)'}`}

      <ChessRoom
        {...roomState}
        showMessages
        activeCheck={
          roomState.activeCheck && roomState.activeCheck.length > 0
            ? roomState.activeCheck
            : false
        }
        selectedTile={selectedTile}
        handleClickTile={handleClickTile}
      />

      {whitePlayer &&
        `${whitePlayer.name} ${whitePlayer.connected ? '' : '(disconnected)'}`}
    </Flex>
  )
}
