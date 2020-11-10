import React, { useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import { Tile } from '../components/Tile'
import { useRoomState } from '../utils/useRoomState'
import { useChess } from '../utils/useChess'

export function Room({ room, setRoom }) {
  const [roomState] = useRoomState({ room, setRoom })
  const [hoveredTile, hoverTile] = useState(null)
  const [selectedTile, selectTile] = useState()
  const chess = useChess()

  const handleClickTile = ({ tile }) => {
    const tileType =
      tile.value && tile.value === tile.value.toLowerCase() ? 0 : 1

    if (selectedTile) {
      if (selectedTile.index === tile.index) {
        return selectTile(null)
      }

      if (chess.canTileMove(selectedTile, tile)) {
        chess.moveTile(selectedTile, tile)
      }

      selectTile(null)
      return
    }

    if (tile.value && chess.turnIndex === tileType) selectTile(tile)
  }

  return (
    <Flex variant="column">
      <Action onClick={() => room.leave()}>Leave</Action>
      <div className="grid">
        {chess.grid.map((tile) => {
          const isMarked = selectedTile && chess.canTileMove(selectedTile, tile)
          const isTurn =
            chess.turnIndex === 1
              ? tile.value && tile.value === tile.value.toUpperCase()
              : tile.value && tile.value === tile.value.toLowerCase()

          return (
            <Tile
              key={tile.index}
              hoveredTile={hoveredTile}
              selectedTile={selectedTile}
              tile={{ ...tile, isTurn, isMarked }}
              onMouseEnter={() => hoverTile(tile)}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </Flex>
  )
}
