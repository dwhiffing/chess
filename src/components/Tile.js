import React from 'react'
import * as icons from '../assets'
import { config } from '../../lib/chess'

export const Tile = ({
  tile,
  selectedTile,
  passantIndex,
  onClick,
  onMouseEnter,
  lastMoveIndex,
}) => {
  const isSelected = selectedTile && selectedTile.index === tile.index
  const highlightCheck =
    tile.activeCheck &&
    tile.value &&
    tile.activeCheck.some(
      (c) => c.to.includes(tile.index) || c.from === tile.index,
    )
  const offset =
    config.width % 2 === 0
      ? Math.floor(tile.index / config.width) % 2 === 0
        ? 1
        : 0
      : 0
  const classes = [
    'tile',
    lastMoveIndex.includes(tile.index) && 'last-move',
    tile.isTurn && 'turn',
    isSelected && 'selected',
    highlightCheck && 'check',
    (tile.index + offset) % 2 === 0 && 'dark',
  ].filter((s) => !!s)

  return (
    <div
      onClick={() => onClick({ tile })}
      onMouseEnter={onMouseEnter}
      className={classes.join(' ')}
      style={{ flex: `0 0 ${100 / config.width}%` }}
    >
      <div>
        {tile.value ? <img src={icons[tile.value]} alt="piece" /> : null}
        {tile.isMarked ? (
          <div
            className={
              tile.value || tile.index === passantIndex ? 'attack' : 'mark'
            }
          />
        ) : null}
      </div>
    </div>
  )
}
