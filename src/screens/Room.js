import React, { useCallback, useEffect, useState } from 'react'
import { Flex } from '../components/Flex'
import { Action } from '../components/Action'
import * as icons from '../assets'

const initialGrid =
  'RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr'

export function Room({ room, setRoom }) {
  const [grid, setGrid] = useState(
    initialGrid.split('').map((i, index) => ({ value: i, index })),
  )
  const [highlightedTile, setHighlightedTile] = useState([])
  const [selectedTile, setSelectedTile] = useState()

  const handleClickTile = useCallback(
    ({ isOnActiveTeam, tile, isHighlighted, reachableCoords }) => {
      if (selectedTile) {
        // if (otherUnit) battle.grid.withdrawUnit(otherUnit.id)
        setGrid((g) =>
          g.map((_tile) => ({
            ..._tile,
            value:
              _tile.index === tile.index
                ? selectedTile.value
                : _tile.index === selectedTile.index
                ? tile.value
                : _tile.value,
          })),
        )

        setSelectedTile(undefined)
        setHighlightedTile(undefined)

        // battle.nextTurn()

        return
      }
      if (selectedTile && selectedTile.index === tile.index) {
        setSelectedTile(undefined)
      } else {
        setSelectedTile(tile)
        setHighlightedTile(undefined)
      }
    },
    [setSelectedTile, selectedTile, setHighlightedTile],
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
      <Action onClick={() => room.leave()}>Leave</Action>
      <div className="grid" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {grid.map((tile) => {
          const isOnActiveTeam = true
          const reachableCoords = []
          const isHighlighted = highlightedTile === tile
          return (
            <Tile
              tile={tile}
              isSelected={selectedTile === tile}
              isHighlighted={highlightedTile === tile}
              onMouseEnter={() => setHighlightedTile(tile)}
              onClick={() =>
                handleClickTile({
                  isOnActiveTeam,
                  isHighlighted,
                  tile,
                  reachableCoords,
                })
              }
            />
          )
        })}
      </div>
    </Flex>
  )
}

const Tile = ({ tile, isHighlighted, isSelected, onClick, onMouseEnter }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`tile ${isHighlighted ? 'highlighted' : ''} ${
      isSelected ? 'selected' : ''
    } ${
      (tile.index + (Math.floor(tile.index / 8) % 2 === 0 ? 1 : 0)) % 2 === 0
        ? 'dark'
        : ''
    }`}
  >
    {tile.value !== ' ' ? <img src={icons[tile.value]} alt="piece" /> : null}
  </div>
)
