import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import { Tile } from '../components/Tile'
import { useRoomState } from '../utils/useRoomState'
import { useChess } from '../utils/useChess'

export function Room({ room, setRoom }) {
  const [roomState] = useRoomState({ room, setRoom })
  const [selectedTile, selectTile] = useState()
  const chess = useChess()

  console.log(roomState)

  const handleClickTile = ({ tile }) => {
    if (roomState.inCheckMate) return
    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      if (chess.canTileMove(selectedTile, tile)) {
        room.send('Move', { from: selectedTile, to: tile })
        chess.moveTile(selectedTile, tile)
      }

      selectTile(null)
      return
    }

    if (tile.value && roomState.turnIndex === tileType) selectTile(tile)
  }

  return (
    <Flex variant="column">
      <Action onClick={() => room.leave()}>Leave</Action>
      {roomState.inStaleMate && 'Stalemate!'}
      {roomState.inCheckMate &&
        `Checkmate! ${roomState.turnIndex === 0 ? 'Black' : 'White'} Wins`}
      <div className="grid">
        {roomState.grid.map((tile) => {
          const isMarked = selectedTile && chess.canTileMove(selectedTile, tile)
          const isTurn =
            roomState.turnIndex === 1
              ? tile.value && tile.value === tile.value.toUpperCase()
              : tile.value && tile.value === tile.value.toLowerCase()

          return (
            <Tile
              key={tile.index}
              selectedTile={selectedTile}
              tile={{ ...tile, isTurn, isMarked }}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </Flex>
  )
}
