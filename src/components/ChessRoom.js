import React from 'react'
import { Tile } from './Tile'
import { getPossibleMoves } from '../../lib/chess'

export function ChessRoom({
  grid,
  turnIndex,
  inCheckMate,
  inCheck,
  inStaleMate,
  selectedTile,
  handleClickTile,
}) {
  if (!grid) return null

  return (
    <>
      {inStaleMate && 'Stalemate!'}
      {inCheckMate && `Checkmate! ${turnIndex === 0 ? 'Black' : 'White'} Wins`}
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
              tile={{ ...tile, isTurn, isMarked }}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </>
  )
}
