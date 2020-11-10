import React from 'react'
import * as icons from '../assets'

export const Tile = ({
  tile,
  hoveredTile,
  selectedTile,
  onClick,
  onMouseEnter,
}) => {
  const isHighlighted = hoveredTile && hoveredTile.index === tile.index
  const isSelected = selectedTile && selectedTile.index === tile.index
  return (
    <div
      onClick={() => onClick({ tile, isHighlighted, isSelected })}
      onMouseEnter={onMouseEnter}
      className={`tile ${tile.isTurn ? 'turn' : ''} ${
        isHighlighted && !isSelected ? 'highlighted' : ''
      } ${isSelected ? 'selected' : ''} ${
        (tile.index + (Math.floor(tile.index / 8) % 2 === 0 ? 1 : 0)) % 2 === 0
          ? 'dark'
          : ''
      }`}
    >
      <div>
        {tile.value ? <img src={icons[tile.value]} alt="piece" /> : null}
        {tile.isMarked ? (
          <div className={tile.value ? 'attack' : 'mark'} />
        ) : null}
      </div>
    </div>
  )
}
