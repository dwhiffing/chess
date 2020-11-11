import React from 'react'
import { Tile } from './Tile'
import { getPossibleMoves } from '../../lib/chess'

export function ChessRoom({
  grid,
  turnIndex,
  lastMoveIndex,
  activeCheckmate,
  activeCheck,
  inStaleMate,
  selectedTile,
  handleClickTile,
  passantIndex,
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
            getPossibleMoves(grid, selectedTile, { passantIndex }).includes(
              tile.index,
            )
          const isTurn =
            turnIndex === 1
              ? tile.value && tile.value === tile.value.toUpperCase()
              : tile.value && tile.value === tile.value.toLowerCase()

          return (
            <Tile
              key={tile.index}
              selectedTile={selectedTile}
              lastMoveIndex={lastMoveIndex}
              passantIndex={passantIndex}
              tile={{ ...tile, isTurn, isMarked, activeCheck }}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </>
  )
}
