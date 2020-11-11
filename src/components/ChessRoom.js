import React from 'react'
import { Tile } from './Tile'
import { getPossibleMoves } from '../../lib/chess'

// TODO: highlight stalemate
// TODO: animate moves

export function ChessRoom({
  grid,
  turnIndex,
  lastMoveIndex,
  activeCheckmate,
  activeCheck,
  inStaleMate,
  selectedTile,
  handleClickTile,
}) {
  if (!grid) return null

  return (
    <>
      {inStaleMate && 'Stalemate!'}
      {activeCheckmate &&
        `Checkmate! ${turnIndex === 0 ? 'Black' : 'White'} Wins`}
      <div className="grid">
        {grid.map((tile) => {
          const isMarked =
            selectedTile &&
            getPossibleMoves(grid, selectedTile).includes(tile.index)
          const isTurn =
            turnIndex === 1
              ? tile.value && tile.value === tile.value.toUpperCase()
              : tile.value && tile.value === tile.value.toLowerCase()

          return (
            <Tile
              key={tile.index}
              selectedTile={selectedTile}
              lastMoveIndex={lastMoveIndex}
              tile={{ ...tile, isTurn, isMarked, activeCheck }}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </>
  )
}
